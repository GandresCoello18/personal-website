# LinkedIn Job Discovery Monitor — Implementation Plan

> **Status:** Planning only. No code in this document.  
> **Constraint:** Do not redesign the existing `/apply` application/email module. Reuse it.

---

## 1. Goal

Add an automated **LinkedIn Job Discovery** pipeline that:

1. Opens LinkedIn with a **persistent Playwright browser profile**
2. Reads the feed and extracts new posts
3. Skips already-processed posts
4. Applies **rule-based keyword filters** before any LLM call
5. Invokes Gemini **only** for promising posts
6. Reuses the existing apply pipeline (`analyze` → `draft` → `send`)
7. Runs on a **configurable weekday/hour schedule**
8. Exposes a **minimal private dashboard** of run stats

Simplicity first: one Node worker script + JSON file storage + thin Next.js UI for status. No new frameworks, no database unless proven necessary later.

---

## 2. Current Architecture (baseline)

The site is a **Next.js App Router** project (TypeScript, Zod, Gemini, Nodemailer). There is **no cron**, **no Playwright**, and **no application history DB** today.

### 2.1 Existing apply pipeline (do not redesign)

| Layer | Path | Responsibility |
|-------|------|----------------|
| UI | `app/apply/page.tsx`, `components/apply/*`, `hooks/use-apply-flow.ts` | Manual paste/screenshot → preview → send |
| Auth | `lib/apply/auth.ts` | Cookie `apply_unlock` + `APPLY_ACCESS_SECRET` |
| Analyze | `services/apply/analyze.ts` → `analyzeJobPosting` | Gemini extract (`extractJobFromText` / `extractJobFromImage`) |
| Draft | `services/apply/draft.ts` → `draftFromExtract` | CV text + `writeApplicationEmail` |
| Send | `services/apply/send-application.ts` → `sendJobApplication` | HTML template + PDF + Nodemailer |
| Types | `lib/apply/types.ts` | `JobExtract`, `EmailDraft`, `SendApplicationPayload`, `CONFIDENCE_THRESHOLD` |
| AI | `lib/ai/gemini.ts`, `lib/ai/prompts/*` | Model calls |
| Mail | `services/mail/transporter.ts` | SMTP |

Manual flow today:

```
unlock cookie → analyzeJobPosting → (user edits) → draftFromExtract → sendJobApplication
```

### 2.2 Persistence today

- Repo files: `content/cv/*.txt`, `public/pdf/*.pdf`
- Env secrets: Gemini + Gmail + apply gate
- Cookie unlock only
- **No writeable store** for applications or job history

### 2.3 Deployment implication (critical)

The public site runs on **Vercel serverless**. Playwright + a persistent Chromium profile **cannot** run reliably inside Vercel Functions / Vercel Cron.

Therefore the monitor must run as a **separate long-lived (or machine-local) Node process**, while the Next.js app only:

- Serves a private status dashboard
- Optionally exposes a protected “last run” JSON read API
- Continues to own the apply *services* as shared library code

---

## 3. Target Workflow

```
Scheduler (cron / node-cron)
        ↓
Node worker (scripts/linkedin-monitor)
        ↓
Playwright → persistent profile → LinkedIn feed
        ↓
Extract posts (id, text, url, author, timestamp)
        ↓
Dedupe against processed-posts store
        ↓
Rule-based filter (positive / negative keywords)
        ↓
[reject] → mark processed (reason: filtered) → stop
        ↓
[pass] → analyzeJobPosting({ mode: "text", text })
        ↓
Gate: email present + category ≠ unknown + confidence ≥ threshold
        ↓
draftFromExtract → sendJobApplication
        ↓
Save run result + application history
        ↓
Dashboard reads JSON status files
```

Human preview in `/apply` remains available for edge cases; v1 of the monitor may auto-send only when gates pass, and skip/log otherwise (no silent spam).

---

## 4. Recommended Folder Structure

Align with existing `app/`, `lib/`, `services/` conventions. Add a worker under `scripts/` because scraping is not a Vercel request handler.

```
personal-website/
├── scripts/
│   └── linkedin-monitor/
│       ├── run.ts                 # entrypoint (one full cycle)
│       ├── browser.ts             # Playwright launch + persistent context
│       ├── feed.ts                # navigate, scroll, extract posts
│       ├── filter.ts              # keyword rules
│       ├── pipeline.ts            # glue: filter → analyze → draft → send
│       ├── store.ts               # read/write JSON under data/
│       └── schedule.ts            # optional in-process node-cron wrapper
├── lib/
│   └── linkedin-monitor/
│       ├── types.ts               # Post, RunSummary, FilterResult, Config
│       ├── keywords.ts            # load + match helpers (pure, testable)
│       └── constants.ts
├── services/
│   └── linkedin-monitor/
│       ├── process-post.ts        # orchestrates reuse of apply services
│       └── status.ts              # aggregate stats for dashboard API
├── data/                          # gitignored runtime state
│   └── linkedin-monitor/
│       ├── config.json            # schedule + behavior flags (local overrides)
│       ├── processed-posts.json
│       ├── applications.json
│       ├── runs.json              # last N run summaries
│       └── browser-profile/       # Playwright userDataDir (secrets!)
├── content/
│   └── linkedin-monitor/
│       └── keywords.json          # positive/negative lists (versioned in git)
├── app/
│   ├── monitor/page.tsx           # minimal private dashboard
│   └── api/
│       └── monitor/
│           └── status/route.ts    # read-only status JSON
└── docs/
    └── linkedin-job-monitor-plan.md  # this file
```

**Also update (when implementing):**

- `.gitignore` → ignore `data/linkedin-monitor/` (especially `browser-profile/`)
- `.env.example` → document `LINKEDIN_MONITOR_*` vars
- `app/robots.ts` → disallow `/monitor`, `/api/monitor`
- `package.json` → scripts `monitor:run`, `monitor:schedule` + Playwright dep

---

## 5. LinkedIn Monitoring (Playwright)

### 5.1 Integration

- Add **`playwright`** as a **devDependency** (or dependency of the worker only). It is the one new dependency with clear value: reliable browser automation + persistent contexts.
- Do **not** run Playwright inside Next.js API routes on Vercel.
- Worker entry: `pnpm monitor:run` → `tsx scripts/linkedin-monitor/run.ts` (or `node --import tsx`).

### 5.2 Persistent browser profile

| Concern | Recommendation |
|---------|----------------|
| Mechanism | `chromium.launchPersistentContext(userDataDir, { headless: false|true })` |
| Path | `data/linkedin-monitor/browser-profile/` (absolute path resolved at runtime) |
| Git | **Must be gitignored** — cookies/session tokens live here |
| Backup | Optional manual zip of the folder on the host machine; never commit |

### 5.3 One-time login

1. First run in **headed** mode (`headless: false`).
2. Navigate to `https://www.linkedin.com/login`.
3. Operator logs in manually (2FA allowed).
4. Session cookies persist in `userDataDir`.
5. Subsequent scheduled runs reuse the same profile in headless (or headed if LinkedIn blocks headless).

Optional env flag: `LINKEDIN_MONITOR_HEADED=1` for recovery when session expires.

### 5.4 Feed navigation & scrolling

1. Open `https://www.linkedin.com/feed/` (or a saved search URL if later needed; v1 = main feed).
2. Wait for feed container selectors (centralize selectors in `feed.ts`).
3. Scroll N times (config: `scrollPasses`, default 3–5) with short delays to load more posts.
4. Collect visible post cards after each scroll; union by post id.
5. Stop early if no new ids appear after a scroll (diminishing returns).

### 5.5 Post extraction

For each card, extract a stable record:

```ts
type LinkedInPost = {
  id: string          // urn / data-urn / permalink id — best available stable key
  url: string | null
  author: string | null
  text: string
  scrapedAt: string   // ISO
}
```

**ID strategy:** prefer LinkedIn URN / activity id from DOM attributes or permalink query. Fallback: hash of `author + first 200 chars of text` (weaker; document as fallback).

### 5.6 Duplicate avoidance

1. Load `processed-posts.json` → `Set<id>`.
2. Skip if id already present.
3. After handling (filtered / applied / skipped / error), **append** id with metadata:

```json
{
  "id": "...",
  "status": "filtered_negative|filtered_no_positive|applied|skipped_no_email|error",
  "at": "2026-07-29T16:00:00.000Z"
}
```

Never re-LLM a processed id unless an explicit “reprocess” flag exists (out of scope for v1).

### 5.7 Where posts live

| Data | Store |
|------|--------|
| Raw newly seen posts (optional debug) | `data/linkedin-monitor/raw-posts.jsonl` (optional; keep off by default to save disk) |
| Processed ids | `processed-posts.json` |
| Successful applications | `applications.json` |
| Run summaries | `runs.json` (keep last ~50) |

---

## 6. Rule-Based Filtering (before LLM)

### 6.1 Purpose

Cut obvious noise cheaply so Gemini is only called for posts that look like relevant job openings.

### 6.2 Suggested default keywords

**Positive (must match at least one, configurable):**  
React, Next.js, TypeScript, Node.js, JavaScript, Frontend, Backend, Full Stack, Remote, AWS, Azure, Cloud, API, AI, LLM

**Negative (reject if matched, configurable):**  
Java, Spring Boot, .NET, C#, Go, Golang, PHP, SAP, COBOL, QA Manual, Salesforce

### 6.3 Matching rules (v1)

1. Normalize text: lowercase, collapse whitespace.
2. Keyword match: case-insensitive substring or word-boundary where needed (e.g. avoid matching “go” inside “golang” incorrectly — prefer phrase lists and longer tokens).
3. Order:
   - If **any negative** → reject (`filtered_negative`)
   - Else if **no positive** → reject (`filtered_no_positive`)
   - Else → pass to LLM
4. Optional cheap gate: require job-ish cues (`hiring`, `looking for`, `we're hiring`, `vacante`, `puesto`, `remote`, `full-time`) — start soft; tune after observing false negatives.

### 6.4 Making lists configurable (recommended strategy)

| Layer | Role |
|-------|------|
| `content/linkedin-monitor/keywords.json` | **Source of truth in git** — easy to edit/review in PRs |
| `data/linkedin-monitor/config.json` | Local overrides (schedule, headless, maxPosts, autoSend) — not committed |
| Env | Only secrets and paths (`LINKEDIN_MONITOR_PROFILE_DIR`, cron secret) |

`keywords.json` shape:

```json
{
  "positive": ["React", "Next.js", "..."],
  "negative": ["Java", "Spring Boot", "..."],
  "jobSignals": ["hiring", "we're hiring", "vacante"]
}
```

Loader merges: defaults → git keywords → optional local override file if present. No UI editor in v1.

---

## 7. LLM + Apply Integration (reuse, don’t duplicate)

### 7.1 Cleanest connection point

Call **existing service functions directly** from the worker, not HTTP `/api/apply/*`.

Reasons:

- Avoid cookie unlock complexity in cron
- Same Zod validation and CV mapping as the UI
- No duplicated Gemini prompts

Pipeline in `services/linkedin-monitor/process-post.ts` (conceptual):

```
1. analyzeJobPosting({ mode: "text", text: post.text })
2. If emailMissing → log skipped_no_email, mark processed, stop
3. If needsManualCv / category unknown → log skipped_unknown_category, stop
   (v1: do not invent category; optional later: force software if keywords strongly match)
4. If confidence < CONFIDENCE_THRESHOLD → skip or quarantine
5. draftFromExtract({ extract })
6. If config.autoSend === true → sendJobApplication({ ... })
7. Else → write to applications.json as "draft_ready" for manual send via /apply
```

**Recommendation for v1:** `autoSend: false` by default; set `true` only after observing filter quality. Safer first increment: stop at draft + history, then enable send.

### 7.2 What not to change

- Do not merge analyze+draft into one Gemini call.
- Do not change `/apply` UI flow.
- Do not replace Nodemailer.
- Optional tiny additive helpers only if needed (e.g. `buildSendPayload(result)` shared by UI and monitor) — prefer extracting from existing types without behavior change.

### 7.3 Auth for dashboard / status API

Reuse the same `APPLY_ACCESS_SECRET` + `apply_unlock` cookie pattern as `/apply` and `/interview`. No new auth system.

Optional worker-only secret `LINKEDIN_MONITOR_CRON_SECRET` if a future HTTP trigger is added; not required for local cron.

---

## 8. Scheduling

### 8.1 Requirements

- Specific weekdays
- Specific hours
- Configurable

### 8.2 Recommendation: OS cron (or Task Scheduler) + one-shot script

**Simplest for this repo:**

```bash
# Example: Mon–Fri at 09:00 and 14:00 (host timezone)
0 9,14 * * 1-5 cd /path/to/personal-website && pnpm monitor:run >> data/linkedin-monitor/cron.log 2>&1
```

On Windows (operator’s machine): Task Scheduler calling `pnpm monitor:run`.

Alternative in-process: `node-cron` inside `pnpm monitor:schedule` for a always-on VPS — useful if the host stays up. Still one process, no new orchestration framework.

### 8.3 Why not Vercel Cron as the primary runner

Vercel Cron can hit an API route on a schedule, but **cannot** host Playwright + persistent LinkedIn profile. Using Vercel Cron only as a “ping” that SSHs elsewhere adds complexity with no benefit for v1.

### 8.4 Config shape (local)

```json
{
  "timezone": "America/Guayaquil",
  "weekdays": [1, 2, 3, 4, 5],
  "hours": [9, 14],
  "maxPostsPerRun": 30,
  "scrollPasses": 4,
  "autoSend": false,
  "headless": true
}
```

If using OS cron, weekdays/hours live in the crontab; the JSON still documents intent and controls runtime limits. If using `node-cron`, read schedule from JSON.

**v1 does not require a manual “Run now” button** (per product request). Optional later.

---

## 9. Data Storage (minimum)

Reuse the project’s **file-based** style. Do **not** introduce Postgres/Redis for v1.

| Store | Format | Purpose |
|-------|--------|---------|
| `processed-posts.json` | JSON map/array | Dedupe |
| `applications.json` | JSON array | Application / draft history |
| `runs.json` | JSON array | Last execution summaries for dashboard |
| `config.json` | JSON | Local runtime config |
| `keywords.json` | JSON in `content/` | Versioned filters |
| `browser-profile/` | Chromium dir | Session |
| `cron.log` | text | Optional append-only logs |

Cap array sizes (e.g. keep last 500 processed ids metadata; last 50 runs) to avoid unbounded growth.

Sync note: if the dashboard runs on Vercel but the worker writes files on a laptop, **Vercel will not see those files**. For v1, run the dashboard against the **same machine** that runs the worker (`next dev` / self-hosted), **or** have the worker copy `runs.json` to a private gist / Blob later. Prefer same-machine first; document the split-host limitation.

---

## 10. Minimal Dashboard

Private page: `/monitor` (same unlock gate as `/apply`).

Show only:

| Metric | Source |
|--------|--------|
| Last execution time | `runs.json[0].finishedAt` |
| Posts analyzed (seen this run) | `runs.json[0].postsSeen` |
| Matching jobs found | `runs.json[0].passedFilter` / `llmAccepted` |
| Applications sent | `runs.json[0].sent` |
| Errors | `runs.json[0].errors[]` (short messages) |

Optional: last 5 runs as a simple list. No charts, no analytics suite.

API: `GET /api/monitor/status` → reads JSON via `services/linkedin-monitor/status.ts`. Disallow in `robots.ts`.

---

## 11. Dependencies

| Dependency | Verdict |
|------------|---------|
| `playwright` | **Add** — required for browser automation |
| `tsx` (or `ts-node`) | **Add** (dev) — run TypeScript worker without a separate build |
| `node-cron` | **Optional** — only if in-process scheduling is preferred over OS cron |
| Database / queue / Bull / Redis | **Do not add** in v1 |
| Puppeteer | **Do not add** — Playwright covers the need |

---

## 12. Environment Variables

| Variable | Purpose |
|----------|---------|
| Existing `GEMINI_*`, `GMAIL_*` | Reused by apply services |
| Existing `APPLY_ACCESS_SECRET` | Dashboard gate |
| `LINKEDIN_MONITOR_PROFILE_DIR` | Optional override of profile path |
| `LINKEDIN_MONITOR_HEADED` | `1` for login recovery |
| `LINKEDIN_MONITOR_DATA_DIR` | Optional override of `data/linkedin-monitor` |
| `LINKEDIN_MONITOR_AUTO_SEND` | Override config autoSend |

---

## 13. Progressive Implementation Phases

Each phase ends in a **working increment**.

### Phase 1 — Scaffold + storage + filter (no LinkedIn yet)

**Goal:** Prove keyword filtering and JSON persistence offline.

**Files to create:**

- `content/linkedin-monitor/keywords.json`
- `lib/linkedin-monitor/types.ts`
- `lib/linkedin-monitor/keywords.ts`
- `scripts/linkedin-monitor/filter.ts`
- `scripts/linkedin-monitor/store.ts`
- `data/linkedin-monitor/.gitkeep` (or document gitignore-only)
- Update `.gitignore`

**Files to modify:** none of apply services.

**Expected outcome:** CLI can take a sample post text file and print `pass|reject` + reason; processed ids written to JSON.

---

### Phase 2 — Playwright login + feed scrape

**Goal:** Extract posts from LinkedIn with persistent session.

**Files to create:**

- `scripts/linkedin-monitor/browser.ts`
- `scripts/linkedin-monitor/feed.ts`
- `scripts/linkedin-monitor/run.ts` (scrape + dedupe + filter only)
- `package.json` scripts + Playwright install

**Files to modify:** `.env.example`, README snippet (optional).

**Expected outcome:** Operator logs in once; subsequent `pnpm monitor:run` prints new posts and marks filtered/processed without calling Gemini.

---

### Phase 3 — Wire existing apply services (dry-run)

**Goal:** LLM classify + draft without sending email.

**Files to create:**

- `services/linkedin-monitor/process-post.ts`
- Extend `pipeline.ts` / `run.ts`

**Files to modify:** none required in apply core; import `analyzeJobPosting`, `draftFromExtract` only.

**Expected outcome:** Matching posts produce `JobExtract` + email draft saved in `applications.json` with `status: "draft_ready"`.

---

### Phase 4 — Auto-send gate

**Goal:** Optionally call `sendJobApplication` under strict gates.

**Files to create/modify:**

- Config flag `autoSend`
- History write on success/failure

**Expected outcome:** With `autoSend: true`, eligible jobs send via existing Nodemailer path; ineligible jobs remain logged only.

---

### Phase 5 — Scheduling

**Goal:** Automatic weekday/hour execution.

**Files to create:**

- `scripts/linkedin-monitor/schedule.ts` (optional node-cron)
- Document OS cron / Task Scheduler commands in this doc or README

**Expected outcome:** Monitor runs unattended on the host; each run appends to `runs.json`.

---

### Phase 6 — Minimal dashboard

**Goal:** Private visibility into last run.

**Files to create:**

- `app/monitor/page.tsx`
- `components/monitor/monitor-dashboard.tsx` (thin)
- `app/api/monitor/status/route.ts`
- `services/linkedin-monitor/status.ts`

**Files to modify:**

- `app/robots.ts` (disallow)
- Reuse `AccessGate` from apply

**Expected outcome:** Unlocked user sees last execution metrics. No advanced analytics.

---

### Phase 7 — Hardening

**Goal:** Production readiness on the host machine.

**Work:** selector fallbacks, session-expiry detection (redirect to login → abort with clear error), rate-limit delays, log rotation, size caps on JSON stores, safer negative/positive tuning from real false positives.

**Expected outcome:** Stable daily runs with predictable failure modes.

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LinkedIn DOM changes | Scraper breaks | Isolate selectors in `feed.ts`; fail soft with screenshot dump to `data/`; version selectors; avoid brittle absolute XPaths |
| Auth / session expiration | No posts collected | Detect login page; set run error `session_expired`; run headed recovery; never store password in env for v1 |
| Duplicate detection weak | Double applications | Prefer URN/activity id; mark processed **before** send (or transactional: mark `sending` then `sent`); check `applications.json` by post id |
| Rate limiting / bot detection | Temporary block | Limit scroll passes; randomize short delays; low daily frequency (2×/weekday); respect LinkedIn ToS; prefer personal use only |
| LLM cost | Unnecessary spend | Strict pre-filter; max posts per run; reuse two-step analyze/draft; skip draft if extract fails gates |
| Scheduler failures | Missed jobs | OS cron logs; `runs.json` “missed” detection on dashboard (last run > 36h); keep process simple |
| Split deploy (Vercel vs worker host) | Dashboard empty on production | Document: status files are host-local in v1; or sync later via Blob |
| Auto-send false positives | Bad emails | Default `autoSend: false`; require email + confidence + category; negative keyword list |
| Legal / ToS | Account risk | Use sparingly; personal account; no parallel high-volume scraping |

---

## 15. Architecture Decisions

For each decision: alternatives considered → recommendation → why.

### 15.1 Where should the monitor live?

| Option | Pros | Cons |
|--------|------|------|
| A. Next.js API route on Vercel | Same deploy | No persistent browser; Playwright unsuitable; cold starts |
| B. Separate microservice/repo | Clean isolation | Extra repo/deploy overhead for a personal tool |
| C. `scripts/linkedin-monitor` in this repo + shared `services/apply` | Reuses code; simple; matches monorepo reality | Worker must run off-Vercel |

**Decision: C.** Keeps apply services as the single source of truth and avoids a second codebase.

---

### 15.2 How should scheduling work?

| Option | Pros | Cons |
|--------|------|------|
| A. Vercel Cron | Easy cloud schedule | Cannot run Playwright session |
| B. GitHub Actions schedule | Free cron | Ephemeral runners; persistent profile painful; LinkedIn often blocks CI IPs |
| C. OS cron / Task Scheduler calling `pnpm monitor:run` | Simplest; persistent disk; weekday/hour native | Requires a machine that is on |
| D. `node-cron` long-running process | Config in JSON; one command | Needs always-on process |

**Decision: C as default; D optional on a VPS.** Avoid A/B for the scraper itself.

---

### 15.3 How to persist data?

| Option | Pros | Cons |
|--------|------|------|
| A. Postgres / Neon | Queryable | Overkill; new infra; unused elsewhere |
| B. Redis / Upstash | Fast dedupe | Extra service for tiny sets |
| C. JSON files under `data/` | Matches current file-based project; zero ops | Not shared across Vercel + laptop without sync |

**Decision: C.** Minimum persistence; gitignore runtime data; version only `keywords.json`.

---

### 15.4 How to configure keyword lists?

| Option | Pros | Cons |
|--------|------|------|
| A. Hardcoded in TS | Fast | Requires deploy/commit to tune |
| B. Env vars (comma-separated) | Easy on host | Painful for long lists |
| C. `content/.../keywords.json` in git + optional local override | Reviewable; editable; no UI needed | Two files to know about |

**Decision: C.** Best balance of configurability and simplicity.

---

### 15.5 How to integrate with apply/email?

| Option | Pros | Cons |
|--------|------|------|
| A. HTTP call to `/api/apply/*` | Uses public boundaries | Cookie auth awkward for cron; network hop |
| B. Duplicate Gemini/mail code in scripts | Independent | Violates “no duplication”; drift risk |
| C. Direct import of `analyzeJobPosting` / `draftFromExtract` / `sendJobApplication` | Zero duplication; same validation | Worker must run in repo with env loaded |

**Decision: C.** Cleanest reuse of the working module.

---

### 15.6 Auto-send vs draft-only in v1?

| Option | Pros | Cons |
|--------|------|------|
| A. Always auto-send | Full automation | High false-positive risk early |
| B. Draft-only, manual send in `/apply` | Safest | Less automation |
| C. Gated auto-send behind `autoSend` flag (default false) | Progressive; configurable | Slightly more config |

**Decision: C.** Enables Phase 3→4 progression without redesign.

---

### 15.7 Headless vs headed browser?

| Option | Pros | Cons |
|--------|------|------|
| A. Always headed | Easier debugging / anti-bot | Needs display on server |
| B. Always headless | Good for cron | Login/2FA and some blocks harder |
| C. Headed for first login; headless for cron; env override | Practical | Two modes to document |

**Decision: C.**

---

### 15.8 Dashboard scope?

| Option | Pros | Cons |
|--------|------|------|
| A. Full analytics app | Nice charts | Over-engineered |
| B. No UI, only logs | Simplest | Hard to glance status |
| C. Private `/monitor` with 5 metrics | Matches request | Needs same-host data (v1) |

**Decision: C.**

---

### 15.9 New dependencies?

Only **Playwright** (+ a TS runner like **tsx**) are justified. Skip queues, ORMs, scraping frameworks (`crawlee`, etc.) until proven necessary.

---

## 16. Out of Scope (v1)

- Redesign of `/apply` or `/interview`
- LinkedIn Jobs search API / unofficial APIs
- Multi-account scraping
- Public job board aggregation
- Advanced analytics / ML ranking
- Automatic category guessing beyond existing Gemini extract
- Cloud-hosted Playwright on Vercel
- Manual “Run now” button (explicitly not required for v1)

---

## 17. Success Criteria

The feature is complete when:

1. Weekday/hour schedule triggers the worker without manual intervention
2. New feed posts are detected and deduped
3. Irrelevant posts are dropped by keywords **before** Gemini
4. Relevant posts reuse `analyzeJobPosting` → `draftFromExtract` → (optional) `sendJobApplication`
5. Results persist in JSON and appear on `/monitor`
6. Existing manual `/apply` flow remains unchanged and fully functional

---

## 18. Implementation Checklist (when coding starts)

- [ ] Phase 1: keywords + store + filter CLI
- [ ] Phase 2: Playwright persistent login + feed extract
- [ ] Phase 3: wire apply services (draft_ready)
- [ ] Phase 4: gated auto-send
- [ ] Phase 5: OS cron / optional node-cron
- [ ] Phase 6: `/monitor` dashboard + status API
- [ ] Phase 7: hardening (session, selectors, caps)
- [ ] `.gitignore` for `data/linkedin-monitor/`
- [ ] `robots.ts` disallow `/monitor`
- [ ] Document host setup (login once, cron examples)

---

*End of plan. No implementation performed in this document.*

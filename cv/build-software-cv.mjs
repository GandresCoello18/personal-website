#!/usr/bin/env node
import { spawn } from "node:child_process"
import { mkdir, mkdtemp, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))
const html = path.join(root, "software.html")
const out =
  process.argv[2] ||
  path.join(root, "..", "public", "pdf", "Andres_Coello_Goyes_full_stack_developer_2026.pdf")

await mkdir(path.dirname(out), { recursive: true })

const chrome = process.env.CHROME_PATH || "google-chrome"
const profile = await mkdtemp(path.join(tmpdir(), "cv-chrome-"))

const child = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-sync",
    "--no-first-run",
    "--no-default-browser-check",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=8000",
    `--user-data-dir=${profile}`,
    "--no-pdf-header-footer",
    `--print-to-pdf=${out}`,
    `file://${html}`,
  ],
  { stdio: "inherit" },
)

const timeoutMs = Number(process.env.CV_PDF_TIMEOUT_MS || 20_000)
const started = Date.now()
let lastSize = -1
let stableTicks = 0

try {
  while (Date.now() - started < timeoutMs) {
    try {
      const info = await stat(out)
      if (info.size > 0 && info.size === lastSize) {
        stableTicks += 1
        if (stableTicks >= 3) break
      } else {
        lastSize = info.size
        stableTicks = 0
      }
    } catch {
      // PDF still being written
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  if (lastSize <= 0) {
    child.kill("SIGKILL")
    throw new Error(`Chrome no escribió ${out} en ${timeoutMs}ms`)
  }
} finally {
  child.kill("SIGKILL")
  await new Promise((resolve) => setTimeout(resolve, 200))
  await rm(profile, { recursive: true, force: true }).catch(() => {})
}

console.log(`wrote ${out}`)

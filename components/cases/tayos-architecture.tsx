import { ArchitectureFrame } from "@/components/cases/architecture-frame"

/** Flujo confirmado: Odoo (webhooks) → Fastify → BFF → Expo y Next, con Gemini/RAG. */
export function TayosArchitecture() {
  return (
    <ArchitectureFrame caption="Odoo como fuente de verdad. Webhooks hacia Fastify; el BFF adapta cada cliente.">
      <svg
        viewBox="0 0 560 200"
        role="img"
        aria-label="Tayos: Odoo con webhooks, Fastify, BFF, app Expo y web Next, Gemini RAG"
        className="h-auto w-full"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <rect x="16" y="80" width="80" height="40" />
          <rect x="180" y="80" width="110" height="40" />
          <rect x="326" y="80" width="80" height="40" />
          <rect x="440" y="24" width="104" height="40" />
          <rect x="440" y="136" width="104" height="40" />
          <rect x="192" y="16" width="88" height="36" />
          <path d="M96 100 L180 100" />
          <path d="M290 100 L326 100" />
          <path d="M406 90 L440 44" />
          <path d="M406 110 L440 156" />
          <path d="M236 52 L235 80" />
        </g>
        <g fill="currentColor" className="font-mono" fontSize="10" letterSpacing="0.06em">
          <text x="32" y="104">
            ODOO
          </text>
          <text x="104" y="88">
            WEBHOOKS
          </text>
          <text x="200" y="104">
            FASTIFY
          </text>
          <text x="348" y="104">
            BFF
          </text>
          <text x="454" y="48">
            EXPO APP
          </text>
          <text x="454" y="160">
            NEXT WEB
          </text>
          <text x="204" y="38">
            GEMINI
          </text>
        </g>
      </svg>
    </ArchitectureFrame>
  )
}

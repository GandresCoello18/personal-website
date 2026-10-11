import { ArchitectureFrame } from "@/components/cases/architecture-frame"

/** Flujo confirmado: Odoo → Fastify → BFF → Expo y Next, con Gemini/RAG. */
export function TayosArchitecture() {
  return (
    <ArchitectureFrame caption="Odoo como fuente de verdad. El BFF adapta solo lo que necesita cada cliente.">
      <svg
        viewBox="0 0 560 200"
        role="img"
        aria-label="Tayos: Odoo, Fastify, BFF, app Expo y web Next, Gemini RAG"
        className="h-auto w-full"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <rect x="16" y="80" width="88" height="40" />
          <rect x="148" y="80" width="110" height="40" />
          <rect x="302" y="80" width="80" height="40" />
          <rect x="426" y="24" width="118" height="40" />
          <rect x="426" y="136" width="118" height="40" />
          <rect x="164" y="16" width="88" height="36" />
          <path d="M104 100 L148 100" />
          <path d="M258 100 L302 100" />
          <path d="M382 90 L426 44" />
          <path d="M382 110 L426 156" />
          <path d="M208 52 L203 80" />
        </g>
        <g fill="currentColor" className="font-mono" fontSize="10" letterSpacing="0.06em">
          <text x="36" y="104">
            ODOO
          </text>
          <text x="166" y="104">
            FASTIFY
          </text>
          <text x="324" y="104">
            BFF
          </text>
          <text x="444" y="48">
            EXPO APP
          </text>
          <text x="448" y="160">
            NEXT WEB
          </text>
          <text x="176" y="38">
            GEMINI
          </text>
        </g>
      </svg>
    </ArchitectureFrame>
  )
}

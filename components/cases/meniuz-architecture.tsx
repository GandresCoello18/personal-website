import { ArchitectureFrame } from "@/components/cases/architecture-frame"

/** Topología confirmada por Andrés: Vercel + EC2 + Qdrant en la misma instancia. */
export function MeniuzArchitecture() {
  return (
    <ArchitectureFrame caption="Web y backoffice en Vercel. API GraphQL, MySQL, Redis y Qdrant en EC2.">
      <svg
        viewBox="0 0 560 220"
        role="img"
        aria-label="Meniuz: web y backoffice en Vercel, app móvil, API GraphQL en EC2, MySQL, Redis y Qdrant"
        className="h-auto w-full"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <rect x="16" y="24" width="120" height="40" />
          <rect x="168" y="24" width="100" height="40" />
          <rect x="300" y="24" width="130" height="40" />
          <rect x="168" y="96" width="180" height="40" />
          <rect x="70" y="168" width="100" height="36" />
          <rect x="210" y="168" width="80" height="36" />
          <rect x="330" y="168" width="120" height="36" />
          <path d="M76 64 L240 96" />
          <path d="M218 64 L248 96" />
          <path d="M365 64 L280 96" />
          <path d="M220 136 L120 168" />
          <path d="M258 136 L250 168" />
          <path d="M300 136 L390 168" />
        </g>
        <g fill="currentColor" className="font-mono" fontSize="10" letterSpacing="0.06em">
          <text x="36" y="48">
            WEB NEXT
          </text>
          <text x="184" y="48">
            APP MOVIL
          </text>
          <text x="318" y="48">
            BACKOFFICE
          </text>
          <text x="198" y="120">
            GRAPHQL API
          </text>
          <text x="94" y="190">
            MYSQL
          </text>
          <text x="228" y="190">
            REDIS
          </text>
          <text x="356" y="190">
            QDRANT
          </text>
        </g>
      </svg>
    </ArchitectureFrame>
  )
}

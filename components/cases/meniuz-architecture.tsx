import { ArchitectureFrame } from "@/components/cases/architecture-frame"

/** Solo componentes confirmados en meniuz-final. No es topología de red. */
export function MeniuzArchitecture() {
  return (
    <ArchitectureFrame caption="Componentes confirmados. La topología exacta está en borrador.">
      <svg
        viewBox="0 0 560 220"
        role="img"
        aria-label="Meniuz: web y móvil, API Express GraphQL, MySQL, Redis, RAG y backoffice"
        className="h-auto w-full"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <rect x="16" y="24" width="100" height="40" />
          <rect x="140" y="24" width="100" height="40" />
          <rect x="264" y="24" width="120" height="40" />
          <rect x="180" y="96" width="160" height="40" />
          <rect x="80" y="168" width="100" height="36" />
          <rect x="220" y="168" width="80" height="36" />
          <rect x="340" y="168" width="140" height="36" />
          <path d="M66 64 L240 96" />
          <path d="M190 64 L250 96" />
          <path d="M324 64 L270 96" />
          <path d="M230 136 L130 168" />
          <path d="M260 136 L260 168" />
          <path d="M290 136 L410 168" />
        </g>
        <g fill="currentColor" className="font-mono" fontSize="10" letterSpacing="0.06em">
          <text x="28" y="48">
            WEB NEXT
          </text>
          <text x="154" y="48">
            iOS / AND
          </text>
          <text x="276" y="48">
            BACKOFFICE
          </text>
          <text x="198" y="120">
            EXPRESS + GQL
          </text>
          <text x="104" y="190">
            MYSQL
          </text>
          <text x="238" y="190">
            REDIS
          </text>
          <text x="356" y="190">
            RAG + OCR
          </text>
        </g>
      </svg>
    </ArchitectureFrame>
  )
}

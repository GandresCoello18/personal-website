/** Diagrama de firma: Queue → Gateway → Services → Postgres. Solo en el hero. */
export function SignatureDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 280"
      role="img"
      aria-label="Diagrama: cola, gateway, servicios y Postgres"
      className={className}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="miter"
        strokeLinecap="square"
      >
        <path d="M28 168 L148 168 L164 148 L44 148 Z" />
        <path d="M148 168 L164 148 L164 164 L148 184 Z" />
        <path d="M28 168 L28 184 L148 184 L148 168" />

        <path d="M196 128 L252 128 L264 112 L208 112 Z" />
        <path d="M252 128 L264 112 L264 176 L252 192 Z" />
        <path d="M196 128 L196 192 L252 192 L252 128" />
        <path d="M208 148 L252 148" />
        <path d="M208 168 L252 168" />

        <path d="M304 96 L368 96 L380 80 L316 80 Z" />
        <path d="M368 96 L380 80 L380 112 L368 128 Z" />
        <path d="M304 96 L304 128 L368 128 L368 96" />
        <path d="M304 136 L368 136 L380 120 L316 120" opacity="0.7" />
        <path d="M304 136 L304 168 L368 168 L368 136" />
        <path d="M368 136 L380 120 L380 152 L368 168" />
        <path d="M304 176 L368 176 L380 160 L316 160" opacity="0.7" />
        <path d="M304 176 L304 208 L368 208 L368 176" />
        <path d="M368 176 L380 160 L380 192 L368 208" />

        <ellipse cx="456" cy="168" rx="36" ry="12" />
        <path d="M420 168 L420 208" />
        <path d="M492 168 L492 208" />
        <ellipse cx="456" cy="208" rx="36" ry="12" />
        <path d="M420 188 L492 188" opacity="0.55" />

        <path d="M164 158 L196 158" strokeDasharray="3 3" />
        <path d="M264 152 L304 152" strokeDasharray="3 3" />
        <path d="M380 152 L420 176" strokeDasharray="3 3" />
      </g>
      <g fill="currentColor" className="font-mono" fontSize="10" letterSpacing="0.08em">
        <text x="36" y="136">
          QUEUE
        </text>
        <text x="196" y="100">
          GATEWAY
        </text>
        <text x="304" y="68">
          SERVICES
        </text>
        <text x="424" y="144">
          POSTGRES
        </text>
      </g>
    </svg>
  )
}

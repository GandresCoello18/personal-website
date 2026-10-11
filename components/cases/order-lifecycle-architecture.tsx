import { ArchitectureFrame } from "@/components/cases/architecture-frame"

/** Flujo del README: gateway, auth, órdenes, inventario, pago, notificación. */
export function OrderLifecycleArchitecture() {
  return (
    <ArchitectureFrame caption="Eventos por BullMQ/Redis. Solo el API Gateway expone puertos.">
      <svg
        viewBox="0 0 560 240"
        role="img"
        aria-label="Order Lifecycle: gateway, auth, órdenes, inventario, pago y notificación"
        className="h-auto w-full"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <rect x="16" y="100" width="100" height="40" />
          <rect x="156" y="24" width="96" height="36" />
          <rect x="156" y="102" width="96" height="36" />
          <rect x="300" y="56" width="110" height="36" />
          <rect x="300" y="148" width="110" height="36" />
          <rect x="450" y="102" width="94" height="36" />
          <path d="M116 112 L156 42" />
          <path d="M116 120 L156 120" />
          <path d="M252 120 L300 74" />
          <path d="M252 128 L300 166" />
          <path d="M410 74 L450 112" />
          <path d="M410 166 L450 128" />
        </g>
        <g fill="currentColor" className="font-mono" fontSize="10" letterSpacing="0.06em">
          <text x="28" y="124">
            GATEWAY
          </text>
          <text x="178" y="46">
            AUTH
          </text>
          <text x="174" y="124">
            ORDERS
          </text>
          <text x="316" y="78">
            INVENTORY
          </text>
          <text x="322" y="170">
            PAYMENT
          </text>
          <text x="458" y="124">
            NOTIFY
          </text>
        </g>
      </svg>
    </ArchitectureFrame>
  )
}

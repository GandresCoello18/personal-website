import { useSyncExternalStore } from "react"

function subscribe() {
  return () => {}
}

function getClientSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

/** True after hydration. Avoids `setState` inside `useEffect` for mount flags. */
export function useIsClient() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}

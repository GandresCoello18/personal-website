import { timingSafeEqual } from "node:crypto"

/**
 * Constant-time string compare. Different lengths still run a dummy compare
 * so the failure path is not an instant return.
 */
export function timingSafeEqualString(left: string, right: string): boolean {
  const leftBuf = Buffer.from(left)
  const rightBuf = Buffer.from(right)
  if (leftBuf.length !== rightBuf.length) {
    timingSafeEqual(rightBuf, rightBuf)
    return false
  }
  return timingSafeEqual(leftBuf, rightBuf)
}

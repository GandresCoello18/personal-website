import { CV_FILES } from "./cv.ts"

export function isAllowedCvFilename(filename: string): boolean {
  return Object.values(CV_FILES).includes(filename as (typeof CV_FILES)[keyof typeof CV_FILES])
}

export function assertAllowedCv(filename: string) {
  if (!isAllowedCvFilename(filename)) {
    throw new Error("CV no permitido")
  }
}

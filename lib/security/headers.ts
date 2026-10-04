const HEADER_UNSAFE = /[\r\n\u0000\u000b\u000c]/g

/** Strip CR/LF/NUL so user input cannot inject extra email headers. */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(HEADER_UNSAFE, " ").replace(/\s+/g, " ").trim()
}

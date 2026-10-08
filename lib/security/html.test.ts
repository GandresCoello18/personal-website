import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { escapeHtml, escapeHtmlWithBreaks } from "./html.ts"

describe("escapeHtml", () => {
  it("escapes markup and quotes", () => {
    assert.equal(
      escapeHtml(`<img src=x onerror="alert(1)">`),
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    )
  })

  it("escapes ampersands first", () => {
    assert.equal(escapeHtml("A & B < C"), "A &amp; B &lt; C")
  })
})

describe("escapeHtmlWithBreaks", () => {
  it("turns newlines into br tags after escaping", () => {
    assert.equal(escapeHtmlWithBreaks("hola\n<script>"), "hola<br />&lt;script&gt;")
  })
})

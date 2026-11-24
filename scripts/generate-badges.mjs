/*
 * Generates the firmware badges (public/badges/*.svg), in the style of the README badges.
 *
 *   node scripts/generate-badges.mjs
 *
 * "Filled" badges have a solid background, "outline" badges a white background with a colored
 * border. The same SVGs can be embedded in the README of a firmware.
 */
import fs from 'node:fs'
import path from 'node:path'

const out = path.resolve(import.meta.dirname, '../public/badges')

// GitHub Primer colors
const blue = '#0969da'
const green = '#1a7f37'
const red = '#cf222e'
const gray = '#59636e'

export const badges = {
  'foss-verified': { label: 'open source · verified', color: green, filled: true },
  foss: { label: 'open source', color: green, filled: false },
  maintainers: { label: 'maintainers', color: blue, filled: true },
  contributors: { label: 'contributors', color: blue, filled: false },
  stock: { label: 'original firmware', color: gray, filled: false },
  unverified: { label: 'not guaranteed', color: red, filled: false }
}

const prefix = 'hack-gpon'

/** Approximate width of a text in Verdana 11px (the font of the README badges). */
function textWidth(text) {
  let w = 0
  for (const c of text) {
    if ('il.·:|'.includes(c)) w += 3.2
    else if ('frtj- '.includes(c)) w += 4.6
    else if ('mw'.includes(c)) w += 10.7
    else w += 7
  }
  return Math.round(w)
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function svg({ label, color, filled }) {
  const lw = textWidth(prefix) + 12
  const rw = textWidth(label) + 12
  const w = lw + rw
  const right = filled
    ? `<rect x="${lw}" width="${rw}" height="20" fill="${color}"/>`
    : `<rect x="${lw}" width="${rw}" height="20" fill="#fff"/>`
  const border = filled ? '' : `<rect x="${lw + 0.5}" y="0.5" width="${rw - 1}" height="19" rx="2.5" fill="none" stroke="${color}"/>`
  const labelText = filled
    ? `<text x="${lw + rw / 2}" y="15" fill="#010101" fill-opacity=".3" textLength="${rw - 12}">${escape(label)}</text><text x="${lw + rw / 2}" y="14" fill="#fff" textLength="${rw - 12}">${escape(label)}</text>`
    : `<text x="${lw + rw / 2}" y="14" fill="${color}" textLength="${rw - 12}">${escape(label)}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${prefix}: ${escape(label)}">
<title>${prefix}: ${escape(label)}</title>
<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${lw}" height="20" fill="#555"/>
${right}
</g>
${border}
<g text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" lengthAdjust="spacingAndGlyphs">
<text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3" textLength="${lw - 12}">${prefix}</text>
<text x="${lw / 2}" y="14" fill="#fff" textLength="${lw - 12}">${prefix}</text>
${labelText}
</g>
</svg>
`
}

fs.mkdirSync(out, { recursive: true })
for (const [name, badge] of Object.entries(badges)) {
  fs.writeFileSync(path.join(out, `${name}.svg`), svg(badge))
}
console.log(`${Object.keys(badges).length} badges written to ${out}`)

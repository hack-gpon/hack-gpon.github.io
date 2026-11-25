/*
 * Generates the standalone firmware badges (public/badges/*.svg), e.g. for the README of a firmware.
 *
 *   node scripts/generate-badges.mjs
 *
 * On the site the badges are drawn by the <FirmwareBadge> component, with the colors of the theme.
 */
import fs from 'node:fs'
import path from 'node:path'
import { badgeStyles, checkPath, exclamationPath, sealPath } from '../.vitepress/theme/lib/badgeShape.mjs'

const out = path.resolve(import.meta.dirname, '../public/badges')

// GitHub Primer colors, readable on light and dark backgrounds
const colors = { green: '#2da44e', blue: '#2f81f7', red: '#e5534b', white: '#8c959f' }

function svg({ color, filled, mark }) {
  const c = colors[color]
  const markColor = filled ? '#fff' : c
  const seal = filled
    ? `<path d="${sealPath}" fill="${c}"/>`
    : `<path d="${sealPath}" fill="none" stroke="${c}" stroke-width="1.2" stroke-linejoin="round"/>`
  const markSvg =
    mark === 'check'
      ? `<path d="${checkPath}" fill="none" stroke="${markColor}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="${exclamationPath}" fill="none" stroke="${markColor}" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11.3" r="0.95" fill="${markColor}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">${seal}${markSvg}</svg>\n`
}

fs.mkdirSync(out, { recursive: true })
for (const [name, style] of Object.entries(badgeStyles)) {
  fs.writeFileSync(path.join(out, `${name}.svg`), svg(style))
}
console.log(`${Object.keys(badgeStyles).length} badges written to ${out}`)

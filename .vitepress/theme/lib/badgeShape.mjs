/**
 * Shape of the firmware badges: a seal (a circle with eight scallops) with a check mark, or an
 * exclamation mark for the "not guaranteed" badge. Shared by the <FirmwareBadge> component and
 * by `scripts/generate-badges.mjs`, which writes the standalone SVG files.
 */

function seal(cx = 8, cy = 8, base = 6.55, depth = 0.6, scallops = 8, steps = 192) {
  const points = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const r = base + depth * Math.cos(scallops * t)
    points.push(`${(cx + r * Math.sin(t)).toFixed(3)} ${(cy - r * Math.cos(t)).toFixed(3)}`)
  }
  return `M${points.join('L')}Z`
}

export const sealPath = seal()
export const checkPath = 'M4.9 8.25L7.05 10.35L11.1 6.15'
export const exclamationPath = 'M8 4.7V8.8'

/** filled: solid seal with a white mark; outline: colored border and mark */
export const badgeStyles = {
  'foss-verified': { color: 'green', filled: true, mark: 'check' },
  foss: { color: 'green', filled: false, mark: 'check' },
  maintainers: { color: 'blue', filled: true, mark: 'check' },
  contributors: { color: 'blue', filled: false, mark: 'check' },
  stock: { color: 'white', filled: false, mark: 'check' },
  unverified: { color: 'red', filled: false, mark: 'exclamation' }
}

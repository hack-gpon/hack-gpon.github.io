/*
 * Index of the site pages, built from the markdown front matter.
 *
 * It reproduces the Jekyll / Just the Docs structure of the site:
 *  - the URL of every page (Jekyll collections permalinks), used by the VitePress rewrites
 *  - the navigation tree (`parent`, `has_children`, `nav_order`, `nav_exclude`), used by the sidebar
 */
import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

export const root = path.resolve(__dirname, '..')

/** Collections, in sidebar order, with the URL prefix of their pages. */
export const collections = [
  { dir: 'ont', name: 'ONT GPON', prefix: '/' },
  { dir: 'ont-xgs', name: 'ONT XGS-PON', prefix: '/xgs/' },
  { dir: 'ont-epon', name: 'ONT EPON', prefix: '/epon/' },
  { dir: 'router', name: 'Router PON', prefix: '/router/' },
  { dir: 'firmware', name: 'Firmware', prefix: '/' },
  { dir: 'chipset', name: 'Chipsets', prefix: '/' },
  { dir: 'tools', name: 'Tools', prefix: '/' },
  { dir: 'sfp', name: 'SFP Resources & standard', prefix: '/' },
  { dir: 'gpon', name: 'GPON Resources & standard', prefix: '/' },
  { dir: 'sfp-cage', name: 'SFP cage', prefix: '/' }
]

/** Markdown files that are not pages. */
export const srcExclude = ['README.md', 'CONTRIBUTING.md', '**/_partials/**', 'ont/ont-template.md']

export interface Page {
  /** source path relative to the project root, e.g. `ont/ont-zte.md` */
  file: string
  /** page URL with trailing slash, e.g. `/ont-zte/` */
  url: string
  collection?: string
  frontmatter: Record<string, any>
}

/**
 * Minimal parser for the flat `key: value` front matter used by the pages (it is enough for the
 * navigation keys). Lists and multi-line values are not supported and are reported.
 */
function parseFrontmatter(src: string, file: string): Record<string, any> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
  const data: Record<string, any> = {}
  if (!match) return data
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    const kv = /^([A-Za-z_][\w-]*):\s*(.*?)\s*$/.exec(line)
    if (!kv) {
      console.warn(`[pages] ${file}: unsupported front matter line, only "key: value" is read: ${line}`)
      continue
    }
    let value: any = kv[2]
    // trailing comment of an unquoted value
    if (!/^["']/.test(value)) value = value.replace(/\s+#.*$/, '')
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1)
    else if (value === 'true' || value === 'false') value = value === 'true'
    else if (/^-?\d+(\.\d+)?$/.test(value)) value = Number(value)
    data[kv[1]] = value
  }
  return data
}

function readPage(file: string, collection?: (typeof collections)[number]): Page {
  const frontmatter = parseFrontmatter(fs.readFileSync(path.join(root, file), 'utf8'), file)
  const name = path.basename(file, '.md')
  const url = name === 'index' && !collection ? '/' : `${collection?.prefix ?? '/'}${name}/`
  return { file, url, collection: collection?.dir, frontmatter }
}

function loadPages(): Page[] {
  const pages: Page[] = []
  for (const f of fs.readdirSync(root)) {
    if (f.endsWith('.md') && !srcExclude.includes(f)) pages.push(readPage(f))
  }
  for (const c of collections) {
    for (const f of fs.readdirSync(path.join(root, c.dir))) {
      const file = `${c.dir}/${f}`
      if (f.endsWith('.md') && !srcExclude.includes(file)) pages.push(readPage(file, c))
    }
  }
  const seen = new Map<string, string>()
  for (const p of pages) {
    const key = p.url.toLowerCase()
    if (seen.has(key)) throw new Error(`URL ${p.url} is used by both ${seen.get(key)} and ${p.file}`)
    seen.set(key, p.file)
  }
  return pages
}

export const pages = loadPages()

const urls = new Set(pages.map((p) => p.url.toLowerCase()))

/** Returns the canonical URL (with trailing slash) of an internal link, if it points to a page. */
export function resolvePageUrl(pathname: string): string | undefined {
  if (pathname === '/' || pathname.endsWith('/')) return urls.has(pathname.toLowerCase()) ? pathname : undefined
  const withSlash = decodeURI(pathname).replace(/\.(md|html)$/, '') + '/'
  return urls.has(withSlash.toLowerCase()) ? encodeURI(withSlash) : undefined
}

const pagesByUrl = new Map(pages.map((p) => [p.url.toLowerCase(), p]))

export function isExternal(href: string) {
  return /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href)
}

/**
 * Final destination of a link: canonical URL of the page, following the `redirect_to` of the
 * redirect pages. Returns undefined if the link does not point to a page of the site.
 */
export function resolveLink(href: string): string | undefined {
  const [, pathname, hrefRest] = /^([^?#]*)(.*)$/.exec(href)!
  let rest = hrefRest
  let url = resolvePageUrl(pathname)
  for (let i = 0; url && i < 10; i++) {
    const redirect: string | undefined = pagesByUrl.get(url.toLowerCase())?.frontmatter.redirect_to
    if (!redirect) return url + rest
    if (isExternal(redirect)) return redirect
    const [, target, targetRest] = /^([^?#]*)(.*)$/.exec(redirect)!
    // the anchor of the original link wins over the one of the redirect
    rest = rest || targetRest
    url = resolvePageUrl(target)
    if (!url) return redirect
  }
  return url && url + rest
}

const rewriteMap = new Map(pages.filter((p) => p.url !== '/').map((p) => [p.file, `${p.url.slice(1)}index.md`]))

/** VitePress rewrites: `ont/ont-zte.md` -> `ont-zte/index.md` */
export function rewrites(file: string) {
  return rewriteMap.get(file) ?? file
}

/** Just the Docs ordering: pages with `nav_order` first, then the others sorted by title. */
function byNavOrder(a: Page, b: Page) {
  const oa = a.frontmatter.nav_order
  const ob = b.frontmatter.nav_order
  if (oa !== undefined && ob !== undefined) return oa - ob
  if (oa !== undefined) return -1
  if (ob !== undefined) return 1
  const ta = String(a.frontmatter.title ?? '')
  const tb = String(b.frontmatter.title ?? '')
  return ta < tb ? -1 : ta > tb ? 1 : 0
}

function link(page: Page) {
  return resolveLink(page.url) ?? page.frontmatter.redirect_to ?? page.url
}

function sidebarItems(list: Page[], parent?: string): DefaultTheme.SidebarItem[] {
  return list
    .filter((p) => (parent === undefined ? !p.frontmatter.parent : p.frontmatter.parent === parent))
    .sort(byNavOrder)
    .map((p) => {
      const items = p.frontmatter.has_children ? sidebarItems(list, p.frontmatter.title) : []
      return {
        text: String(p.frontmatter.title),
        link: link(p),
        ...(items.length ? { items, collapsed: true } : {})
      }
    })
}

export function sidebar(): DefaultTheme.SidebarItem[] {
  const visible = pages.filter((p) => !p.frontmatter.nav_exclude && p.frontmatter.title)
  return [
    ...sidebarItems(visible.filter((p) => !p.collection)),
    ...collections.map((c) => ({
      text: c.name,
      collapsed: true,
      items: sidebarItems(visible.filter((p) => p.collection === c.dir))
    }))
  ]
}

/**
 * Firmware index, built from the front matter of the pages of the `firmware` collection:
 *
 *   badge: foss-verified           # one of `firmwareBadges`
 *   platform: Lantiq SDK (OpenWrt) # free text, optional
 *   source: https://...            # source code, required by the `foss*` badges
 *   maintained: false              # optional, the firmware is no longer maintained
 *   devices: ont-huawei-ma5671a:works, ont-nokia-g-010s-p:reported
 *
 * `devices` lists the device pages (URL without slashes, e.g. `ont-huawei-ma5671a` or
 * `xgs/ont-nokia-xs-010x-q`) with their compatibility status: `works` (default), `procedure` (works
 * after a procedure described in the firmware page), `reported` (single report), `untested` (technically
 * possible, nobody tried it yet) or `broken`. The
 * device pages show their firmwares with the `<FirmwareList />` component.
 */

/** Badges, from the best to the worst: the order is the one of the lists. */
export const firmwareBadges = ['foss-verified', 'foss', 'maintainers', 'contributors', 'stock', 'unverified'] as const
export type FirmwareBadge = (typeof firmwareBadges)[number]

export const compatibilityStatuses = ['works', 'procedure', 'reported', 'untested', 'broken'] as const
export type CompatibilityStatus = (typeof compatibilityStatuses)[number]

export interface FirmwareDevice {
  url: string
  title: string
  status: CompatibilityStatus
}

export interface Firmware {
  url: string
  title: string
  badge: FirmwareBadge
  platform?: string
  source?: string
  maintained: boolean
  devices: FirmwareDevice[]
}

function readFirmware(page: Page): Firmware {
  const fm = page.frontmatter
  const fail = (msg: string) => {
    throw new Error(`[firmware] ${page.file}: ${msg}`)
  }
  if (!firmwareBadges.includes(fm.badge)) fail(`"badge" must be one of ${firmwareBadges.join(', ')}`)
  if (String(fm.badge).startsWith('foss') && !fm.source) fail(`the "${fm.badge}" badge needs the "source" of the firmware`)
  const devices = String(fm.devices ?? '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((entry): FirmwareDevice => {
      const [name, status = 'works'] = entry.split(':').map((s) => s.trim())
      if (!compatibilityStatuses.includes(status as CompatibilityStatus)) {
        fail(`unknown status "${status}" of ${name}, it must be one of ${compatibilityStatuses.join(', ')}`)
      }
      const device = pages.find((p) => p.url === `/${name}/` && p.collection !== 'firmware' && !p.frontmatter.redirect_to)
      if (!device) fail(`device page "${name}" not found`)
      return { url: device!.url, title: String(device!.frontmatter.title).trim(), status: status as CompatibilityStatus }
    })
  if (!devices.length) fail('"devices" is empty')
  return {
    url: page.url,
    title: String(fm.title).trim(),
    badge: fm.badge,
    platform: fm.platform || undefined,
    source: fm.source || undefined,
    maintained: fm.maintained !== false,
    devices
  }
}

export const firmwares: Firmware[] = pages
  .filter((p) => p.collection === 'firmware' && p.frontmatter.badge !== undefined && !p.frontmatter.redirect_to)
  .map(readFirmware)
  .sort((a, b) => firmwareBadges.indexOf(a.badge) - firmwareBadges.indexOf(b.badge) || a.title.localeCompare(b.title))

/**
 * Chipset families. Every family has a page in the `chipset` collection, and the device pages link
 * it from the `Chipset` row of their "Hardware Specifications" table, e.g.
 *
 *   | Chipset | [Realtek RTL9601D](/chipset-realtek-rtl960x) |
 *
 * The family pages list their devices with the `<ChipsetDevices />` component. The OS and the SDK
 * (e.g. `Linux 3.18 (Luna SDK 3.3)`) go in the `System` row, not in the `Chipset` one.
 */

/** Device collections that have a "Hardware Specifications" table, with their label. */
const deviceCollections: Record<string, string> = {
  ont: 'GPON',
  'ont-xgs': 'XGS-PON',
  'ont-epon': 'EPON',
  router: 'Router'
}

export interface ChipsetDevice {
  url: string
  title: string
  type: string
  /** chip model: the text of the link in the `Chipset` row */
  model: string
  system?: string
}

export interface Chipset {
  url: string
  title: string
  devices: ChipsetDevice[]
}

/** Plain text of a table cell: no links, code spans, footnotes or HTML. */
function cellText(cell: string) {
  return cell
    .replace(/\[\^[^\]]*\]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Rows of the "Hardware Specifications" table, by label (all the cells after the label). */
function specRows(src: string): Map<string, string[]> {
  const rows = new Map<string, string[]>()
  const heading = /^#{1,6}[ \t]+Hardware Specifications[ \t]*$/m.exec(src)
  if (!heading) return rows
  const lines = src.slice(heading.index + heading[0].length).split(/\r?\n/)
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++
  for (; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|')
    const label = cells[0].trim()
    if (label && !rows.has(label)) rows.set(label, cells.slice(1))
  }
  return rows
}

const chipsetPages = pages.filter((p) => p.collection === 'chipset' && !p.frontmatter.redirect_to)
const chipsetDevices = new Map<string, ChipsetDevice[]>(chipsetPages.map((p) => [p.url, []]))

for (const page of pages) {
  const type = page.collection && deviceCollections[page.collection]
  if (!type || page.frontmatter.redirect_to) continue
  const rows = specRows(fs.readFileSync(path.join(root, page.file), 'utf8'))
  const chipset = rows.get('Chipset') ?? []
  const system = rows.get('System') ?? []
  chipset.forEach((cell, i) => {
    for (const [, label, target] of cell.matchAll(/\[([^\]]+)\]\((\/chipset-[^)#]*)\)/g)) {
      const url = resolvePageUrl(target)
      const devices = url && chipsetDevices.get(url)
      if (!devices) throw new Error(`[chipset] ${page.file}: the chipset page ${target} does not exist`)
      // tables with more columns (hardware revisions): the System cell of the same column
      const sys = cellText(system[i] ?? system[0] ?? '')
      devices.push({
        url: page.url,
        title: String(page.frontmatter.title).trim(),
        type,
        model: cellText(label),
        system: sys && sys !== '-' ? sys : undefined
      })
    }
  })
}

const typeOrder = Object.values(deviceCollections)

export const chipsets: Chipset[] = chipsetPages
  .filter((p) => p.file !== 'chipset/chipset.md')
  .map((p) => ({
    url: p.url,
    title: String(p.frontmatter.title).trim(),
    devices: chipsetDevices
      .get(p.url)!
      .sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type) || a.title.localeCompare(b.title))
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

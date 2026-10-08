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

/** Minimal parser for the flat `key: value` front matter used by the pages. */
function parseFrontmatter(src: string): Record<string, any> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
  const data: Record<string, any> = {}
  if (!match) return data
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*?)\s*$/.exec(line)
    if (!kv) continue
    let value: any = kv[2]
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1)
    else if (value === 'true' || value === 'false') value = value === 'true'
    else if (/^-?\d+(\.\d+)?$/.test(value)) value = Number(value)
    data[kv[1]] = value
  }
  return data
}

function readPage(file: string, collection?: (typeof collections)[number]): Page {
  const frontmatter = parseFrontmatter(fs.readFileSync(path.join(root, file), 'utf8'))
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
  const redirect = page.frontmatter.redirect_to
  if (redirect) return resolvePageUrl(redirect) ?? redirect
  return page.url
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

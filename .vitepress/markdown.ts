import fs from 'node:fs'
import path from 'node:path'
import { Liquid } from 'liquidjs'
import type MarkdownIt from 'markdown-it'
import footnote from 'markdown-it-footnote'
import { resolveLink } from './pages'

const liquid = new Liquid()

/**
 * Parametrized partials.
 *
 *   <!--@partial: ./_partials/ont-nokia-use.md
 *   username: "ONTUSER"
 *   -->
 *
 * The partial is a Liquid template, the parameters are available as `include.<name>`.
 * Every parameter is on its own line: `name: value`, the value can be a JSON string.
 */
export function expandPartials(src: string, file: string, includes?: string[]): string {
  return src.replace(/<!--\s*@partial:\s*(\S+?)\s*(?:\n([\s\S]*?))?-->/g, (_, target: string, rawParams = '') => {
    const params: Record<string, unknown> = {}
    for (const line of rawParams.split(/\r?\n/)) {
      const kv = /^\s*([A-Za-z_][\w-]*):\s*(.*?)\s*$/.exec(line)
      if (!kv) continue
      try {
        params[kv[1]] = JSON.parse(kv[2])
      } catch {
        params[kv[1]] = kv[2]
      }
    }
    const partialFile = path.resolve(path.dirname(file), target)
    // registered as dependency of the page, like the VitePress includes: the dev server reloads it
    includes?.push(partialFile.replace(/\\/g, '/'))
    const template = fs.readFileSync(partialFile, 'utf8')
    return liquid.parseAndRenderSync(template, { include: params })
  })
}

/**
 * Internal links point to the canonical URL of the page, with the trailing slash (as Jekyll did),
 * and links to the redirect pages point directly to their destination.
 */
function canonicalLinks(md: MarkdownIt) {
  md.core.ruler.push('canonical_links', (state) => {
    for (const block of state.tokens) {
      for (const token of block.children ?? []) {
        if (token.type !== 'link_open') continue
        const href = token.attrGet('href')
        if (!href || !href.startsWith('/') || href.startsWith('//')) continue
        const url = resolveLink(href)
        if (url) token.attrSet('href', url)
      }
    }
  })
}

const hardwareSpecsHeading = /^#{1,6}[ \t]+Hardware Specifications[ \t]*$/m

/** Markdown of the table under the "Hardware Specifications" heading, shown in the aside. */
export function extractHardwareSpecs(src: string): string | undefined {
  const heading = hardwareSpecsHeading.exec(src)
  if (!heading) return
  const lines = src.slice(heading.index + heading[0].length).split(/\r?\n/)
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++
  const table: string[] = []
  while (i < lines.length && lines[i].trim().startsWith('|')) table.push(lines[i++])
  return table.length > 2 ? table.join('\n') : undefined
}

/** Marks the "Hardware Specifications" table, hidden in the page when it is shown in the aside. */
function hardwareSpecs(md: MarkdownIt) {
  md.core.ruler.push('hardware_specs', (state) => {
    const tokens = state.tokens
    const heading = tokens.findIndex(
      (t, i) => t.type === 'heading_open' && tokens[i + 1]?.content.trim() === 'Hardware Specifications'
    )
    if (heading === -1) return
    // the table must follow the heading directly
    const table = tokens[heading + 3]
    if (table?.type === 'table_open') table.attrJoin('class', 'hardware-specs')
  })
  // the VitePress renderer of the tables drops the attributes
  const tableOpen = md.renderer.rules.table_open!
  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const html = tableOpen(tokens, idx, options, env, self)
    const cls = tokens[idx].attrGet('class')
    return cls ? html.replace('<table', `<table class="${cls}"`) : html
  }
}

/** ```mermaid code blocks are rendered client side by the <Mermaid> component. */
function mermaid(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (token.info.trim() === 'mermaid') {
      return `<Mermaid code="${encodeURIComponent(token.content)}" />`
    }
    return fence(tokens, idx, options, env, self)
  }
}

export function configureMarkdown(md: MarkdownIt) {
  const parse = md.parse.bind(md)
  md.parse = (src, env) => {
    const file = env?.realPath ?? env?.path
    return parse(file ? expandPartials(src, file, env.includes) : src, env)
  }
  md.use(footnote)
  md.use(canonicalLinks)
  md.use(hardwareSpecs)
  md.use(mermaid)
}

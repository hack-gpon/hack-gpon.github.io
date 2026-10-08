import fs from 'node:fs'
import path from 'node:path'
import { Liquid } from 'liquidjs'
import type MarkdownIt from 'markdown-it'
import footnote from 'markdown-it-footnote'
import { resolvePageUrl } from './pages'

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
export function expandPartials(src: string, file: string): string {
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
    const template = fs.readFileSync(partialFile, 'utf8')
    return liquid.parseAndRenderSync(template, { include: params })
  })
}

/** Internal links point to the canonical URL of the page, with the trailing slash (as Jekyll did). */
function canonicalLinks(md: MarkdownIt) {
  md.core.ruler.push('canonical_links', (state) => {
    for (const block of state.tokens) {
      for (const token of block.children ?? []) {
        if (token.type !== 'link_open') continue
        const href = token.attrGet('href')
        if (!href || !href.startsWith('/') || href.startsWith('//')) continue
        const [, pathname, rest] = /^([^?#]*)(.*)$/.exec(href)!
        const url = resolvePageUrl(pathname)
        if (url) token.attrSet('href', url + rest)
      }
    }
  })
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
    return parse(file ? expandPartials(src, file) : src, env)
  }
  md.use(footnote)
  md.use(canonicalLinks)
  md.use(mermaid)
}

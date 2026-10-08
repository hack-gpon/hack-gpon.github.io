#!/usr/bin/env node
/*
 * Converts Jekyll / Just the Docs markdown pages to the VitePress syntax used by this site.
 *
 * Usage:
 *   node scripts/jekyll-to-vitepress.mjs                 # convert every content page
 *   node scripts/jekyll-to-vitepress.mjs ont/foo.md ...  # convert only the given files
 *
 * The conversion is idempotent: already converted files are left unchanged.
 * Useful to port pull requests that were written with the old Jekyll syntax.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const contentDirs = ['ont', 'ont-xgs', 'ont-epon', 'router', 'tools', 'sfp', 'gpon', 'sfp-cage']
const rootPages = ['index.md', 'quick-start.md', 'faq.md', 'privacy-policy.md']

const alertTypes = {
  red: 'danger',
  yellow: 'warning',
  blue: 'info',
  blu: 'info',
  green: 'tip',
  grey: 'info',
  purple: 'info'
}

const warnings = []

/** Parses `key="value" key2='value' key3=identifier key4=true` until `%}` (outside of quotes). */
function parseLiquidArgs(src, start) {
  const args = {}
  let i = start
  while (i < src.length) {
    while (/\s/.test(src[i])) i++
    if (src.startsWith('%}', i) || src.startsWith('-%}', i)) {
      return { args, end: i + (src[i] === '-' ? 3 : 2) }
    }
    const keyMatch = /^[A-Za-z_][\w-]*/.exec(src.slice(i))
    if (!keyMatch) throw new Error(`Cannot parse liquid arguments near: ${src.slice(i, i + 40)}`)
    const key = keyMatch[0]
    i += key.length
    while (/\s/.test(src[i])) i++
    if (src[i] !== '=') {
      args[key] = { type: 'literal', value: true }
      continue
    }
    i++
    while (/\s/.test(src[i])) i++
    const quote = src[i]
    if (quote === '"' || quote === "'") {
      const close = src.indexOf(quote, i + 1)
      args[key] = { type: 'literal', value: src.slice(i + 1, close) }
      i = close + 1
    } else {
      const valMatch = /^[^\s%]+/.exec(src.slice(i))
      const raw = valMatch[0]
      i += raw.length
      if (raw === 'true' || raw === 'false') args[key] = { type: 'literal', value: raw === 'true' }
      else if (/^\d+$/.test(raw)) args[key] = { type: 'literal', value: Number(raw) }
      else args[key] = { type: 'variable', value: raw }
    }
  }
  throw new Error('Unterminated liquid tag')
}

/** Replaces every `{% include <name> ... %}` with the result of `fn(args, ctx)`. */
function replaceInclude(src, name, fn) {
  const re = new RegExp(`\\{%-?\\s*include\\s+${name.replace('.', '\\.')}(?=[\\s%-])`, 'g')
  let out = ''
  let last = 0
  let m
  while ((m = re.exec(src))) {
    const { args, end } = parseLiquidArgs(src, m.index + m[0].length)
    const lineStart = src.lastIndexOf('\n', m.index - 1) + 1
    let lineEnd = src.indexOf('\n', end)
    if (lineEnd === -1) lineEnd = src.length
    const before = src.slice(lineStart, m.index)
    const after = src.slice(end, lineEnd)
    out += src.slice(last, m.index) + fn(args, { before, after })
    last = end
    re.lastIndex = end
  }
  return out + src.slice(last)
}

/** Value usable inside markdown text: literal, or a liquid expression for partial parameters. */
function textValue(arg) {
  if (!arg) return ''
  return arg.type === 'variable' ? `{{ ${arg.value} }}` : String(arg.value)
}

function attr(name, arg) {
  if (!arg || arg.value === '' || arg.value === false) return ''
  const value = textValue(arg).replace(/\\/g, '/').replace(/"/g, '&quot;')
  return ` ${name}="${value}"`
}

function convertAlert(args, { before, after }) {
  const type = alertTypes[args.color?.value] ?? 'info'
  const title = args.alert?.value ? ` ${args.alert.value}` : ''
  const content = textValue(args.content).trim()
  if (before.trim() !== '' || after.trim() !== '') {
    warnings.push(`inline alert kept as HTML: ${content.slice(0, 60)}`)
    return `<div class="${type} custom-block"><p class="custom-block-title">${title.trim()}</p><p>${content}</p></div>`
  }
  const indent = before
  const body = content
    .split('\n')
    .map((line, i) => (i === 0 ? line : indent + line.trimStart()))
    .join('\n')
  return `::: ${type}${title}\n${indent}${body}\n${indent}:::`
}

function convertImage(args) {
  return (
    '<ImageFigure' +
    attr('file', args.file) +
    attr('alt', args.alt) +
    attr('caption', args.caption) +
    attr('url', args.url) +
    attr('max-width', args['max-width']) +
    ' />'
  )
}

function convertSerialDump(args, { before }) {
  const file = textValue(args.file).replace(/\\/g, '/')
  const title = textValue(args.title) || textValue(args.alt) || file
  return `::: details ${title}\n${before}<<< ./serial_dump/${file}\n${before}:::`
}

function convertIncludeRelative(src) {
  const re = /\{%-?\s*include_relative\s+([^\s%]+)/g
  let out = ''
  let last = 0
  let m
  while ((m = re.exec(src))) {
    const { args, end } = parseLiquidArgs(src, m.index + m[0].length)
    const params = Object.entries(args).map(([k, v]) => {
      if (v.type === 'variable') throw new Error(`include_relative with variable argument ${k}`)
      return `${k}: ${JSON.stringify(v.value)}`
    })
    const target = `./_partials/${path.basename(m[1])}`
    out += src.slice(last, m.index)
    out += params.length ? `<!--@partial: ${target}\n${params.join('\n')}\n-->` : `<!--@partial: ${target}-->`
    last = end
    re.lastIndex = end
  }
  return out + src.slice(last)
}

/** `{:style="counter-reset:none"}` before an ordered list: continue numbering from the previous list. */
function convertCounterReset(src) {
  if (!/\{:\s*style="counter-reset:\s*none"\s*\}/.test(src)) return src
  const out = []
  let fence = null
  let listActive = false
  let lastNumber = 0
  let continueNext = false
  for (const line of src.split('\n')) {
    if (fence) {
      if (line.trimStart().startsWith(fence)) fence = null
      out.push(line)
      continue
    }
    const fenceOpen = /^(\s*)(```|~~~)/.exec(line)
    if (fenceOpen) {
      fence = fenceOpen[2]
      if (fenceOpen[1] === '') listActive = false
      out.push(line)
      continue
    }
    if (/^\{:\s*style="counter-reset:\s*none"\s*\}\s*$/.test(line)) {
      continueNext = true
      continue
    }
    const item = /^(\d+)\.(\s.*)$/.exec(line)
    if (item) {
      if (listActive) lastNumber++
      else if (continueNext) lastNumber++
      else lastNumber = Number(item[1])
      // only the first item number matters to markdown-it, but keep every item readable
      out.push(continueNext || listActive ? `${lastNumber}.${item[2]}` : line)
      listActive = true
      continueNext = false
      continue
    }
    if (line.trim() !== '' && !/^\s/.test(line)) listActive = false
    out.push(line)
  }
  return out.join('\n')
}

function convertBody(body) {
  body = replaceInclude(body, 'alert.html', convertAlert)
  body = replaceInclude(body, 'image.html', convertImage)
  body = replaceInclude(body, 'serial_dump.html', convertSerialDump)
  body = replaceInclude(body, 'cig_password.html', (a) => `<CigPassword${attr('username', a.username)} />`)
  body = replaceInclude(body, 'cig_password_xgspon.html', (a) => {
    const len = a.password_len ? ` :password-len="${textValue(a.password_len)}"` : ''
    return `<CigPassword xgspon${len} />`
  })
  body = convertIncludeRelative(body)

  // Cite this page snippet
  body = body.replace(
    /`\{\{\s*page\.title\s*\}\}, Hack GPON\. Available at: https:\/\/hack-gpon\.org\{\{\s*page\.url\s*\}\}`/g,
    '<CiteAs />'
  )

  // Kramdown span IAL on links: [text](url){: .btn } -> [text](url){.btn}
  body = body.replace(/(\]\([^)]*\))\{:\s*([^}]*?)\s*\}/g, (_, link, attrs) => `${link}{${attrs}}`)
  // Kramdown IAL at the start of a list item: - {:.cls } text -> - text {.cls}
  body = body.replace(/^(\s*[-*]\s+)\{:\s*([^}]*?)\s*\}\s*(.*?)\s*$/gm, (_, bullet, attrs, text) => `${bullet}${text} {${attrs}}`)
  body = convertCounterReset(body)

  const leftover = body.match(/\{%[\s\S]*?%\}|\{:[^}]*\}/g)?.filter((t) => !t.startsWith('{% if') && !t.startsWith('{% endif'))
  if (leftover?.length) warnings.push(`unconverted liquid/kramdown: ${leftover.join(' | ').slice(0, 200)}`)
  return body
}

function convertFrontmatter(fm) {
  const lines = fm.split('\n').filter((l) => !/^layout:\s*default\s*$/.test(l) && !/^permalink:/.test(l))
  if (lines.some((l) => /^search_exclude:\s*true/.test(l)) && !lines.some((l) => /^search:/.test(l))) {
    lines.push('search: false')
  }
  return lines.join('\n')
}

function convertFile(file) {
  const original = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  let result
  const fmMatch = /^---\n([\s\S]*?)\n---\n?/.exec(original)
  if (fmMatch) {
    result = `---\n${convertFrontmatter(fmMatch[1])}\n---\n` + convertBody(original.slice(fmMatch[0].length))
  } else {
    result = convertBody(original)
  }
  if (result !== original) {
    fs.writeFileSync(file, result)
    console.log(`converted ${path.relative(root, file)}`)
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    if (d.isDirectory()) return walk(p)
    return d.name.endsWith('.md') ? [p] : []
  })
}

const files = process.argv.length > 2
  ? process.argv.slice(2).map((f) => path.resolve(f))
  : [...contentDirs.flatMap((d) => walk(path.join(root, d))), ...rootPages.map((f) => path.join(root, f))]

for (const file of files) {
  warnings.length = 0
  try {
    convertFile(file)
  } catch (e) {
    console.error(`ERROR ${path.relative(root, file)}: ${e.message}`)
  }
  for (const w of warnings) console.warn(`  warning ${path.relative(root, file)}: ${w}`)
}

import fs from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer, defineConfig, type MarkdownRenderer } from 'vitepress'
import { configureMarkdown, extractHardwareSpecs } from './markdown'
import { isExternal, pages, resolveLink, rewrites, sidebar, srcExclude } from './pages'

const hostname = 'https://hack-gpon.org'
const repository = 'https://github.com/hack-gpon/hack-gpon.github.io'

let specsRenderer: Promise<MarkdownRenderer> | undefined

const telegramIcon =
  '<svg role="img" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/></svg>'

export default defineConfig({
  lang: 'en-US',
  title: 'Hack GPON',
  description: 'Worldwide wiki on how to access, change and edit ONTs',

  srcExclude,
  rewrites,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname,
    // the redirect pages are not real pages (as with jekyll-redirect-from)
    transformItems: (items) => {
      const redirects = new Set(pages.filter((p) => p.frontmatter.redirect_to).map((p) => p.url.slice(1)))
      return items.filter((item) => !redirects.has(decodeURI(item.url)))
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#27262b' }],
    ['meta', { name: 'msapplication-TileColor', content: '#27262b' }],
    ['meta', { name: 'theme-color', content: '#27262b' }]
  ],

  transformHead({ pageData }) {
    const head: [string, Record<string, string>][] = []
    const page = pages.find((p) => p.file === pageData.filePath)
    const redirect = pageData.frontmatter.redirect_to
    if (redirect) {
      const target = (page && resolveLink(page.url)) ?? redirect
      head.push(['meta', { 'http-equiv': 'refresh', content: `0; url=${target}` }])
      head.push(['link', { rel: 'canonical', href: isExternal(target) ? target : hostname + target }])
    } else if (page) {
      head.push(['link', { rel: 'canonical', href: hostname + page.url }])
    }
    return head
  },

  markdown: {
    config: configureMarkdown,
    // in dev the cache of the rendered pages is not cleared for the rewritten pages when a
    // partial changes, so the page would not be updated
    cache: process.argv[2] !== 'dev'
  },

  // the "Hardware Specifications" table is also rendered in the aside, above the outline
  async transformPageData(pageData, { siteConfig }) {
    const file = path.join(siteConfig.srcDir, pageData.filePath)
    if (!fs.existsSync(file)) return
    const table = extractHardwareSpecs(fs.readFileSync(file, 'utf8'))
    if (!table) return
    specsRenderer ??= createMarkdownRenderer(siteConfig.srcDir, siteConfig.markdown, siteConfig.site.base, siteConfig.logger)
    pageData.hardwareSpecs = (await specsRenderer).render(table, { path: file, relativePath: pageData.relativePath })
  },

  vite: {
    build: {
      // the big chunks (search index, mermaid, pages with serial dumps) are loaded on demand
      chunkSizeWarningLimit: 1000
    }
  },

  themeConfig: {
    logo: { src: '/favicon-32x32.png', alt: '' },

    nav: [
      { text: 'Quick Start', link: '/quick-start/' },
      { text: 'FAQ', link: '/faq/' }
    ],

    sidebar: sidebar(),

    socialLinks: [
      { icon: 'github', link: repository, ariaLabel: 'GitHub' },
      { icon: { svg: telegramIcon }, link: 'https://t.me/HackGPON', ariaLabel: 'Telegram' }
    ],

    editLink: {
      pattern: `${repository}/edit/main/:path`,
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last Modified',
      formatOptions: { dateStyle: 'medium' }
    },

    search: {
      provider: 'local',
      options: {
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false || env.frontmatter?.redirect_to) return ''
          // footnote references in the headings would be taken as section anchors
          return html.replace(/<sup class="footnote-ref">.*?<\/sup>/g, '')
        }
      }
    },

    outline: {
      level: [1, 3]
    },

    docFooter: {
      prev: false,
      next: false
    }
  }
})

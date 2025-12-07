import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Hack GPON',
  description: 'Worldwide wiki on how to access, change and edit ONTs',
  
  // Keep URLs consistent with Jekyll
  cleanUrls: true,
  
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
    ['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],

  themeConfig: {
    logo: '/favicon-32x32.png',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'FAQ', link: '/faq' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'FAQ', link: '/faq' },
        ]
      },
      {
        text: 'ONT GPON',
        collapsed: false,
        link: '/ont-zte',
        items: []
      },
      {
        text: 'ONT XGS-PON',
        collapsed: false,
        items: []
      },
      {
        text: 'ONT EPON',
        collapsed: false,
        items: []
      },
      {
        text: 'Router PON',
        collapsed: false,
        items: []
      },
      {
        text: 'Tools',
        collapsed: false,
        items: []
      },
      {
        text: 'SFP Resources & standard',
        collapsed: false,
        items: []
      },
      {
        text: 'GPON Resources & standard',
        collapsed: false,
        items: []
      },
      {
        text: 'SFP cage',
        collapsed: false,
        items: []
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hack-gpon/hack-gpon.github.io' }
    ],

    editLink: {
      pattern: 'https://github.com/hack-gpon/hack-gpon.github.io/tree/main/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Copyright &copy; 2022-2023. The documentation hereby found is distributed under the terms of the <a href="https://github.com/hack-gpon/hack-gpon.github.io/blob/main/LICENSE">MIT License</a>. Any external reference, link or software retains its original license and is not under the control of this website. <a href="/privacy-policy">Privacy Policy</a>.',
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    }
  },

  // Custom rewrites to maintain Jekyll URL structure
  rewrites: {
    // ONT GPON: /_ont/ont-xxx.md -> /ont-xxx (remove _ont prefix, keep filename)
    '_ont/:file': ':file',
    
    // ONT XGS-PON: /_ont_xgs/ont-xxx.md -> /xgs/ont-xxx
    '_ont_xgs/:file': 'xgs/:file',
    
    // ONT EPON: /_ont_epon/xxx.md -> /epon/xxx
    '_ont_epon/:file': 'epon/:file',
    
    // Router PON: /_router_pon/xxx.md -> /router/xxx
    '_router_pon/:file': 'router/:file',
    
    // Tools, SFP, GPON, SFP cage: keep at root level as Jekyll did
    '_tools/:file': ':file',
    '_sfp/:file': ':file',
    '_gpon/:file': ':file',
    '_sfp_cage/:file': ':file',
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 1000
    },
    resolve: {
      alias: {
        '@components': '/components'
      }
    }
  }
})

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import AsciiHex from './components/AsciiHex.vue'
import CigPassword from './components/CigPassword.vue'
import CrcVerifier from './components/CrcVerifier.vue'
import CiteAs from './components/CiteAs.vue'
import HisensePloam from './components/HisensePloam.vue'
import ImageFigure from './components/ImageFigure.vue'
import LantiqEeprom from './components/LantiqEeprom.vue'
import Mermaid from './components/Mermaid.vue'
import OmciVlanParser from './components/OmciVlanParser.vue'
import RootLantiq from './components/RootLantiq.vue'
import SpeedCalculator from './components/SpeedCalculator.vue'
import YmodemLantiq from './components/YmodemLantiq.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('AsciiHex', AsciiHex)
    app.component('CigPassword', CigPassword)
    app.component('CrcVerifier', CrcVerifier)
    app.component('CiteAs', CiteAs)
    app.component('HisensePloam', HisensePloam)
    app.component('ImageFigure', ImageFigure)
    app.component('LantiqEeprom', LantiqEeprom)
    app.component('Mermaid', Mermaid)
    app.component('OmciVlanParser', OmciVlanParser)
    app.component('RootLantiq', RootLantiq)
    app.component('SpeedCalculator', SpeedCalculator)
    app.component('YmodemLantiq', YmodemLantiq)

    // Every page URL ends with a slash (as with Jekyll): fix links written without it
    router.onBeforeRouteChange = (to) => {
      const url = new URL(to, 'http://localhost')
      if (url.pathname !== '/' && !url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) {
        router.go(url.pathname + '/' + url.search + url.hash)
        return false
      }
    }
  }
} satisfies Theme

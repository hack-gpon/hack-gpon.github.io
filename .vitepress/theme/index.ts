import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Alert from './components/Alert.vue'
import ImageFigure from './components/ImageFigure.vue'
import CigPassword from './components/CigPassword.vue'
import CigPasswordXgspon from './components/CigPasswordXgspon.vue'
import RootLantiq from './components/RootLantiq.vue'
import SerialDump from './components/SerialDump.vue'
import YmodemLantiq from './components/YmodemLantiq.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register custom components globally
    app.component('Alert', Alert)
    app.component('ImageFigure', ImageFigure)
    app.component('CigPassword', CigPassword)
    app.component('CigPasswordXgspon', CigPasswordXgspon)
    app.component('RootLantiq', RootLantiq)
    app.component('SerialDump', SerialDump)
    app.component('YmodemLantiq', YmodemLantiq)
  }
}

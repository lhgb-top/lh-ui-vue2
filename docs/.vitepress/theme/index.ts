import DefaultTheme from 'vitepress/theme'
import DemoBlock from '../components/DemoBlock.vue'
import ApiStyleToggle from '../components/ApiStyleToggle.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 站点隔离：vue2 站只注册 docs 自身的展示组件。
    // Vue2 组件不在 VitePress（Vue3）内注册——live demo 走 iframe 沙箱（见 DemoBlock）。
    app.component('DemoBlock', DemoBlock)
    app.component('ApiStyleToggle', ApiStyleToggle)
  },
}

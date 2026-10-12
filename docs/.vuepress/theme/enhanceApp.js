/**
 * lh-ui-vue2 文档站客户端增强（VuePress 1.x theme enhanceApp）
 *
 * 本文件由 webpack 客户端构建编译（可 import .vue / TS 源码），与 theme/index.js
 * （Node 侧纯配置）分工。样式加载顺序：share 全量聚合（令牌明/暗 + 组件规则）先行，
 * 站点自身的 ../styles/index.styl（v1 约定路径，自动应用）后置覆盖 --lh-* 令牌。
 */
import LhUIVue2, { LhMessage, LhNotification, LhLoading } from '../../../src'
import DemoBlock from '../components/DemoBlock.vue'
import ApiStyleToggle from '../components/ApiStyleToggle.vue'
import ThemeStudio from '../components/ThemeStudio.vue'
import LhHome from './LhHome.vue'
import '@lh-ui/share/styles/index.scss'

/**
 * v-reveal 滚动渐入（Vue 2 指令钩子）：bind 时加 .reveal 初始隐藏，进入视口加
 * .reveal--visible（样式在 styles/index.styl §reveal）。用法 `v-reveal` 或
 * `v-reveal="120"`（stagger 延迟毫秒）。SSR 阶段自定义指令不执行，内容直接可见。
 */
const revealObserver = {
  bind(el, binding) {
    el.classList.add('reveal')
    if (typeof binding.value === 'number') {
      el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    }
    if (typeof IntersectionObserver === 'undefined') {
      // 环境不支持（旧浏览器/SSG 爬虫）直接可见，不遮挡内容
      el.classList.add('reveal--visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal--visible')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    // 卸载时兜底断开（元素随路由切换移除）
    el.__lhRevealObserver = observer
  },
  unbind(el) {
    el.__lhRevealObserver?.disconnect()
    delete el.__lhRevealObserver
  },
}

export default ({ Vue }) => {
  // 库全量注册：demo 模板字符串直接使用全局 Lh* 组件
  Vue.use(LhUIVue2)

  // 命令式服务挂全局：demo 的 methods 直接裸写 LhMessage.success(...)（浏览器全局解析）。
  // 与 dev/demo-main.ts 相同接线，此处是 docs 活渲染的专有配置，不进文档代码块；仅客户端
  if (typeof window !== 'undefined') {
    window.LhMessage = LhMessage
    window.LhNotification = LhNotification
    window.LhLoading = LhLoading
  }

  Vue.component('DemoBlock', DemoBlock)
  Vue.component('ApiStyleToggle', ApiStyleToggle)
  Vue.component('ThemeStudio', ThemeStudio)
  // 首页自定义布局（frontmatter layout: LhHome）
  Vue.component('LhHome', LhHome)
  // DarkToggle 由 layouts/Layout.vue 的 page-bottom 插槽渲染，无需在此注册
  Vue.directive('reveal', revealObserver)
}

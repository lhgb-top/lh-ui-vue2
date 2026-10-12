/**
 * lh-ui-vue2 文档站主题入口（VuePress 1.x）
 *
 * 2026-10-10 架构迁移：VitePress（Vue3）→ VuePress 1.x（Vue 2.7 原生）。
 * 站点运行时即 Vue 2.7，与库同框架——live demo 直接活渲染（DemoBlock），
 * 不再走 iframe 沙箱；库组件经 Vue.use 全量注册（与文档「全量引入」用户路径一致）。
 *
 * VuePress 1.x 的主题入口由 Node 侧 require 加载（moduleResolver 只认 .js），
 * 只能放纯配置；客户端运行时逻辑（注册组件 / 指令 / 挂命令式服务）在
 * 同目录 enhanceApp.js，它走 webpack 客户端构建，可 import .vue 与 TS 源码。
 *
 * 这里的 plugins 覆盖默认主题的容器标题：本站中文 locale 就是 '/'，而默认主题
 * 的 defaultTitle 把中文文案挂在死键 '/zh/' 上（容器插件按 relativePath 前缀匹配
 * locale），中文页全部回退到 '/' 拿到英文大写。必须放在主题入口而非 config.ts——
 * PluginAPI.use() 是后注册覆盖先注册，applyUserPlugins 里用户 config 的插件最先、
 * 父主题（默认主题）在其后，config.ts 里写会被默认主题覆盖掉；主题入口注册在
 * 父主题之后，这里才能赢。只覆盖 md 实际用到的 tip / warning（details 的
 * before/after 自定义渲染保持默认主题原样，不接管）。
 *
 * ⚠️ 改这里后必须清 webpack 缓存再构建：缓存目录是
 * `@vuepress/core/node_modules/.cache/vuepress`（在 node_modules 里，不是
 * `.vuepress/cache`），且 cacheIdentifier 只含 config.ts 的 markdown/chainWebpack、
 * 不含主题插件，主题改动不会让缓存失效，会一直出旧 HTML。
 */
module.exports = {
  extend: '@vuepress/theme-default',
  plugins: [
    ['container', { type: 'tip', defaultTitle: { '/': '提示', '/en/': 'TIP' } }],
    ['container', { type: 'warning', defaultTitle: { '/': '警告', '/en/': 'WARNING' } }],
  ],
}

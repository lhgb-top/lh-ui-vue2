import { defineConfig } from 'vitepress'

// 站点规范 URL：DOCS_HOSTNAME + DOCS_BASE（与 plus 站同模式，M5 部署联调时统一注入）
const siteUrl =
  (process.env.DOCS_HOSTNAME || 'https://lh-ui.lhgb.top').replace(/\/$/, '') +
  (process.env.DOCS_BASE || '/vue2/')

export default defineConfig({
  lang: 'zh-CN',
  lastUpdated: true,
  // 部署到 /vue2/ 子路径；DOCS_BASE 首尾必须带斜杠
  base: process.env.DOCS_BASE || '/vue2/',
  sitemap: {
    hostname: siteUrl,
  },
  head: [
    ['meta', { name: 'description', content: '企业级 Vue 2.7 国风组件库，基于 @lh-ui/share 共享层的 UI 层实现。' }],
    ['meta', { name: 'keywords', content: 'Vue2,Vue 2.7,Component,UI,lh-ui,国风,组件库,水墨' }],
    ['meta', { property: 'og:title', content: 'lh-ui-vue2 - 企业级 Vue 2.7 国风组件库' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: siteUrl }],
  ],
  title: 'lh-ui-vue2',
  description: '企业级 Vue 2.7 国风组件库',
  themeConfig: {
    siteTitle: 'lh-ui-vue2',
    nav: [
      { text: '指南', link: '/guide/install', activeMatch: '/guide/' },
      { text: '组件', link: '/components/button', activeMatch: '/components/' },
      // 站点互链：各组件库文档独立部署，顶部 nav 可跳转
      { text: 'Vue3 版', link: 'https://lh-ui-plus.lhgb.top/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装', link: '/guide/install' },
            { text: '快速上手', link: '/guide/quickstart' },
            { text: '主题', link: '/guide/theme' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础',
          items: [
            { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
          ],
        },
        {
          text: '数据录入',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Checkbox 多选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Switch 开关', link: '/components/switch' },
          ],
        },
        {
          text: '反馈与展示',
          items: [
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Form 表单', link: '/components/form' },
          ],
        },
      ],
    },
    outline: [2, 3],
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    footer: {
      message: 'lh-ui 家族 · 一个 core（@lh-ui/share），各框架只是 UI 层',
      copyright: 'Copyright © 2026 lh-ui',
    },
  },
})

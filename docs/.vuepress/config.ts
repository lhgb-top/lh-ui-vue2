/**
 * lh-ui-vue2 文档站配置（VuePress 1.x）
 *
 * 2026-10-10 架构迁移：VitePress（Vue3）→ VuePress 1.x（Vue 2.7 原生），
 * live demo 从 iframe 沙箱改为注册表活渲染（见 components/DemoBlock.vue）。
 * 原 VitePress 配置的 locales / sidebar / head / env 结构在此逐段平移。
 */
import crypto from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
// ESM 适配器：VuePress 经 bundle-require（esbuild）把本配置内联成 .mjs 执行，
// 依赖模块必须用静态 import（node: 内置模块在内联后不能走 require）
import { createLocalShareAliasesWebpack } from '../../scripts/local-share-alias-webpack.mjs'

// ------------------------------------------------------------------------------
// webpack 4 / Node 17+ 的 md4 hash 兼容 shim
// webpack 4 默认用 OpenSSL 的 md4 生成模块哈希，OpenSSL 3（Node 17+）已移除该算法，
// 直接构建报 ERR_OSSL_EVP_UNSUPPORTED。把 createHash('md4') 重定向到 md5，
// 不依赖 --openssl-legacy-provider（该 flag 在部分 Node 构建中不可用）。
// VuePress 构建与本配置同进程求值，此处 patch 即全局生效。
// ------------------------------------------------------------------------------
const originalCreateHash = crypto.createHash.bind(crypto)
;(crypto as any).createHash = (algorithm: string, options?: any) =>
  originalCreateHash(algorithm === 'md4' ? 'md5' : algorithm, options)

// ------------------------------------------------------------------------------
// 部署 base：单一数据源。显式读 .env 文件（行内变量优先），
// 部署路径改 docs/.env.production，临时覆盖仍可用行内变量。
// ------------------------------------------------------------------------------
function loadDocsEnv(): Record<string, string> {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const out: Record<string, string> = {}
  for (const file of ['.env', `.env.${mode}`]) {
    const full = resolve(__dirname, '..', file)
    if (!existsSync(full)) continue
    for (const line of readFileSync(full, 'utf8').split('\n')) {
      const m = line.match(/^\s*(DOCS_[A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !(m[1] in out)) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
  // 行内环境变量最优先（Windows Git Bash 行内变量会被 MSYS 转路径，与 vitepress 时代一致）
  for (const [k, v] of Object.entries(process.env)) {
    if (k.startsWith('DOCS_') && v != null) out[k] = v
  }
  return out
}

const env = loadDocsEnv()
const base = env.DOCS_BASE || '/'
const hostname = (env.DOCS_HOSTNAME || 'https://www.lhgb.top').replace(/\/$/, '')
const siteUrl = hostname + base

// 暗色防闪烁：首屏绘制前恢复上次选择的暗色态（与 DarkToggle.vue 同一 localStorage 键）
const DARK_FOUC_SCRIPT = `
(function () {
  try {
    if (localStorage.getItem('lh-docs-dark') === '1') {
      document.documentElement.dataset.theme = 'dark'
    }
  } catch (e) { /* localStorage 不可用时静默失败 */ }
})()
`.trim()

// ------------------------------------------------------------------------------
// 侧边栏数据：中英双语标签同源维护（原 vitepress 配置逐段平移）。
// VuePress 1.x 的侧边栏条目为纯路径字符串，条目文案取自各页面 h1 标题。
// ------------------------------------------------------------------------------
interface SidebarEntry {
  zh: string
  en: string
  slug: string
}

interface SidebarGroup {
  zh: string
  en: string
  items: SidebarEntry[]
}

const componentGroups: SidebarGroup[] = [
  {
    zh: '基础',
    en: 'Basics',
    items: [
      { zh: 'ConfigProvider 全局配置', en: 'ConfigProvider', slug: 'config-provider' },
      { zh: 'Button 按钮', en: 'Button', slug: 'button' },
      { zh: 'Icon 图标', en: 'Icon', slug: 'icon' },
      { zh: 'Tag 标签', en: 'Tag', slug: 'tag' },
      { zh: 'Divider 分割线', en: 'Divider', slug: 'divider' },
      { zh: 'Space 间距', en: 'Space', slug: 'space' },
      { zh: 'Card 卡片', en: 'Card', slug: 'card' },
    ],
  },
  {
    zh: '布局',
    en: 'Layout',
    items: [
      { zh: 'Row / Col 栅格', en: 'Row / Col', slug: 'grid' },
      { zh: 'Layout 布局容器', en: 'Layout', slug: 'layout' },
      { zh: 'Collapse 折叠面板', en: 'Collapse', slug: 'collapse' },
      { zh: 'Descriptions 描述列表', en: 'Descriptions', slug: 'descriptions' },
    ],
  },
  {
    zh: '数据录入',
    en: 'Data Entry',
    items: [
      { zh: 'Input 输入框', en: 'Input', slug: 'input' },
      { zh: 'Select 选择器', en: 'Select', slug: 'select' },
      { zh: 'Checkbox 多选框', en: 'Checkbox', slug: 'checkbox' },
      { zh: 'Radio 单选框', en: 'Radio', slug: 'radio' },
      { zh: 'Switch 开关', en: 'Switch', slug: 'switch' },
      { zh: 'InputNumber 计数器', en: 'InputNumber', slug: 'input-number' },
      { zh: 'Rate 评分', en: 'Rate', slug: 'rate' },
      { zh: 'Slider 滑块', en: 'Slider', slug: 'slider' },
      { zh: 'Segmented 分段选择', en: 'Segmented', slug: 'segmented' },
      { zh: 'Cascader 级联选择', en: 'Cascader', slug: 'cascader' },
      { zh: 'DatePicker 日期选择', en: 'DatePicker', slug: 'date-picker' },
      { zh: 'TimePicker 时间选择', en: 'TimePicker', slug: 'time-picker' },
      { zh: 'TreeSelect 树选择器', en: 'TreeSelect', slug: 'tree-select' },
      { zh: 'Upload 上传', en: 'Upload', slug: 'upload' },
      { zh: 'Form 表单', en: 'Form', slug: 'form' },
    ],
  },
  {
    zh: '数据展示',
    en: 'Data Display',
    items: [
      { zh: 'Badge 徽标', en: 'Badge', slug: 'badge' },
      { zh: 'Avatar 头像', en: 'Avatar', slug: 'avatar' },
      { zh: 'Statistic 统计数值', en: 'Statistic', slug: 'statistic' },
      { zh: 'Progress 进度条', en: 'Progress', slug: 'progress' },
      { zh: 'Timeline 时间线', en: 'Timeline', slug: 'timeline' },
      { zh: 'Empty 空状态', en: 'Empty', slug: 'empty' },
      { zh: 'Skeleton 骨架屏', en: 'Skeleton', slug: 'skeleton' },
      { zh: 'Spinner 加载指示器', en: 'Spinner', slug: 'spinner' },
      { zh: 'Image 图片', en: 'Image', slug: 'image' },
      { zh: 'VirtualList 虚拟列表', en: 'VirtualList', slug: 'virtual-list' },
      { zh: 'Calendar 日历', en: 'Calendar', slug: 'calendar' },
      { zh: 'Table 表格', en: 'Table', slug: 'table' },
      { zh: 'Tree 树形控件', en: 'Tree', slug: 'tree' },
      { zh: 'Transfer 穿梭框', en: 'Transfer', slug: 'transfer' },
    ],
  },
  {
    zh: '反馈',
    en: 'Feedback',
    items: [
      { zh: 'Alert 警告提示', en: 'Alert', slug: 'alert' },
      { zh: 'Message 全局提示', en: 'Message', slug: 'message' },
      { zh: 'Notification 通知提醒', en: 'Notification', slug: 'notification' },
      { zh: 'Loading 加载', en: 'Loading', slug: 'loading' },
      { zh: 'Dialog 对话框', en: 'Dialog', slug: 'dialog' },
      { zh: 'Drawer 抽屉', en: 'Drawer', slug: 'drawer' },
      { zh: 'Tooltip 文字提示', en: 'Tooltip', slug: 'tooltip' },
      { zh: 'Popover 气泡卡片', en: 'Popover', slug: 'popover' },
      { zh: 'Popconfirm 气泡确认框', en: 'Popconfirm', slug: 'popconfirm' },
      { zh: 'Dropdown 下拉菜单', en: 'Dropdown', slug: 'dropdown' },
    ],
  },
  {
    zh: '导航',
    en: 'Navigation',
    items: [
      { zh: 'Breadcrumb 面包屑', en: 'Breadcrumb', slug: 'breadcrumb' },
      { zh: 'Pagination 分页', en: 'Pagination', slug: 'pagination' },
      { zh: 'Tabs 页签', en: 'Tabs', slug: 'tabs' },
      { zh: 'Steps 步骤条', en: 'Steps', slug: 'steps' },
      { zh: 'Menu 导航菜单', en: 'Menu', slug: 'menu' },
      { zh: 'Anchor 锚点', en: 'Anchor', slug: 'anchor' },
      { zh: 'Affix 固钉', en: 'Affix', slug: 'affix' },
      { zh: 'BackTop 回到顶部', en: 'BackTop', slug: 'backtop' },
    ],
  },
]

const guideGroups: SidebarGroup[] = [
  {
    zh: '指南',
    en: 'Guide',
    items: [
      { zh: '安装', en: 'Installation', slug: 'install' },
      { zh: '快速上手', en: 'Quick Start', slug: 'quickstart' },
      { zh: '主题', en: 'Theming', slug: 'theme' },
      { zh: '主题定制台', en: 'Theme Studio', slug: 'theme-studio' },
    ],
  },
]

/** 按 locale 生成侧边栏（prefix 为 '/guide' 或 '/en/guide'，与文件目录结构一致） */
function buildSidebar(prefix: string, groups: SidebarGroup[], isEn: boolean) {
  return groups.map((group) => ({
    title: isEn ? group.en : group.zh,
    collapsable: false,
    children: group.items.map((item) => `${prefix}/${item.slug}`),
  }))
}

export default {
  // 部署到子路径（如 /lhui/vue2/）时通过 docs/.env.production 的 DOCS_BASE 配置
  base,
  title: 'lh-ui-vue2',
  description: '企业级 Vue 2.7 国风组件库',
  head: [
    // 静态资源放 .vuepress/public（v1 约定；VitePress 的 docs/public 已迁移），
    // href 写根绝对路径即可——非根 base 下 App.normalizeHeadTagUrls 会自动补前缀
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'description', content: '企业级 Vue 2.7 国风组件库，基于 @lh-ui/share 共享层的 UI 层实现。' }],
    ['meta', { name: 'keywords', content: 'Vue2,Vue 2.7,Component,UI,lh-ui,国风,组件库,水墨' }],
    ['meta', { property: 'og:title', content: 'lh-ui-vue2 - 企业级 Vue 2.7 国风组件库' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['script', {}, DARK_FOUC_SCRIPT],
  ],
  plugins: [
    // 站点地图对齐 vitepress 时代的 sitemap.hostname 配置
    // exclude：404 路由不该被收录；changefreq：组件库文档更新频率远低于 daily
    ['sitemap', { hostname: siteUrl, exclude: ['/404.html'], changefreq: 'weekly' }],
  ],
  locales: {
    '/': {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'lh-ui-vue2',
      description: '企业级 Vue 2.7 国风组件库',
    },
    '/en/': {
      label: 'English',
      lang: 'en-US',
      title: 'lh-ui-vue2',
      description: 'Enterprise-grade Vue 2.7 ink-style component library',
    },
  },
  themeConfig: {
    // GitHub 徽标链接（v1 默认主题原生渲染 repo 图标）
    repo: 'lh-ui/lh-ui-vue2',
    repoLabel: 'GitHub',
    // navbar 左侧品牌标（默认主题走 $withBase，自动补 base）
    logo: '/logo.svg',
    lastUpdated: true,
    smoothScroll: true,
    // v1 内置搜索的 placeholder 只支持全局单值（不按 locale 取），用双语折中
    searchPlaceholder: '搜索 / Search',
    searchMaxSuggestions: 10,
    locales: {
      '/': {
        nav: [
          { text: '指南', link: '/guide/install' },
          { text: '组件', link: '/components/button' },
          // 站点互链：各组件库文档统一部署在 www.lhgb.top/lhui/{库名}/
          { text: 'Vue3 版', link: 'https://www.lhgb.top/lhui/plus/' },
        ],
        sidebar: {
          '/guide/': buildSidebar('/guide', guideGroups, false),
          '/components/': buildSidebar('/components', componentGroups, false),
        },
        lastUpdated: '最后更新',
      },
      '/en/': {
        nav: [
          { text: 'Guide', link: '/en/guide/install' },
          { text: 'Components', link: '/en/components/button' },
          { text: 'Vue3 Version', link: 'https://www.lhgb.top/lhui/plus/' },
        ],
        sidebar: {
          '/en/guide/': buildSidebar('/en/guide', guideGroups, true),
          '/en/components/': buildSidebar('/en/components', componentGroups, true),
        },
        lastUpdated: 'Last Updated',
      },
    },
  },
  // config.ts 经 bundle-require（esbuild）转译加载，不做类型检查；webpack-chain
  // 的完整类型在 docs 包内没有类型源，这里用宽松签名
  chainWebpack: (config: any) => {
    // TS 支持：@vuepress/core 不内置 ts-loader，库源码（.ts + SFC lang="ts"）与
    // theme/enhanceApp.js 引入的 .ts 模块全靠这条规则；transpileOnly 只转译不查类型
    // （类型检查由各仓自身的 pnpm typecheck 负责）；appendTsSuffixTo 让 vue-loader 15
    // 的 SFC script lang="ts" 块也走 ts-loader
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        transpileOnly: true,
        happyPackMode: true,
        appendTsSuffixTo: [/\.vue$/],
        // ts-loader 向上查到仓库根 tsconfig（target: es2020），?? / ?. 原样保留；
        // webpack 4 的 acorn 只到 ES2019，解析阶段就 "Module parse failed"。
        // 这里覆盖到 es2018，仅影响 docs 构建的产物语法，不碰库的 tsconfig
        compilerOptions: { target: 'es2018' },
      })
    // 目录式导入（enhanceApp.js 的 '../../../src'、DemoBlock 的 '../../../dev/demos'）
    // 要解析到 index.ts：v1 默认 extensions 只有 .js/.jsx/.vue/.json/.styl，得补 .ts。
    // 关键顺序：.ts 必须排在 .vue 前面。库源码里每个组件目录都同时有 src/index.ts
    // （composable）与 src/index.vue（组件），SFC 里 `import { useLhXxx } from './index'`
    // 一律指 .ts；.ts 排在 .vue 之后会命中 index.vue，形成循环导入，useLhXxx 拿到
    // undefined，demo 全部渲染成空注释节点（vite 默认扩展名不含 .vue，所以库本体无此问题）。
    // 全仓 .ts 与 .vue 的同名碰撞只有这一类，且全部要 .ts，重排无其它副作用
    config.resolve.extensions.delete('.ts')
    config.resolve.extensions.delete('.vue')
    config.resolve.extensions.add('.ts')
    config.resolve.extensions.add('.vue')
    // demo 模板字符串需要运行时编译器：vue 别名到完整构建（dev 沙箱同款，红线 #10 的 docs 版）。
    // 用子路径而非绝对路径，保证解析到 docs 包自装的 vue@2.7.16，与库源码引用同一实例
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
    // 库源码联动：活渲染直接吃 src/ 源码（vue-loader15 + 上面的 ts-loader 编译 Options API）
    config.resolve.alias.set('@lh-ui/vue2$', resolve(__dirname, '../../src/index.ts'))
    // 家族布局下解析到同级 lh-ui-share 源码；兄弟仓不存在时守卫返回空对象、回退 npm 包
    const shareAliases = createLocalShareAliasesWebpack(resolve(__dirname, '../..'))
    for (const [key, value] of Object.entries(shareAliases)) {
      config.resolve.alias.set(key, value)
    }
  },
}

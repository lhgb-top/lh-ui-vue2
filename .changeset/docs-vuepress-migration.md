---
'@lh-ui/vue2': minor
---

# docs 站迁移 VuePress 1.x：iframe 废止，demo 注册表活渲染

## docs 站架构迁移（用户可见行为不变，维护体验重构）

- **框架更换**：VitePress（Vue3 运行时）→ **VuePress 1.9 + Vue 2.7 原生**——docs 站与库同框架，
  Vue2 组件可直接在站点内渲染。VuePress 1.x 处于维护模式、Vue 2 EOL，为知情接受的取舍
  （替代路线 VitePress 内联 Vue2 因 plugin-vue5 与 plugin-vue2 的 SFC 子请求冲突不可行）。
- **demo 活渲染**：`DemoBlock.vue` 重写——按 name 从 `dev/demos/index.ts` 注册表取条目，
  `<component :is>` 运行时编译模板直接渲染（`vue$` alias 完整构建 + `<client-only>` 包裹），
  **iframe 沙箱整体退役**：`build:demo` / `copy-demo.mjs` / `docs/public/demos/` 产物链路删除，
  `?theme=dark` 查询参数、骨架屏、ResizeObserver 测高、明暗重载闪烁全部成为历史；
  docs:dev 下改注册表即时热更新，明暗切换与站点天然同步。
- **md 零改动**：116 处 `<DemoBlock name title>` 调用 API 不变（`height` prop 降级为
  min-height 兼容保留）；`gen:demo-code` / `verify:demo` 围栏门禁职责不变。
- **暗色能力补齐**：VuePress 1.x 默认主题无暗色——新增 `theme/DarkToggle.vue`
  （浮动按钮 + localStorage `lh-docs-dark`）与 config head 防闪烁脚本，功能对齐 VitePress appearance。
- **首页自定义布局**：`theme/LhHome.vue`（frontmatter `layout: LhHome` + `sidebar: false`），
  保留大字渐变主标 / 多 CTA / icon 特性卡片的视觉；站点样式平移至 v1 约定路径
  `docs/.vuepress/styles/{palette,index}.styl`，DOM 选择器重定向到 v1 默认主题。
- **搜索降级说明**：VitePress local search → VuePress 1.x 内置搜索（标题/正文索引）。

## 迁移尾巴收口（2026-10-11，用户可见）

- **静态资源目录归位**：`docs/public/`（VitePress 约定）→ `docs/.vuepress/public/`
  （v1 约定）——迁移时漏移导致首页 logo 裂图、`robots.txt` / `.nojekyll` 未发射；
  robots.txt 补 `Sitemap:` 声明，config head 补 favicon、themeConfig 补 navbar logo。
- **`::: tip/warning` 容器标题中文化**：默认主题的中文文案挂在死键 `/zh/` 上（本站中文
  locale 就是 `/`），中文页全回退到英文大写。在 `theme/index.js` 覆盖
  `defaultTitle: { '/': '提示', '/en/': 'TIP' }`——**必须放主题而非 config.ts**：
  v1 的 `PluginAPI.use()` 后注册覆盖先注册，config 插件会被默认主题覆盖掉。
- **DemoBlock 中英双语**：查看/隐藏代码按钮与未知 demo 兜底文案按 `$localePath` 分流，
  英文站不再显示中文按钮。
- **搜索 placeholder**：v1 内置搜索的 placeholder 只支持全局单值，取双语折中 `搜索 / Search`。
- **sitemap 卫生**：排除 `/404.html`（不该被收录），changefreq 由默认 daily 改 weekly。

## 开发体验（不发版，docs/ 均不在 files 内）

- **依赖面**（docs 独立 workspace）：`vuepress@^1.9.10` + `vue@2.7.16` /
  `vue-template-compiler@2.7.16`（精确对齐）+ `ts-loader@^8`（@vuepress/core 不内置 ts 规则，
  config chainWebpack 补 transpileOnly + appendTsSuffixTo，库 src/ 源码直接进 docs 构建）+
  `sass@~1.104`（share 组件 scss 用到 sass 1.77 不支持的父选择器语法；钉 legacy-js-api
  弃用警告为可接受噪音）+ `vuepress-plugin-sitemap@^2.3.1`。
- **webpack4 / Node 17+ 兼容**：config.ts 顶部 `crypto.createHash` md4→md5 shim，
  不依赖 `--openssl-legacy-provider`；ts-loader 显式 `target: es2018`（webpack4 的 acorn
  只到 ES2019，库源码的 `??` / `?.` 会在解析阶段失败）。
- **resolve.extensions 顺序**（活渲染关键）：v1 默认 `['.js','.jsx','.vue','.json','.styl']`
  不含 `.ts`，补 `.ts` 时必须排到 `.vue` **前面**——库源码每个组件目录都同时有
  `src/index.ts`（composable）与 `src/index.vue`（组件），SFC 里 `from './index'` 一律指
  `.ts`；顺序反了会命中 `.vue` 形成循环导入，`useLhXxx` 拿到 undefined，demo 全部渲染成
  空注释节点（vite 默认扩展名不含 `.vue`，库本体无此问题）。
- **内存**：docs 的 dev/build 显式 `--max-old-space-size=8192`（webpack4 多轮增量编译
  在默认 4GB 堆下会 OOM 退出）。
- **share 源码联动**（webpack4 字符串 alias）：新增 `scripts/local-share-alias-webpack.mjs`
  （以 ESM 提供：config.ts 经 bundle-require 内联进 .mjs，node: 内置模块必须静态 import）——
  webpack4 不支持正则 alias，逐条枚举（`@lh-ui/share$` 精确 + 顶层模块前缀 +
  各组件样式名），守卫语义与 vite 版 `local-share-alias.mjs` 同构。
- **主题入口拆分**：`theme/index.js`（Node 侧纯配置，`extend: @vuepress/theme-default`；
  v1 的 moduleResolver 只认 .js）+ `theme/enhanceApp.js`（客户端运行时：库注册、
  命令式服务挂全局、DemoBlock/ApiStyleToggle/ThemeStudio/LhHome 注册、v-reveal 指令）。
- **预览服务器**：VuePress 1.x 只有 dev/build/eject/info，**没有 preview 命令**
  （VitePress 才有）——新增零依赖 `docs/scripts/preview.mjs` 托管 `.vuepress/dist`
  （静态直出 + `.html` 后缀补全 + 404 兜底 + 读 `.env.production` 的 `DOCS_BASE`
  按部署 base 挂载，与 SSR 产物的资源路径一致）。
- **webpack 缓存一键清理**：VuePress 1.x 的 webpack 缓存在
  `@vuepress/core/node_modules/.cache/vuepress`（**在 node_modules 里**，不是
  `docs/.vuepress/cache`），且 cacheIdentifier 不含主题插件——改 theme/ 后构建会静默出旧 HTML。
  新增 `docs/scripts/clean-cache.mjs` + 根级 `pnpm docs:clean-cache` 包装（pnpm 层级不固定，
  脚本做了递归查找）。
- **ThemeStudio 双兼容改写**：共享组件改为 Options API（Vue 2.7 与 Vue 3 均可运行），
  去 vitepress 依赖（语言检测 `$lang` + pathname 兜底），与 plus 仓逐字节同步由
  `verify:docs-sync` 继续守护。
- 本地联动接入点更新：`docs/.vuepress/config.ts` 走 webpack 适配器（vite 版正则 alias 不适用）。

> docs 站依赖不含在 npm 产物内（docs/ 不在 files），本 changeset 不影响包体积与运行时。

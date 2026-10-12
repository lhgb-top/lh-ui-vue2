import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue2 from '@vitejs/plugin-vue2'
import { readdirSync } from 'node:fs'
import { createLocalShareAliases } from '../scripts/local-share-alias.mjs'

// 沙箱使用完整构建（含模板编译器）：AGENTS.md 红线 #10
// demo html 平铺在 dev/ 根（dev/<name>.html），data-demo 指向 demos/index.ts 的注册表键
const COMPONENTS = readdirSync(__dirname).filter((name) => name.endsWith('.html') && name !== 'index.html')

export default defineConfig(() => ({
  root: __dirname, // 沙箱根 = dev/：html 输出按 entries 相对路径落位
  plugins: [vue2()],
  resolve: {
    alias: [
      { find: 'vue', replacement: 'vue/dist/vue.esm.js' },
      // 本地联动：家族布局下解析到同级 share 仓源码，无则回退 npm 包（见 scripts/local-share-alias.mjs）
      ...createLocalShareAliases(resolve(__dirname, '..')),
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 组件 scss 源在 @lh-ui/share 内，bare specifier 的 @use 走 node_modules 解析
        loadPaths: [resolve(__dirname, '..', 'node_modules')],
      },
    },
  },
  // docs 站已迁移 VuePress 1.x 活渲染，不再消费 demo 构建产物；
  // dev 沙箱仅作本地冒烟预览，base 恒为根路径
  base: '/',
  server: { port: 5174 },
  build: {
    outDir: resolve(__dirname, '..', 'dev-dist'), // 本地冒烟构建产物（不进文档站）
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          COMPONENTS.map((name) => [name.replace(/\.html$/, ''), resolve(__dirname, name)]),
        ),
      },
    },
  },
}))

import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue2 from '@vitejs/plugin-vue2'
import { readdirSync } from 'node:fs'

// 沙箱使用完整构建（含模板编译器）：AGENTS.md 红线 #10
// demo html 平铺在 dev/ 根（dev/<name>.html），data-demo 指向 demos/index.ts 的注册表键
const COMPONENTS = readdirSync(__dirname).filter((name) => name.endsWith('.html') && name !== 'index.html')

export default defineConfig(({ mode }) => ({
  root: __dirname, // 沙箱根 = dev/：html 输出按 entries 相对路径落位
  plugins: [vue2()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    },
  },
  // demo 产物拷入 docs public 后以相对路径引用资源，任意部署前缀均可加载
  base: mode === 'demo' ? './' : '/',
  server: { port: 5174 },
  build: {
    outDir: resolve(__dirname, '..', 'dev-dist'), // 统一输出到项目根（copy-demo 的源）
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

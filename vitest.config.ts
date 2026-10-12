import vue2 from '@vitejs/plugin-vue2'
import { defineConfig } from 'vitest/config'
import { createLocalShareAliases } from './scripts/local-share-alias.mjs'

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: [
      // 本地联动：家族布局下解析到同级 share 仓源码，无则回退 npm 包（见 scripts/local-share-alias.mjs）
      ...createLocalShareAliases(__dirname),
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
  },
})

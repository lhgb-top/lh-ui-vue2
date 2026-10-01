import vue2 from '@vitejs/plugin-vue2'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue2()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
  },
})

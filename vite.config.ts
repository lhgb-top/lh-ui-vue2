import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

/**
 * 按 mode 分三步构建（等价 plus 的 FORMAT 环境变量方案，Windows 友好）：
 *   esm → es/   preserveModules，产物镜像 src（与 tsc 镜像 d.ts 同构，tree-shaking 友好）
 *   cjs → lib/  preserveModules，build:styles 阶段补 lib/package.json 的 commonjs 标记
 *   umd → dist/lh-ui-vue2.umd.js 单文件；@lh-ui/share 内联进 bundle（share 无 UMD 产物，内联保证 script 标签用法自足），vue 外置
 */
export default defineConfig(({ mode }) => {
  if (mode === 'umd') {
    return {
      plugins: [vue2()],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
          entry: 'src/index.ts',
          name: 'LhUIVue2',
          fileName: 'lh-ui-vue2',
          formats: ['umd'],
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: { vue: 'Vue' },
          },
        },
      },
    }
  }

  const isCjs = mode === 'cjs'
  return {
    plugins: [vue2()],
    build: {
      outDir: isCjs ? 'lib' : 'es',
      emptyOutDir: true,
      minify: false,
      lib: {
        entry: 'src/index.ts',
        formats: [isCjs ? 'cjs' : 'es'],
      },
      rollupOptions: {
        // 正则匹配：@lh-ui/share 的子路径导入（如 '@lh-ui/share/locales'）同样外置
        external: ['vue', /^@lh-ui\/share/],
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          exports: 'named',
        },
      },
    },
  }
})

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

/**
 * 按 mode 分三步构建（等价 plus 的 FORMAT 环境变量方案，Windows 友好）：
 *   esm → es/   preserveModules，产物镜像 src（与 tsc 镜像 d.ts 同构，tree-shaking 友好）
 *   cjs → lib/  preserveModules，build:styles 阶段补 lib/package.json 的 commonjs 标记
 *   umd → dist/lh-ui-vue2.umd.js 单文件；@lh-ui/share 内联进 bundle（share 无 UMD 产物，内联保证 script 标签用法自足），vue 外置
 *
 * UMD 文件名说明：根 package.json 声明了 "type": "module"，vite 会为 umd 自动加 .cjs 后缀，
 * 与 package.json 的 unpkg / jsdelivr / exports["./dist"] 声明（.umd.js）不一致，
 * 故此处用函数显式给出完整文件名覆盖后缀推断。
 *
 * theme / constants 是纯转发模块（re-export @lh-ui/share 的 theme 与 constants），
 * src/index.ts 不引用它们，单入口构建不会产出；作为 lib 多入口，使 es/theme.js、
 * es/constants.js 与 tsc 产出的 es/theme.d.ts、es/constants.d.ts 对齐，
 * package.json exports 的 ./theme、./constants 子路径才可用（跨库迁移便利层）。
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
          fileName: () => 'lh-ui-vue2.umd.js',
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
        entry: {
          index: 'src/index.ts',
          theme: 'src/theme.ts',
          constants: 'src/constants.ts',
        },
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

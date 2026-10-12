/**
 * dts 聚合配置（M1 首个组件落地时启用，见 docs/vue2/vue2组件库计划.md §7.2）：
 * 把 es/ 的镜像 d.ts 按入口聚合为 dist/dts/*.d.ts；
 * `.vue.d.ts` shim 约定沿 plus。
 * M0b 阶段产物为按文件镜像（es/**.d.ts），exports types 已可用，本配置暂不接入 build 链。
 */
import { resolve } from 'node:path'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: resolve('es/index.d.ts'),
    output: { file: 'dist/dts/index.d.ts', format: 'es' },
    plugins: [dts()],
    external: ['vue', /^@lh-ui\/share/],
  },
]

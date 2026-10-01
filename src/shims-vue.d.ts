/**
 * SFC 通配类型兜底：各组件旁的 index.vue.d.ts 提供精确类型后可逐步收窄
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

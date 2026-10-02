import type { DefineComponent } from 'vue'

/** SFC 类型 shim：模板编译产物不可被 tsc 直接推导（host 无对外 Props） */
declare const LhMessageHost: DefineComponent<Record<string, never>, Record<string, never>, unknown>
export default LhMessageHost

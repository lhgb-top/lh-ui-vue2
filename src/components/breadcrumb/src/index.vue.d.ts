import type { DefineComponent } from 'vue'
import type { LhBreadcrumbProps } from './types'

/** SFC 类型 shim：模板编译产物不可被 tsc 直接推导，显式声明 Props 形状 */
declare const LhBreadcrumb: DefineComponent<LhBreadcrumbProps, Record<string, never>, unknown>
export default LhBreadcrumb

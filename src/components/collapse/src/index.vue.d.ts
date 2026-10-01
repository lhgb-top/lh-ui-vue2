import type { DefineComponent } from 'vue'
import type { LhCollapseProps } from './types'

/** SFC 类型 shim：模板编译产物不可被 tsc 直接推导，显式声明 Props 形状 */
declare const LhCollapse: DefineComponent<LhCollapseProps, Record<string, never>, unknown>
export default LhCollapse

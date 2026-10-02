import type { DefineComponent } from 'vue'
import type { LhAnchorProps } from './types'

/** SFC 类型 shim：模板编译产物不可被 tsc 直接推导，显式声明 Props 形状 */
declare const LhAnchor: DefineComponent<LhAnchorProps, Record<string, never>, unknown>
export default LhAnchor

import type { DefineComponent } from 'vue'
import type { LhStepsProps } from './types'

/** SFC 类型 shim：模板编译产物不可被 tsc 直接推导，显式声明 Props 形状 */
declare const LhSteps: DefineComponent<LhStepsProps, Record<string, never>, unknown>
export default LhSteps

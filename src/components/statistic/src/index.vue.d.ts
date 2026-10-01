import type { DefineComponent } from 'vue'
import type { LhStatisticProps } from './types'

/** SFC 类型 shim：模板编译产物不可被 tsc 直接推导，显式声明 Props 形状 */
declare const LhStatistic: DefineComponent<LhStatisticProps, Record<string, never>, unknown>
export default LhStatistic

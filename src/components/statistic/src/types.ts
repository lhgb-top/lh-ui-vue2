import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export interface LhStatisticProps {
  /** 数值标题（展示在数值上方） */
  title?: string
  /** 统计数值；字符串形式可承载超大数或带符号文本 */
  value: number | string
  /** 小数精度 */
  precision?: number
  /** 千位分隔符；空串关闭分组 */
  separator?: string
  /** 数值前缀，如货币符号 */
  prefix?: string
  /** 数值后缀，如单位 */
  suffix?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

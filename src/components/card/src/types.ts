import type { LhCardShadow } from '@lh-ui/share/core/card'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhCardProps {
  /** 卡片标题（也可用 header 插槽） */
  title?: string
  /** 阴影显示时机 */
  shadow?: LhCardShadow
  /** 整卡可点击（承担 button 键盘语义） */
  clickable?: boolean
  /** 加载态：内容区以骨架占位 */
  loading?: boolean
  /** 组件级主题变量（键自动加 --lh- 前缀） */
  themeVars?: Record<string, string>
  /** 花纹背景 URL（如 var(--lh-pattern-willow)），不受全局白名单限制 */
  bgPattern?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}

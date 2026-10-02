import type { InjectionKey } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

/** Layout 上下文：Aside 登记后父级切换为垂直布局 */
export interface LhLayoutContext {
  registerAside: () => void
  unregisterAside: () => void
}

export const LH_LAYOUT_KEY: InjectionKey<LhLayoutContext> = Symbol('LhLayoutContext')

export interface LhLayoutProps {
  /** 排列方向（含 Aside 时自动为 vertical） */
  direction?: 'horizontal' | 'vertical'
  /** sx 快速布局属性 */
  sx?: SxProps
}

/** Header / Main / Footer 共用 props */
export interface LhLayoutSectionProps {
  /** sx 快速布局属性 */
  sx?: SxProps
}

export interface LhLayoutAsideProps extends LhLayoutSectionProps {
  /** 侧栏宽度 */
  width?: number | string
  /** 无障碍名称（landmark 命名） */
  ariaLabel?: string
}

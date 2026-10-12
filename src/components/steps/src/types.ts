import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhStepStatus, LhStepsDirection } from '@lh-ui/share/core/steps'

export interface LhStepsProps {
  /** 当前步骤索引（:current.sync，事件名 update:current，0 起） */
  current?: number
  /** 方向 */
  direction?: LhStepsDirection
  /** 步骤是否可点击导航 */
  clickable?: boolean
  /** 整体覆盖所有步骤的状态（用于自定义展示） */
  status?: LhStepStatus
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhStepProps {
  /** 步骤标题（也可用 title 插槽） */
  title?: string
  /** 步骤描述（也可用 description 插槽） */
  description?: string
  /** 自定义图标类名（未传时 finish/error 用勾叉，其余显示序号） */
  icon?: string
}

/** Steps 父子组件上下文 */
export interface LhStepsContext {
  /** 已注册步骤的 token 列表（setup 顺序即渲染顺序） */
  itemTokens: Ref<string[]>
  /** 当前步骤索引 */
  current: Ref<number>
  /** 是否可点击导航 */
  clickable: Ref<boolean>
  /** 整体覆盖状态 */
  forcedStatus: Ref<LhStepStatus | undefined>
  /** 横向定宽折行时每行末项索引（纵向无折行，恒为空）；由父级测量后下发 */
  lineLastIndices: Ref<number[]>
  /** 点击导航到指定步骤 */
  select: (index: number) => void
}

export const LH_STEPS_KEY: InjectionKey<LhStepsContext> = Symbol('LhSteps')

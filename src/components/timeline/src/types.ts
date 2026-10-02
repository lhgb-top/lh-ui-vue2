import type { InjectionKey, Ref } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhTimelineMode } from '@lh-ui/share/core/timeline'

/** 父级向 Item 下发的上下文 */
export interface LhTimelineContext {
  /** 红线 #6：provide computed ref 本体，禁止 props 快照 */
  mode: Ref<LhTimelineMode>
  /** 注册自身并返回 token；index = tokens 中位置（setup 顺序） */
  register: (token: object) => void
  unregister: (token: object) => void
  /** 响应式 token 列表（Item 据此算 index / isLast） */
  tokens: object[]
}

export const LH_TIMELINE_CONTEXT_KEY: InjectionKey<LhTimelineContext> = Symbol('LhTimelineContext')

/** 条目 props（Item 组件） */
export interface LhTimelineItemProps {
  timestamp?: string
  type?: 'primary' | 'success' | 'warning' | 'danger'
  hollow?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

/** 时间线 props */
export interface LhTimelineProps {
  /** 布局模式（alternate 左右交替） */
  mode?: LhTimelineMode
  /** sx 快速布局属性 */
  sx?: SxProps
}

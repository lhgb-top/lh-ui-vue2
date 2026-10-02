import type { InjectionKey } from 'vue'
import type { Ref } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhCollapseKey } from '@lh-ui/share/core/collapse'

/** 父级向 Item 下发的上下文 */
export interface LhCollapseContext {
  activeKeys: Ref<LhCollapseKey[]>
  /** 红线 #6：provide computed ref 本体，禁止 props 快照 */
  accordion: Ref<boolean>
  toggle: (key: LhCollapseKey) => void
}

export const LH_COLLAPSE_CONTEXT_KEY: InjectionKey<LhCollapseContext> = Symbol('LhCollapseContext')

/** 折叠面板 props */
export interface LhCollapseProps {
  /** 当前激活的面板（受控 v-model: Omit 便于手风琴单值） */
  modelValue?: LhCollapseKey | LhCollapseKey[]
  /** 手风琴模式：同时只展开一个 */
  accordion?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

/** 面板项 props */
export interface LhCollapseItemProps {
  /** 面板唯一标识（必填） */
  name: LhCollapseKey
  /** 标题（也可用 title 插槽） */
  title?: string
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

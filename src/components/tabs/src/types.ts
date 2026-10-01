import type { InjectionKey, Ref } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhTabsPosition, LhTabsType } from '@lh-ui/share/core/tabs'

export interface LhTabsProps {
  /** 当前激活页签的 name（v-model） */
  modelValue?: string
  /** 外观 */
  type?: LhTabsType
  /** 页签是否可关闭 */
  closable?: boolean
  /** 是否显示新增按钮 */
  addable?: boolean
  /** 页签位置 */
  tabPosition?: LhTabsPosition
  /** sx 快速布局属性 */
  sx?: SxProps
}

export interface LhTabPaneProps {
  /** 页签唯一标识（作为稳定键，不建议动态修改） */
  name: string
  /** 页签标题 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
}

/** Tabs 父子组件上下文 */
export interface LhTabsContext {
  /** 当前激活页签名 */
  activeName: Ref<string | null>
  /** 激活指定页签 */
  setActive: (name: string) => void
  /** 关闭页签（emit tab-remove 并联动激活态） */
  removePane: (name: string) => void
  /** 是否可关闭 */
  closable: Ref<boolean>
  /** aria 关联 id 前缀 */
  idPrefix: string
}

export const LH_TABS_KEY: InjectionKey<LhTabsContext> = Symbol('LhTabs')

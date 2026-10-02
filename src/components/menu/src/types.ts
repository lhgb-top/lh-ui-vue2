import type { InjectionKey, Ref } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'
import type { LhMenuMode } from '@lh-ui/share/core/menu'

/** 父级向 Item / SubMenu / Group 下发的上下文 */
export interface LhMenuContext {
  mode: Ref<LhMenuMode>
  collapse: Ref<boolean>
  /** 当前激活项键（受控或内部兜底） */
  activeKey: Ref<string>
  /** 已展开的子菜单键 */
  openeds: Ref<string[]>
  /** 该 SubMenu 是否需要飞出面板（水平 或 折叠态） */
  isPopperMode: () => boolean
  /** 激活某项（内部 + 抛 update:modelValue + select） */
  handleSelect: (key: string, indexPath: string[]) => void
  /** 切换子菜单展开（处理 uniqueOpened + 抛 open/close） */
  handleToggleOpen: (key: string) => void
  /** 该子菜单是否展开 */
  isOpen: (key: string) => boolean
  /** 该键是否激活 */
  isActive: (key: string) => boolean
  /** 深度（顶层为 0，嵌套子菜单递增；用于飞出方向判定） */
  depth: () => number
}

export const LH_MENU_KEY: InjectionKey<LhMenuContext> = Symbol('LhMenuContext')

/** 菜单 props */
export interface LhMenuProps {
  /** 当前激活项（受控 v-model；未传时组件内部维护） */
  modelValue?: string
  /** 布局模式 */
  mode?: LhMenuMode
  /** 垂直模式折叠为图标条（子菜单改为飞出面板） */
  collapse?: boolean
  /** 默认展开的子菜单键（非受控） */
  defaultOpeneds?: string[]
  /** 受控展开的子菜单键 */
  openeds?: string[]
  /** 手风琴：同时只展开一个子菜单 */
  uniqueOpened?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

/** 叶子项 props */
export interface LhMenuItemProps {
  /** 唯一标识（必填） */
  index: string
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

/** 子菜单 props（可递归嵌套） */
export interface LhSubMenuProps {
  /** 唯一标识（必填） */
  index: string
  /** 标题（也可用 title 插槽） */
  title?: string
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: SxProps
}

/** 分组 props */
export interface LhMenuItemGroupProps {
  /** 分组标题（也可用 title 插槽） */
  title?: string
  /** sx 快速布局属性 */
  sx?: SxProps
}

import type { InjectionKey, Ref } from 'vue'
import type { LhDropdownPlacement, LhDropdownTrigger } from '@lh-ui/share/core/dropdown'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export type { LhDropdownPlacement, LhDropdownTrigger }

/**
 * Dropdown 组件 Props
 */
export interface LhDropdownProps {
  /** 触发方式 */
  trigger?: LhDropdownTrigger
  /** 展示位置 */
  placement?: LhDropdownPlacement
  /** 主轴方向空间不足时是否翻转方向（默认开启）；设 false 则严格按 placement 定位，允许溢出视口 */
  flip?: boolean
  /** 手动控制的显示状态（:visible.sync） */
  visible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 点击菜单项后是否自动关闭 */
  hideOnClick?: boolean
  /** 弹出层挂载目标（选择器或元素，默认 body；2.7 无 Teleport，host 移动实现） */
  teleportTarget?: string | HTMLElement
  /** 弹出层自定义类名 */
  popperClass?: string
  /** 菜单最大高度 */
  maxHeight?: string | number
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** 组件级背景花纹，覆盖 ConfigProvider 配置 */
  bgPattern?: string
  /** sx 快速布局属性（作用于触发器根元素） */
  sx?: LhSxProps
}

/**
 * DropdownItem 组件 Props
 */
export interface LhDropdownItemProps {
  /** 命令标识，点击时随 command 事件抛出 */
  command?: string | number
  /** 是否禁用（保留可聚焦性以进入无障碍树） */
  disabled?: boolean
  /** 是否显示分割线 */
  divided?: boolean
}

/** 注册给子项的菜单上下文 */
export interface LhDropdownContext {
  items: Ref<LhDropdownItemRecord[]>
  activeIndex: Ref<number>
  registerItem(item: LhDropdownItemRecord): void
  unregisterItem(item: LhDropdownItemRecord): void
  onItemClick(command: string | number | undefined): void
}

/** 运行期菜单项记录 */
export interface LhDropdownItemRecord {
  el: HTMLElement
  command?: string | number
  disabled?: boolean
  divided?: boolean
}

export const LH_DROPDOWN_KEY: InjectionKey<LhDropdownContext> = Symbol('LhDropdownKey')

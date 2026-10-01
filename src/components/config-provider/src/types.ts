import type { ComputedRef, InjectionKey } from 'vue'
import type { LhLocaleType, LhSizes } from '@lh-ui/share/types'

/**
 * 可配置主题的组件名称集合（终态对齐 plus；M1 移植组件时逐步消费）
 */
export type LhThemeableComponent =
  | 'button'
  | 'input'
  | 'dialog'
  | 'tooltip'
  | 'icon'
  | 'card'
  | 'alert'
  | 'popover'
  | 'popconfirm'
  | 'drawer'
  | 'dropdown'
  | 'message'
  | 'notification'
  | 'loading'
  | 'timeline'
  | 'collapse'
  | 'rate'
  | 'segmented'
  | 'calendar'
  | 'affix'
  | 'backtop'
  | 'image'
  | 'menu'
  | 'table'
  | 'layout'
  | 'tree'
  | 'transfer'
  | 'upload'
  | 'anchor'

/**
 * ConfigProvider 配置项
 */
export interface LhConfigProviderProps {
  /** 全局尺寸 */
  size?: LhSizes
  /** 全局语言 */
  locale?: LhLocaleType
  /** 全局主题变量（键可省略 --lh- 前缀，内部自动补齐） */
  themeVars?: Record<string, string>
  /** 启用背景花纹的组件白名单：只有白名单中的组件会应用全局 themeVars 中的 bg-pattern */
  patternComponents?: LhThemeableComponent[]
  /** 按组件单独配置主题变量（覆盖全局 themeVars；优先级见 useLhComponentTheme） */
  componentTheme?: Partial<Record<LhThemeableComponent, Record<string, string>>>
}

/**
 * ConfigProvider 通过 provide/inject 传递的配置上下文
 */
export interface LhConfigContext {
  size: LhSizes | undefined
  locale: LhLocaleType | undefined
  themeVars: Record<string, string> | undefined
  patternComponents?: LhThemeableComponent[]
  componentTheme?: Partial<Record<LhThemeableComponent, Record<string, string>>>
}

/**
 * ConfigProvider 注入 key
 * 注入的是 computed 引用而非快照对象，保证 provider props 变化能传导给 inject 方
 */
export const CONFIG_PROVIDER_KEY: InjectionKey<ComputedRef<LhConfigContext>> =
  Symbol('LhConfigProviderKey')

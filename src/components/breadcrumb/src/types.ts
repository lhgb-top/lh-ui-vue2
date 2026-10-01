import type { InjectionKey, Ref } from 'vue'
import type { SxProps } from '@lh-ui/share/core/shared/sx'

export interface LhBreadcrumbProps {
  /** 分隔符字符 */
  separator?: string
  /** 最大可见项数（首项 + 省略号 + 末尾若干项），超出折叠；0 或不传表示不折叠 */
  maxItems?: number
  /** sx 快速布局属性 */
  sx?: SxProps
}

export interface LhBreadcrumbItemProps {
  /** 跳转地址；存在且非末项时渲染为链接（检测到 vue-router 时走路由跳转，否则原生导航） */
  to?: string
  /** 使用 vue-router 跳转时是否以 replace 方式（无路由时无效果） */
  replace?: boolean
}

/** 面包屑父子组件上下文 */
export interface LhBreadcrumbContext {
  /** 已注册项的 token 列表（setup 顺序即渲染顺序） */
  itemTokens: Ref<symbol[]>
  /** 折叠时需要隐藏的项索引集合 */
  hiddenIndexes: Ref<number[]>
  /** 省略号应插在该索引的项之前（-1 表示不显示） */
  ellipsisBeforeIndex: Ref<number>
  /** 展开全部（清除折叠） */
  expand: () => void
  /** 分隔符字符 */
  separator: Ref<string>
}

export const LH_BREADCRUMB_KEY: InjectionKey<LhBreadcrumbContext> = Symbol('LhBreadcrumb')

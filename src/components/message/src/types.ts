import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhMessageRecord, LhMessageType } from '@lh-ui/share/core/message'

/** 服务选项：字符串内容 + 展示与回调 */
export interface LhMessageOptions {
  /** 消息内容 */
  content: string
  /** 语义类型，默认 info */
  type?: LhMessageType
  /** 自动关闭毫秒数，0 表示不自动关闭（loading 默认 0，其余默认 3000） */
  duration?: number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 距视口顶部偏移 px（默认 20） */
  offset?: number
  /** sx 快速布局属性 */
  sx?: LhSxProps
  /** 关闭（含自动关闭与手动关闭）后的回调 */
  onClose?: () => void
}

/** 服务句柄 */
export interface LhMessageHandle {
  close: () => void
}

/** 条目组件 props（服务内部渲染；也可声明式单用） */
export interface LhMessageProps {
  content: string
  type?: LhMessageType
  showClose?: boolean
  /** 关闭按钮的无障碍名称（未传时取语言包 message.close） */
  closeLabel?: string
  sx?: LhSxProps
}

/** 全局默认配置项（LhMessage.config） */
export interface LhMessageConfig {
  duration?: number
  max?: number
  offset?: number
  /** 挂载容器（默认 body） */
  appendTo?: string | HTMLElement
}

export type { LhMessageRecord, LhMessageType }

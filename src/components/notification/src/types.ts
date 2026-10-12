import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type {
  LhNotificationPosition,
  LhNotificationRecord,
  LhNotificationType,
} from '@lh-ui/share/core/notification'

/** 服务选项 */
export interface LhNotificationOptions {
  /** 标题 */
  title: string
  /** 正文内容 */
  content?: string
  /** 语义类型，默认 info */
  type?: LhNotificationType
  /** 自动关闭毫秒数，0 表示不自动关闭（默认 4500） */
  duration?: number
  /** 弹出位置（默认 top-right） */
  position?: LhNotificationPosition
  /** 是否显示关闭按钮（默认 true） */
  showClose?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
  /** 点击卡片回调（传入后卡片可聚焦、以 button 语义呈现） */
  onClick?: () => void
  /** 关闭（含自动与手动）后的回调 */
  onClose?: () => void
}

/** 服务句柄 */
export interface LhNotificationHandle {
  close: () => void
}

/** 全局默认配置项（LhNotification.config） */
export interface LhNotificationConfig {
  duration?: number
  offset?: number
  /** 挂载容器（默认 body） */
  appendTo?: string | HTMLElement
}

/** 条目组件 props（服务内部渲染；也可声明式单用） */
export interface LhNotificationProps {
  type?: LhNotificationType
  title: string
  content?: string
  showClose?: boolean
  /** 关闭按钮的无障碍名称（未传时取语言包 notification.close） */
  closeLabel?: string
  /** 传入后卡片可点击 */
  onClick?: () => void
  sx?: LhSxProps
}

export type { LhNotificationPosition, LhNotificationRecord, LhNotificationType }

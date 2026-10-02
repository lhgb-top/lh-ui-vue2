import type { VueConstructor } from 'vue'
import { mountToContainer } from '../../../imperative'
import LhNotificationHost from './host.vue'
import {
  closeAllNotifications,
  closeNotification,
  createNotificationRecord,
  notificationConfig,
  openNotificationRecord,
} from './store'
import type {
  LhNotificationConfig,
  LhNotificationHandle,
  LhNotificationOptions,
  LhNotificationType,
} from './types'

interface MountedHost {
  destroy: () => void
}

let host: MountedHost | null = null

function resolveContainer(): HTMLElement {
  const target = notificationConfig.appendTo
  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target) ?? document.body
  }
  return target
}

function ensureHost(): void {
  if (host) return
  host = mountToContainer(LhNotificationHost, {}, resolveContainer())
}

/** 打开一条通知，返回可手动关闭的句柄 */
export function openNotification(options: LhNotificationOptions): LhNotificationHandle {
  ensureHost()
  const record = createNotificationRecord(options)
  openNotificationRecord(record)
  return { close: () => closeNotification(record.id) }
}

function openTyped(type: LhNotificationType, options: LhNotificationOptions): LhNotificationHandle {
  return openNotification({ ...options, type })
}

/**
 * 通知服务：`LhNotification.success({ title, content })`。
 * 四角独立容器（region + aria-live=polite），堆叠走 flex + gap，不依赖组件树。
 */
export const LhNotification = Object.assign(openNotification, {
  success: (options: LhNotificationOptions) => openTyped('success', options),
  info: (options: LhNotificationOptions) => openTyped('info', options),
  warning: (options: LhNotificationOptions) => openTyped('warning', options),
  danger: (options: LhNotificationOptions) => openTyped('danger', options),
  close: closeNotification,
  closeAll: closeAllNotifications,
  /** 全局默认配置（duration / offset / appendTo） */
  config: (options: LhNotificationConfig) => Object.assign(notificationConfig, options),
})

Object.defineProperty(LhNotification, 'name', { value: 'LhNotification' })

;(LhNotification as unknown as { install?: (Vue: VueConstructor) => void }).install = (
  Vue: VueConstructor,
): void => {
  Vue.component('LhNotification', LhNotificationHost)
}

export default LhNotification

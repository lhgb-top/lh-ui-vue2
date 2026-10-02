import { reactive, ref } from 'vue'
import { LH_NOTIFICATION_DURATION_DEFAULT } from '@lh-ui/share/core/notification'
import type { LhNotificationPosition, LhNotificationRecord, LhNotificationType } from './types'

/**
 * 服务状态与队列（纯状态模块，不 import host）——
 * host.vue 与服务层都从这里取数据，避免「服务 → host → 服务」的循环依赖。
 */

/** 服务默认值（LhNotification.config 可覆盖） */
export const notificationConfig = reactive({
  duration: undefined as number | undefined,
  offset: 20,
  appendTo: 'body' as string | HTMLElement,
})

// 2.7 限制：reactive() 根值为数组时 computed/watch 无法追踪，队列用 ref 承载
/** 服务队列（host 直接消费的响应式数组，时间正序） */
export const notificationRecords = ref<LhNotificationRecord[]>([])

const timers = new Map<number, ReturnType<typeof setTimeout>>()
let seq = 0

export function nextNotificationId(): number {
  return ++seq
}

export function closeNotification(id: number): void {
  const index = notificationRecords.value.findIndex((record) => record.id === id)
  if (index === -1) return
  const [record] = notificationRecords.value.splice(index, 1)
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  record.onClose?.()
}

/** 入队 + 自动关闭计时器 */
export function openNotificationRecord(record: LhNotificationRecord): void {
  notificationRecords.value.push(record)
  if (record.duration > 0) {
    timers.set(record.id, setTimeout(() => closeNotification(record.id), record.duration))
  }
}

/** 关闭全部通知 */
export function closeAllNotifications(): void {
  for (const record of [...notificationRecords.value]) closeNotification(record.id)
}

/** 构造一条记录（选项归一） */
export function createNotificationRecord(options: {
  title: string
  content?: string
  type?: LhNotificationType
  duration?: number
  position?: LhNotificationPosition
  showClose?: boolean
  onClick?: () => void
  onClose?: () => void
}): LhNotificationRecord {
  return {
    id: nextNotificationId(),
    type: (options.type ?? 'info') as LhNotificationType,
    title: options.title,
    content: options.content ?? '',
    duration: options.duration ?? notificationConfig.duration ?? LH_NOTIFICATION_DURATION_DEFAULT,
    position: (options.position ?? 'top-right') as LhNotificationPosition,
    showClose: options.showClose !== false,
    onClick: options.onClick,
    onClose: options.onClose,
  }
}

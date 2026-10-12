import type { VueConstructor } from 'vue'
import { createMessageRecord } from '@lh-ui/share/core/message'
import type { LhMessageType } from '@lh-ui/share/core/message'
import { mountToContainer } from '../../../imperative'
import LhMessageHost from './host.vue'
import {
  closeAllMessages,
  closeMessage,
  messageConfig,
  nextMessageId,
  openRecord,
} from './store'
import type { LhMessageConfig, LhMessageHandle, LhMessageOptions } from './types'

interface LhMountedHost {
  destroy: () => void
}

let host: LhMountedHost | null = null

function resolveContainer(): HTMLElement {
  const target = messageConfig.appendTo
  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target) ?? document.body
  }
  return target
}

function ensureHost(): void {
  if (host) return
  host = mountToContainer(LhMessageHost, {}, resolveContainer())
}

/** 打开一条消息，返回可手动关闭的句柄 */
export function openMessage(options: LhMessageOptions | string): LhMessageHandle {
  const normalized: LhMessageOptions = typeof options === 'string' ? { content: options } : options
  ensureHost()
  const record = createMessageRecord(
    {
      type: (normalized.type ?? 'info') as LhMessageType,
      content: normalized.content,
      showClose: !!normalized.showClose,
      sx: normalized.sx,
      onClose: normalized.onClose,
      duration: normalized.duration ?? messageConfig.duration,
      offset: normalized.offset ?? messageConfig.offset,
    },
    nextMessageId(),
  )
  openRecord(record)
  return { close: () => closeMessage(record.id) }
}

function openTyped(
  type: LhMessageType,
  content: string,
  options?: Omit<LhMessageOptions, 'content'>,
): LhMessageHandle {
  return openMessage({ ...options, type, content })
}

/**
 * 全局轻提示服务：`LhMessage.success('已保存')` / `LhMessage({ content, ... })`。
 * 队列渲染在独立 Vue 实例容器（teleport 语义，默认挂到 body），不依赖组件树。
 */
export const LhMessage = Object.assign(openMessage, {
  success: (content: string, options?: Omit<LhMessageOptions, 'content'>) => openTyped('success', content, options),
  info: (content: string, options?: Omit<LhMessageOptions, 'content'>) => openTyped('info', content, options),
  warning: (content: string, options?: Omit<LhMessageOptions, 'content'>) => openTyped('warning', content, options),
  danger: (content: string, options?: Omit<LhMessageOptions, 'content'>) => openTyped('danger', content, options),
  loading: (content: string, options?: Omit<LhMessageOptions, 'content'>) => openTyped('loading', content, options),
  close: closeMessage,
  closeAll: closeAllMessages,
  /** 全局默认配置（duration / max / offset / appendTo） */
  config: (options: LhMessageConfig) => Object.assign(messageConfig, options),
})

Object.defineProperty(LhMessage, 'name', { value: 'LhMessage' })

;(LhMessage as unknown as { install?: (Vue: VueConstructor) => void }).install = (
  Vue: VueConstructor,
): void => {
  Vue.component('LhMessage', LhMessageHost)
}

export default LhMessage

import {
  isLoadingFullscreen,
  resolveLoadingTarget,
  ensurePositioned,
} from '@lh-ui/share/core/loading'
import type { LhLoadingOptions } from '@lh-ui/share/core/loading'
import { supportsInert } from '@lh-ui/share/core/shared/focus-trap'
import { useLhZIndex } from '../../../composables'
import { mountToContainer } from '../../../imperative'
import LhLoadingMask from './index.vue'
import type { LhLoadingHandle } from './types'

const { nextZIndex } = useLhZIndex()

let loadingSeq = 0

interface LhActiveLoading {
  destroy: () => void
  /** 遮罩根元素：close 时挂 --leaving 类触发退场动画 */
  el: HTMLElement
  target: HTMLElement
  lock: boolean
  previousOverflow: string
  restorePosition: () => void
  inertApplied: boolean
}

const activeInstances = new Map<number, LhActiveLoading>()

/**
 * 打开加载遮罩：全屏（不传 target）或指定容器。
 * 返回 close 句柄；lock 时锁目标滚动，inert 可用时让局部目标对交互不可达。
 */
export function showLoading(options: LhLoadingOptions = {}): LhLoadingHandle {
  const target = resolveLoadingTarget(options.target)
  const fullscreen = isLoadingFullscreen(target)
  const id = ++loadingSeq

  const restorePosition = fullscreen ? () => {} : ensurePositioned(target).restore

  const instance = mountToContainer(
    LhLoadingMask,
    {
      fullscreen,
      text: options.text,
      background: options.background,
      zIndex: nextZIndex(),
      spinner: options.spinner !== false,
      sx: options.sx,
    },
    target,
  )

  const previousOverflow = target.style.overflow
  const lock = !!options.lock
  if (lock) target.style.overflow = 'hidden'

  let inertApplied = false
  if (!fullscreen && supportsInert()) {
    target.setAttribute('inert', '')
    inertApplied = true
  }

  activeInstances.set(id, {
    destroy: instance.destroy,
    el: instance.el,
    target,
    lock,
    previousOverflow,
    restorePosition,
    inertApplied,
  })

  return {
    close: () => closeLoading(id),
  }
}

/** 退场动画时长（与 share 样式 lh-loading-fade-out 保持一致） */
const LH_LEAVE_DURATION = 200

export function closeLoading(id: number): void {
  const instance = activeInstances.get(id)
  if (!instance) return
  activeInstances.delete(id)
  // 先播退场动画再卸载（reduced-motion 下动画被禁用，延后卸载不产生视觉差异）
  instance.el.classList.add('lh-loading--leaving')
  window.setTimeout(() => {
    instance.destroy()
    if (instance.lock) instance.target.style.overflow = instance.previousOverflow
    instance.restorePosition()
    if (instance.inertApplied) instance.target.removeAttribute('inert')
  }, LH_LEAVE_DURATION)
}

/** 关闭该容器上的全部遮罩（指令卸载时兜底） */
export function closeLoadingOn(target: HTMLElement): void {
  for (const [id, instance] of [...activeInstances]) {
    if (instance.target === target) closeLoading(id)
  }
}

/**
 * 加载服务：`LhLoading.show({ target?, text?, background?, lock? })`，返回 `{ close }`。
 * 不传 target 即全屏遮罩；`Vue.use(LhLoading)` 注册 v-loading 指令。
 */
export const LhLoading = Object.assign(showLoading, {
  show: showLoading,
  close: closeLoading,
})

Object.defineProperty(LhLoading, 'name', { value: 'LhLoading' })

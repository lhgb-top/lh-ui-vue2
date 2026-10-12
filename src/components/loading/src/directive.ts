import type { DirectiveOptions, VNodeDirective } from 'vue'
import { showLoading } from './service'
import type { LhLoadingHandle, LhLoadingOptions } from './types'

interface LhLoadingElement extends HTMLElement {
  __lhLoading?: LhLoadingHandle
}

type LhLoadingBinding = VNodeDirective & {
  value?: boolean | string | LhLoadingOptions
}

/**
 * v-loading 指令：`v-loading="boolean"`，遮罩铺满最近的定位祖先（static 会自动补 relative）。
 * 支持值参数 `v-loading:text`（冒号修饰符，编译为 arg）传入提示文案。
 * 2.7 指令钩子：mounted/updated/unmounted → bind/componentUpdated/unbind。
 */
export const lhLoading: DirectiveOptions = {
  bind(el, binding: LhLoadingBinding) {
    if (!binding.value) return
    ;(el as LhLoadingElement).__lhLoading = showLoading(applyElement(el as LhLoadingElement, binding))
  },
  componentUpdated(el, binding: LhLoadingBinding) {
    const host = el as LhLoadingElement
    if (binding.value === binding.oldValue) return
    if (!binding.value) {
      if (host.__lhLoading) {
        host.__lhLoading.close()
        host.__lhLoading = undefined
      }
      return
    }
    // 对象形式 options 的文案/参数变更也要生效：状态未翻转时关闭重开
    // （句柄契约只有 close，指令场景无动画连续性诉求，成本可接受）
    if (host.__lhLoading && typeof binding.value === 'object') {
      host.__lhLoading.close()
      host.__lhLoading = undefined
    }
    if (!host.__lhLoading) {
      host.__lhLoading = showLoading(applyElement(host, binding))
    }
  },
  unbind(el) {
    const host = el as LhLoadingElement
    host.__lhLoading?.close()
    host.__lhLoading = undefined
  },
}

function applyElement(
  el: LhLoadingElement,
  binding: { arg?: string; value?: boolean | string | LhLoadingOptions },
): LhLoadingOptions {
  const options = typeof binding.value === 'object' && binding.value !== null ? binding.value : {}
  // 字符串值（v-loading="'加载中'"）与 text 修饰符都归一为文案
  const text =
    typeof binding.value === 'string'
      ? binding.value
      : binding.arg
        ? decodeURIComponent(binding.arg)
        : options.text
  return { target: el, ...options, text }
}

export default lhLoading

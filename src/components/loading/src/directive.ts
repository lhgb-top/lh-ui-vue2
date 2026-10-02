import type { DirectiveOptions, VNodeDirective } from 'vue'
import { showLoading } from './service'
import type { LhLoadingHandle, LhLoadingOptions } from './types'

interface LoadingElement extends HTMLElement {
  __lhLoading?: LhLoadingHandle
}

type LoadingBinding = VNodeDirective & {
  value?: boolean | string | LhLoadingOptions
}

/**
 * v-loading 指令：`v-loading="boolean"`，遮罩铺满最近的定位祖先（static 会自动补 relative）。
 * 支持值参数 `v-loading:text`（冒号修饰符，编译为 arg）传入提示文案。
 * 2.7 指令钩子：mounted/updated/unmounted → bind/componentUpdated/unbind。
 */
export const lhLoading: DirectiveOptions = {
  bind(el, binding: LoadingBinding) {
    if (!binding.value) return
    ;(el as LoadingElement).__lhLoading = showLoading(applyElement(el as LoadingElement, binding))
  },
  componentUpdated(el, binding: LoadingBinding) {
    const host = el as LoadingElement
    if (binding.value === binding.oldValue) return
    if (binding.value && !host.__lhLoading) {
      host.__lhLoading = showLoading(applyElement(host, binding))
    } else if (!binding.value && host.__lhLoading) {
      host.__lhLoading.close()
      host.__lhLoading = undefined
    }
  },
  unbind(el) {
    const host = el as LoadingElement
    host.__lhLoading?.close()
    host.__lhLoading = undefined
  },
}

function applyElement(
  el: LoadingElement,
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

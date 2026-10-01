/**
 * LhLocale 响应式适配层（Vue 2.7）
 *
 * share 的 LhLocale 是纯事件发射器（version 数字 + subscribe）；本层用 ref 包装恢复响应式：
 * 组件在 render 中调用 t()（内部读取 version.value 建立依赖）即可在语言切换时触发重渲染，
 * 消费惯用法与 plus 完全一致；ConfigProvider 的 locale prop watch 后调 setLocale。
 */
import { ref } from 'vue'
import { lhlocale } from '@lh-ui/share/locales'
import type { LhTranslate } from '@lh-ui/share/locales'
import type { LhLocaleType } from '@lh-ui/share/types'

/** 语言版本号：lhlocale 每次 use/setLocale/add 都会 bump */
const version = ref(lhlocale.version)

lhlocale.subscribe((v) => {
  version.value = v
})

/** 翻译函数：先建立响应式依赖（读 version），再透传给 share 单例 */
export const t: LhTranslate = (path, fallback) => {
  void version.value
  return lhlocale.t(path, fallback)
}

/** 切换全局语言（透传 share 单例） */
export function setLocale(locale: LhLocaleType): void {
  lhlocale.setLocale(locale)
}

export { lhlocale }
export { zhCN, enUS } from '@lh-ui/share/locales'
export type { LhLocaleMessages, LhLocaleType } from '@lh-ui/share/types'

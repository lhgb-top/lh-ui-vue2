import { computed, inject, provide, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { LhConfigContext, LhConfigProviderProps } from './types'
import { CONFIG_PROVIDER_KEY } from './types'
import { lhlocale } from '@lh-ui/share/locales'
import { cssVars as buildCssVars } from '@lh-ui/share/utils'

/**
 * ConfigProvider 核心逻辑
 * @param props 组件 props
 */
export function useLhConfigProvider(props: LhConfigProviderProps) {
  /** 将 themeVars 转为 CSS 变量对象（仅传递变量，不消费花纹背景） */
  const cssVars = computed(() => buildCssVars(props.themeVars ?? {}))

  /**
   * provide 的上下文。
   * 必须用 computed 包装：直接 reactive({ ...props }) 只会在 setup 时拍一次快照，
   * 之后父组件改 prop 不会传导给 inject 方（plus 已实测复现，2.7 同款约束）。
   */
  const configContext = computed<LhConfigContext>(() => ({
    size: props.size,
    locale: props.locale,
    themeVars: props.themeVars,
    patternComponents: props.patternComponents,
    componentTheme: props.componentTheme,
  }))

  // 注入 provide（键类型为 ComputedRef<LhConfigContext>，见 types.ts）
  provide(CONFIG_PROVIDER_KEY, configContext)

  // locale 变化时同步更新全局 locale（含首次）
  watch(
    () => props.locale,
    (locale) => {
      if (locale) {
        lhlocale.setLocale(locale)
      }
    },
    { immediate: true },
  )

  return {
    configContext,
    cssVars,
  }
}

/**
 * 子组件中注入 ConfigProvider 配置
 * @returns 配置上下文的 ComputedRef，如果未找到 provider 则返回 null。
 *   消费方读取 .value 时建立响应式依赖，provider props 变化会自动传导。
 */
export type LhConfigContextRef = ComputedRef<LhConfigContext> | null

export function useLhConfigContext(): LhConfigContextRef | null {
  return inject(CONFIG_PROVIDER_KEY, null)
}

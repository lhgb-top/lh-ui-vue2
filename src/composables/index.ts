/**
 * lh-ui-vue2 共享 composables（Vue 2.7 响应式胶水）
 *
 * 职责边界：纯逻辑在 @lh-ui/share/core（唯一源，本库不复制）；本文件只做响应式接线——
 * computed/inject/ref 包装。弹层基建（useLhPopper/FocusTrap/Trigger/ClickOutside/ScrollEnd）
 * 随 M1 弹层组件（dialog/tooltip 等）接入。
 *
 * 注意：useLhConfigContext 位于 config-provider 组件内（plus 平价），本文件通过
 * configContext 参数消费注入上下文，避免 composables 反向依赖组件目录。
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { createNamespace, stripCssVarName, toCssVarName } from '@lh-ui/share/utils'
import { LH_THEME_PRESETS, getThemeVars } from '@lh-ui/share/theme'
import type { LhThemePresetName } from '@lh-ui/share/theme'
import { LH_GRID_BREAKPOINTS, resolveBreakpoint } from '@lh-ui/share/core/grid'
import type { LhGridBreakpoint } from '@lh-ui/share/core/grid'
import type { LhSizes } from '@lh-ui/share/types'
import type { LhConfigContextRef } from '../components/config-provider/src'
import type { LhThemeableComponent } from '../components/config-provider/src/types'

/**
 * useLhSize - 尺寸逻辑计算
 * 从 props 和 ConfigProvider 注入中获取有效尺寸
 */
export function useLhSize(
  props: { size?: string },
  configSize?: Ref<LhSizes | undefined> | ComputedRef<LhSizes | undefined>,
  defaultSize: string = 'medium',
) {
  const effectiveSize = computed(() => {
    return props.size || configSize?.value || defaultSize
  })

  return { effectiveSize }
}

/**
 * useLhDisabled - 禁用状态逻辑
 */
export function useLhDisabled(props: { disabled?: boolean; loading?: boolean }) {
  const isDisabled = computed(() => {
    return props.disabled === true || props.loading === true
  })

  return { isDisabled }
}

/**
 * useLhNamespace - BEM 命名空间（share 纯函数 createNamespace 的薄包装）
 */
export function useLhNamespace(block: string) {
  return createNamespace(block)
}

/** useLhVModel 入参 */
export interface UseLhVModelOptions {
  /** model 选项的 prop 名，默认 'value'（Vue2 默认 model） */
  prop?: string
  /** model 选项的事件名，默认 'input'；配合 .sync 的组件传 'update:xxx' */
  event?: string
}

/**
 * useLhVModel - Vue2 语义的双向绑定（§6.2 重写版）
 *
 * computed get 读 model prop，set 时 emit(model.event)；自定义模型由组件的
 * model 选项参数化。与 plus 的本地 ref + watch 版不同：Vue2 下可写 computed
 * 直接指向 model prop，避免「prop 改了本地 ref 没跟上」的同步负担。
 */
export function useLhVModel<T, P extends object = Record<string, unknown>>(
  props: P,
  emit: (event: string, value: T) => void,
  options: UseLhVModelOptions = {},
): WritableComputedRef<T> {
  const prop = options.prop ?? 'value'
  const event = options.event ?? 'input'
  // 调用方传入的是组件 Props 对象（无索引签名），此处收窄为键值读取
  const modelProps = props as Record<string, unknown>

  return computed<T>({
    get: () => modelProps[prop] as T,
    set: (value) => {
      emit(event, value)
    },
  })
}

/**
 * useLhZIndex - 递增的 z-index 管理
 */
let _zIndexCounter = 2000
export function useLhZIndex() {
  const zIndex = ref(++_zIndexCounter)

  function nextZIndex() {
    return ++_zIndexCounter
  }

  return { zIndex, nextZIndex }
}

/**
 * useLhOverlayStack - 弹层打开顺序栈
 *
 * 模块级栈记录当前打开的弹层（dialog / drawer 等）：多弹层叠加时 Esc 只关栈顶，
 * 避免一次按键把底下所有弹层一起带走。每个实例 open 时 register、关闭时 unregister，
 * 组件卸载时自动出栈兜底。与 useLhZIndex 的递增体系配套（plus 同构）。
 */
const _overlayStack: symbol[] = []
export function useLhOverlayStack() {
  const id = Symbol('lh-overlay')

  function register() {
    _overlayStack.push(id)
  }

  function unregister() {
    const index = _overlayStack.lastIndexOf(id)
    if (index >= 0) _overlayStack.splice(index, 1)
  }

  /** 本实例是否处于栈顶（只有栈顶响应 Esc） */
  function isTopmost() {
    return _overlayStack[_overlayStack.length - 1] === id
  }

  onBeforeUnmount(unregister)

  return { register, unregister, isTopmost }
}

/**
 * useLhBreakpoint - 全局共享的响应式断点
 *
 * 模块级单例：所有消费方订阅同一份断点状态与同一个 matchMedia 监听，视口跨档时全站联动。
 * 阈值取 share core/grid 的 LH_GRID_BREAKPOINTS（Tailwind 风格）。
 * SSR / 无 matchMedia 环境安全降级为 xs。
 */
let _breakpointRef: Ref<LhGridBreakpoint> | null = null

function initBreakpoint(): Ref<LhGridBreakpoint> {
  const bp = ref<LhGridBreakpoint>('xs')
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return bp

  const recompute = () => {
    bp.value = resolveBreakpoint(window.innerWidth)
  }
  recompute()

  // 每个断点阈值各挂一个 matchMedia（跨档与直接缩放都可靠），回调里统一重算。
  // 单例与页面同生命周期，监听器无需逐个摘除
  for (const key of Object.keys(LH_GRID_BREAKPOINTS) as LhGridBreakpoint[]) {
    const threshold = LH_GRID_BREAKPOINTS[key]
    if (threshold <= 0) continue
    const mql = window.matchMedia(`(min-width: ${threshold}px)`)
    const handler = () => recompute()
    if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler)
    else mql.addListener(handler)
  }

  return bp
}

export function useLhBreakpoint() {
  if (!_breakpointRef) _breakpointRef = initBreakpoint()
  return { breakpoint: _breakpointRef }
}

/**
 * useLhComponentTheme - 组件主题层级覆盖
 *
 * 优先级：组件自身 props > ConfigProvider componentTheme[组件名] > ConfigProvider 全局 themeVars
 * patternComponents 白名单控制全局 themeVars 中的 bg-pattern 是否生效
 */
export function useLhComponentTheme(
  componentName: LhThemeableComponent,
  props: { themeVars?: Record<string, string>; bgPattern?: string },
  configContext: LhConfigContextRef,
) {
  const componentStyle = computed(() => {
    const result: Record<string, string> = {}
    // ConfigProvider 注入的是 computed 引用，读取 .value 建立响应式依赖
    const ctx = configContext?.value

    // 检查组件是否在 patternComponents 白名单中
    const isPatternAllowed =
      !ctx?.patternComponents || ctx.patternComponents.includes(componentName)

    // 1. 全局 themeVars（仅 bg-pattern 受白名单控制）
    if (ctx?.themeVars) {
      for (const [key, value] of Object.entries(ctx.themeVars)) {
        if (key === 'bg-pattern' && !isPatternAllowed) continue
        result[toCssVarName(key)] = value
      }
    }

    // 2. componentTheme[组件名]（覆盖全局，仅 bg-pattern 受白名单控制）
    const componentTheme = ctx?.componentTheme?.[componentName]
    if (componentTheme) {
      for (const [key, value] of Object.entries(componentTheme)) {
        if (key === 'bg-pattern' && !isPatternAllowed) continue
        result[toCssVarName(key)] = value
      }
    }

    // 3. 组件自身 themeVars（最高优先级，不受白名单限制）
    if (props.themeVars) {
      for (const [key, value] of Object.entries(props.themeVars)) {
        result[toCssVarName(key)] = value
      }
    }

    // 4. 组件自身 bgPattern（最高优先级，不受白名单限制）
    if (props.bgPattern) {
      result['--lh-bg-pattern'] = props.bgPattern
    }

    return result
  })

  return { componentStyle }
}

/** LhThemeType - 主题类型 */
export type LhThemeType = 'light' | 'dark'

/**
 * useLhTheme - 运行时明暗主题切换
 *
 * 通过 document.documentElement 的 data-theme 属性与 class 切换明暗主题，持久化到 localStorage。
 */
export function useLhTheme(options?: { initialTheme?: LhThemeType; storageKey?: string }) {
  const storageKey = options?.storageKey ?? 'lh-ui-theme'

  const initTheme = (): LhThemeType => {
    if (options?.initialTheme) return options.initialTheme
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'dark' || stored === 'light') return stored
    } catch {
      /* SSR 等环境可能无 localStorage */
    }
    return 'light'
  }

  const theme = ref<LhThemeType>(initTheme())

  const applyTheme = (t: LhThemeType) => {
    const root = document.documentElement
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    } else {
      root.removeAttribute('data-theme')
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(storageKey, t)
    } catch {
      /* SSR 等环境可能无 localStorage */
    }
  }

  // 初始化时应用主题
  applyTheme(theme.value)

  /** 设置主题 */
  const setTheme = (t: LhThemeType) => {
    theme.value = t
    applyTheme(t)
  }

  /** 切换明暗主题 */
  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}

/**
 * useLhPresetTheme - 预设主题切换
 *
 * 与 useLhTheme（明暗模式）互补：本 composable 把预设色板变量写到 :root，换的是 --lh-* 配色。
 * 返回的 themeVars 已按 ConfigProvider 约定去掉 --lh- 前缀，可传给 LhConfigProvider 局部生效。
 */
export function useLhPresetTheme(options?: {
  initialPreset?: LhThemePresetName
  storageKey?: string
  /** 是否把变量写到 :root，默认 true。设为 false 只取 themeVars 自己接管应用 */
  applyToRoot?: boolean
}) {
  const storageKey = options?.storageKey ?? 'lh-ui-preset'
  const applyToRoot = options?.applyToRoot ?? true

  const initPreset = (): LhThemePresetName => {
    if (options?.initialPreset) return options.initialPreset
    try {
      const stored = localStorage.getItem(storageKey)
      const matched = stored ? LH_THEME_PRESETS.find((p) => p.name === stored) : undefined
      if (matched) return matched.name
    } catch {
      /* SSR 等环境可能无 localStorage */
    }
    return LH_THEME_PRESETS[0].name
  }

  const preset = ref<LhThemePresetName>(initPreset())

  const applyPreset = (name: LhThemePresetName) => {
    const vars = getThemeVars(name)
    if (!vars) return
    // applyToRoot: false 时不写 :root 也不持久化——该模式只负责产出 themeVars，
    // 作用域与持久化都应由调用方自己接管，避免污染全局 key
    if (!applyToRoot) return
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value)
      }
    }
    try {
      localStorage.setItem(storageKey, name)
    } catch {
      /* SSR 等环境可能无 localStorage */
    }
  }

  // 初始化时应用预设
  applyPreset(preset.value)

  /** 设置预设主题 */
  const setPreset = (name: LhThemePresetName) => {
    preset.value = name
    applyPreset(name)
  }

  /** ConfigProvider 兼容的 themeVars（键已去掉 --lh- 前缀） */
  const themeVars = computed(() => {
    const vars = getThemeVars(preset.value) ?? {}
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(vars)) {
      result[stripCssVarName(key)] = value
    }
    return result
  })

  return { preset, setPreset, presets: LH_THEME_PRESETS, themeVars }
}

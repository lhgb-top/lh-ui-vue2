import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { LhSizes } from '@lh-ui/share/types'
import type { LhConfigContext } from '../../src/components/config-provider/src/types'
import {
  useLhBreakpoint,
  useLhComponentTheme,
  useLhDisabled,
  useLhNamespace,
  useLhSize,
  useLhVModel,
  useLhZIndex,
} from '../../src/composables'

describe('useLhSize', () => {
  it('props.size 优先于注入上下文与默认值', () => {
    const configSize = ref<LhSizes | undefined>('small') as Ref<LhSizes | undefined>
    const { effectiveSize } = useLhSize({ size: 'large' }, configSize)
    expect(effectiveSize.value).toBe('large')
  })

  it('无 props.size 时取注入上下文，再退默认值', () => {
    const configSize = ref<LhSizes | undefined>('small') as Ref<LhSizes | undefined>
    expect(useLhSize({}, configSize).effectiveSize.value).toBe('small')
    expect(useLhSize({}).effectiveSize.value).toBe('medium')
  })
})

describe('useLhDisabled', () => {
  it('disabled 或 loading 任一为 true 即禁用', () => {
    expect(useLhDisabled({ disabled: true }).isDisabled.value).toBe(true)
    expect(useLhDisabled({ loading: true }).isDisabled.value).toBe(true)
    expect(useLhDisabled({}).isDisabled.value).toBe(false)
  })
})

describe('useLhNamespace（share 纯函数薄包装）', () => {
  it('b/e/m/em/is 产出 BEM 类名', () => {
    const ns = useLhNamespace('button')
    expect(ns.b()).toBe('lh-button')
    expect(ns.e('text')).toBe('lh-button__text')
    expect(ns.m('primary')).toBe('lh-button--primary')
    expect(ns.em('text', 'bold')).toBe('lh-button__text--bold')
    expect(ns.is('disabled', true)).toBe('is-disabled')
    expect(ns.is('disabled', false)).toBe('')
  })
})

describe('useLhVModel（Vue2 语义）', () => {
  it('默认 model：value prop + input 事件', () => {
    const calls: Array<[string, string]> = []
    const emit = (event: string, value: string) => calls.push([event, value])
    const model = useLhVModel<string>({ value: 'a' }, emit)

    expect(model.value).toBe('a')
    model.value = 'b'
    expect(calls).toEqual([['input', 'b']])
  })

  it('自定义 model：visible prop + update:visible 事件（.sync 形态）', () => {
    const calls: Array<[string, boolean]> = []
    const emit = (event: string, value: boolean) => calls.push([event, value])
    const model = useLhVModel<boolean>(
      { visible: true },
      emit,
      { prop: 'visible', event: 'update:visible' },
    )

    expect(model.value).toBe(true)
    model.value = false
    expect(calls).toEqual([['update:visible', false]])
  })
})

describe('useLhZIndex', () => {
  it('初始值递增且 nextZIndex 继续自增', () => {
    const first = useLhZIndex()
    const second = useLhZIndex()
    expect((second.zIndex.value as number) > (first.zIndex.value as number)).toBe(true)
    expect(second.nextZIndex()).toBeGreaterThan(second.zIndex.value as number)
  })
})

describe('useLhBreakpoint', () => {
  it('无 matchMedia（jsdom 无实现时）安全降级，且为模块级单例', () => {
    const a = useLhBreakpoint()
    const b = useLhBreakpoint()
    expect(a.breakpoint).toBe(b.breakpoint)
    expect(typeof a.breakpoint.value).toBe('string')
  })
})

describe('useLhComponentTheme', () => {
  it('三级优先级：props > componentTheme > 全局 themeVars', () => {
    const configContext = computed<LhConfigContext>(() => ({
      size: undefined,
      locale: undefined,
      themeVars: { 'primary-color': '#111111' },
      componentTheme: { button: { 'border-color': '#222222' } },
    }))
    const { componentStyle } = useLhComponentTheme(
      'button',
      { themeVars: { 'text-color': '#333333' } },
      configContext,
    )

    expect(componentStyle.value).toEqual({
      '--lh-primary-color': '#111111',
      '--lh-border-color': '#222222',
      '--lh-text-color': '#333333',
    })
  })

  it('bg-pattern 受 patternComponents 白名单控制，组件自身 bgPattern 不受限', () => {
    const configContext = computed<LhConfigContext>(() => ({
      size: undefined,
      locale: undefined,
      themeVars: { 'bg-pattern': 'url(x)' },
      patternComponents: ['button'],
    }))
    // input 不在白名单：全局 bg-pattern 被剔除
    const inputStyle = useLhComponentTheme('input', {}, configContext).componentStyle.value
    expect(inputStyle['--lh-bg-pattern']).toBeUndefined()

    // button 在白名单：全局生效；组件自身 bgPattern 最高优先级
    const buttonStyle = useLhComponentTheme(
      'button',
      { bgPattern: 'url(y)' },
      configContext,
    ).componentStyle.value
    expect(buttonStyle['--lh-bg-pattern']).toBe('url(y)')
  })
})

import { beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { LhRow, LhCol } from '../../src/components/grid'

// 断点单例的 matchMedia 监听器（stub 捕获，测试里手动触发跨档）
const mqlHandlers: (() => void)[] = []

beforeAll(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false,
    addEventListener: (_type: string, fn: () => void) => mqlHandlers.push(fn),
    addListener: (fn: () => void) => mqlHandlers.push(fn),
    removeEventListener: () => {},
    removeListener: () => {},
  })))
})

function setViewport(width: number): void {
  vi.stubGlobal('innerWidth', width)
  mqlHandlers.forEach((fn) => fn())
}

describe('LhGrid Component', () => {
  it('renders a 24-column grid row', () => {
    const wrapper = mount(LhRow, { propsData: { gutter: 12 }, slots: { default: 'x' } })
    expect(wrapper.classes()).toContain('lh-row')
    // grid-template-columns 由 SCSS 提供；内联样式承载 gutter 的负外边距
    expect(wrapper.attributes('style')).toContain('margin-inline')
  })

  it('sizes a col with span and offset', () => {
    const wrapper = mount(LhCol, { propsData: { span: 8, offset: 4 } })
    expect(wrapper.classes()).toContain('lh-col--8')
    expect(wrapper.classes()).toContain('lh-col--offset-4')
    expect(wrapper.attributes('style')).toContain('grid-column')
  })

  it('applies justify / align classes', () => {
    const wrapper = mount(LhRow, { propsData: { justify: 'center', align: 'middle' } })
    expect(wrapper.classes()).toContain('lh-row--center')
    expect(wrapper.classes()).toContain('lh-row--middle')
  })

  it('switches sizes responsively across breakpoints', async () => {
    setViewport(1280)
    const wrapper = mount(LhCol, {
      propsData: { span: 24, md: 12, lg: 8 },
    })
    // lg（1280）命中 lg: 8
    expect(wrapper.attributes('style')).toContain('span 8')
    setViewport(900)
    await nextTick()
    // md（900）回退到 md: 12
    expect(wrapper.attributes('style')).toContain('span 12')
    setViewport(500)
    await nextTick()
    // xs 回退到基础 span 24
    expect(wrapper.attributes('style')).toContain('span 24')
    wrapper.destroy()
    setViewport(1024)
  })

  it('accepts object sizes in breakpoint props', () => {
    setViewport(700)
    const wrapper = mount(LhCol, {
      propsData: { sm: { span: 6, offset: 2 } },
    })
    expect(wrapper.attributes('style')).toContain('grid-column: 3 / span 6')
    wrapper.destroy()
    setViewport(1024)
  })
})

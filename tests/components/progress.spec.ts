import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhProgress from '../../src/components/progress'

describe('LhProgress', () => {
  it('renders line progress with base class', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 50 } })
    expect(wrapper.classes()).toContain('lh-progress')
    expect(wrapper.classes()).toContain('lh-progress--line')
  })

  it('renders inner bar width as percentage', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 66 } })
    const inner = wrapper.find('.lh-progress__bar-inner')
    expect(inner.attributes('style')).toContain('width: 66%')
  })

  it('clamps out-of-range percentage', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 150 } })
    expect(wrapper.find('.lh-progress__bar-inner').attributes('style')).toContain('width: 100%')
  })

  it('shows default percent text', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 42 } })
    expect(wrapper.find('.lh-progress__text').text()).toBe('42%')
  })

  it('hides text when showText is false', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 42, showText: false } })
    expect(wrapper.find('.lh-progress__text').exists()).toBe(false)
    expect(wrapper.classes()).toContain('lh-progress--no-text')
  })

  it('marks success when percentage reaches 100', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 100 } })
    expect(wrapper.classes()).toContain('lh-progress--success')
  })

  it('applies exception status class', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 30, status: 'exception' } })
    expect(wrapper.classes()).toContain('lh-progress--exception')
  })

  it('renders circle type with svg', () => {
    const wrapper = mount(LhProgress, {
      propsData: { percentage: 60, type: 'circle' },
    })
    expect(wrapper.classes()).toContain('lh-progress--circle')
    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(2)
    expect(wrapper.find('.lh-progress__circle-text').text()).toBe('60%')
  })

  it('uses custom color when provided', () => {
    const wrapper = mount(LhProgress, {
      propsData: { percentage: 40, color: '#ff0000' },
    })
    // jsdom 会把 #ff0000 归一化为 rgb(255, 0, 0)
    expect(wrapper.find('.lh-progress__bar-inner').attributes('style')).toContain(
      'background-color: rgb(255, 0, 0)',
    )
  })

  it('formats text via format prop', () => {
    const wrapper = mount(LhProgress, {
      propsData: { percentage: 42, format: (p: number) => `${p} 分` },
    })
    expect(wrapper.find('.lh-progress__text').text()).toBe('42 分')
  })

  it('exposes progressbar semantics with aria value attributes', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 42 } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
    expect(wrapper.attributes('aria-valuenow')).toBe('42')
    // 自定义 format 之外，默认文案也进入 aria-valuetext 供屏读播报
    expect(wrapper.attributes('aria-valuetext')).toBe('42%')
  })

  it('clamps aria-valuenow to the valid range', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 150 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('100')
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhProgress, { propsData: { percentage: 50, sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})

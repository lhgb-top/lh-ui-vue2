import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhBadge from '../../src/components/badge'

describe('LhBadge', () => {
  it('should render correctly', () => {
    const wrapper = mount(LhBadge, {
      slots: { default: 'Message' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should apply type class', () => {
    const wrapper = mount(LhBadge, {
      propsData: { type: 'primary' },
    })
    expect(wrapper.classes()).toContain('lh-badge--primary')
  })

  it('should apply size class', () => {
    const wrapper = mount(LhBadge, {
      propsData: { size: 'small' },
    })
    expect(wrapper.classes()).toContain('lh-badge--small')
  })

  it('should show value', () => {
    const wrapper = mount(LhBadge, {
      propsData: { value: 5 },
    })
    expect(wrapper.text()).toContain('5')
  })

  it('should cap value at max', () => {
    const wrapper = mount(LhBadge, {
      propsData: { value: 100, max: 99 },
    })
    expect(wrapper.text()).toContain('99+')
  })

  it('should apply dot class', () => {
    const wrapper = mount(LhBadge, {
      propsData: { isDot: true },
    })
    expect(wrapper.classes()).toContain('lh-badge--dot')
  })

  it('should hide when hidden prop is true', () => {
    const wrapper = mount(LhBadge, {
      propsData: { value: 5, hidden: true },
    })
    expect(wrapper.find('sup').exists()).toBe(false)
  })

  it('should not show when value is empty', () => {
    const wrapper = mount(LhBadge, {
      propsData: { value: '' },
    })
    expect(wrapper.find('sup').exists()).toBe(false)
  })

  it('should show zero when showZero is true', () => {
    const wrapper = mount(LhBadge, {
      propsData: { value: 0, showZero: true },
    })
    expect(wrapper.find('sup').exists()).toBe(true)
  })

  it('should not show zero by default', () => {
    const wrapper = mount(LhBadge, {
      propsData: { value: 0 },
    })
    expect(wrapper.find('sup').exists()).toBe(false)
  })

  it('should mark the dot as decorative but keep value counts readable', () => {
    const dot = mount(LhBadge, { propsData: { isDot: true } })
    expect(dot.find('sup').attributes('aria-hidden')).toBe('true')

    const counted = mount(LhBadge, { propsData: { value: 5 } })
    expect(counted.find('sup').attributes('aria-hidden')).toBe('false')
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhBadge, { propsData: { value: 5, sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})

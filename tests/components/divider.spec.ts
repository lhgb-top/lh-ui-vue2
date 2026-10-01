import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhDivider from '../../src/components/divider'

describe('LhDivider', () => {
  it('renders default horizontal divider as decorative', () => {
    const wrapper = mount(LhDivider)
    expect(wrapper.classes()).toContain('lh-divider')
    expect(wrapper.classes()).toContain('lh-divider--horizontal')
    expect(wrapper.attributes('role')).toBe('presentation')
  })

  it('renders vertical divider', () => {
    const wrapper = mount(LhDivider, { propsData: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('lh-divider--vertical')
  })

  it('applies dashed class', () => {
    const wrapper = mount(LhDivider, { propsData: { dashed: true } })
    expect(wrapper.classes()).toContain('lh-divider--dashed')
  })

  it('exposes labelled content as a separator with aria orientation rules', () => {
    const wrapper = mount(LhDivider, {
      propsData: { labelPosition: 'left' },
      slots: { default: '章节标题' },
    })
    expect(wrapper.classes()).toContain('lh-divider--with-text')
    expect(wrapper.classes()).toContain('lh-divider--label-left')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.find('.lh-divider__label').text()).toBe('章节标题')
  })

  it('vertical dividers never expose label content', () => {
    const wrapper = mount(LhDivider, {
      propsData: { direction: 'vertical' },
      slots: { default: '不应渲染' },
    })
    expect(wrapper.classes()).not.toContain('lh-divider--with-text')
    expect(wrapper.find('.lh-divider__label').exists()).toBe(false)
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhDivider, { propsData: { sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})

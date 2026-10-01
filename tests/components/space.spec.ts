import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhSpace from '../../src/components/space'

describe('LhSpace', () => {
  it('renders children in a flex container', () => {
    const wrapper = mount(LhSpace, {
      slots: { default: '<button>一</button><button>二</button>' },
    })
    expect(wrapper.classes()).toContain('lh-space')
    expect(wrapper.classes()).toContain('lh-space--horizontal')
    expect(wrapper.findAll('button')).toHaveLength(2)
    expect(wrapper.attributes('role')).toBe('presentation')
  })

  it('switches to vertical direction', () => {
    const wrapper = mount(LhSpace, { propsData: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('lh-space--vertical')
    expect(wrapper.classes()).not.toContain('lh-space--horizontal')
  })

  it('applies preset size as spacing token', () => {
    const wrapper = mount(LhSpace, { propsData: { size: 'large' } })
    expect(wrapper.classes()).toContain('lh-space--large')
    expect(wrapper.attributes('style')).toContain('var(--lh-spacing-large')
  })

  it('applies numeric size as pixels', () => {
    const wrapper = mount(LhSpace, { propsData: { size: 8 } })
    expect(wrapper.attributes('style')).toContain('column-gap: 8px')
    expect(wrapper.attributes('style')).toContain('row-gap: 8px')
  })

  it('supports independent horizontal and vertical gaps', () => {
    const wrapper = mount(LhSpace, { propsData: { size: [4, 12] } })
    expect(wrapper.attributes('style')).toContain('column-gap: 4px')
    expect(wrapper.attributes('style')).toContain('row-gap: 12px')
  })

  it('adds wrap class when enabled', () => {
    const wrapper = mount(LhSpace, { propsData: { wrap: true } })
    expect(wrapper.classes()).toContain('lh-space--wrap')
  })

  it('passes alignment through as align-items', () => {
    const wrapper = mount(LhSpace, { propsData: { alignment: 'center' } })
    expect(wrapper.attributes('style')).toContain('align-items: center')
  })

  it('applies sx props merged after the gap styles', () => {
    const wrapper = mount(LhSpace, {
      propsData: { size: 8, sx: { mt: 2, alignItems: 'flex-end' } },
    })
    const style = wrapper.attributes('style')
    expect(style).toContain('column-gap: 8px')
    expect(style).toContain('margin-top: 16px')
    // sx 展开在末尾，可覆盖 alignment
    expect(style).toContain('align-items: flex-end')
  })
})

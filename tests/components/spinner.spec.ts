import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LhSpinner from '../../src/components/spinner'

describe('LhSpinner Component', () => {
  it('renders the rotating svg with the default size', () => {
    const wrapper = mount(LhSpinner)
    expect(wrapper.classes()).toContain('lh-spinner--medium')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies size and color props', () => {
    const wrapper = mount(LhSpinner, { propsData: { size: 'large', color: '#333' } })
    expect(wrapper.classes()).toContain('lh-spinner--large')
    // jsdom 会把十六进制颜色归一成 rgb()
    expect(wrapper.attributes('style')).toContain('rgb(51, 51, 51)')
    expect(wrapper.attributes('style')).toContain('width: 32px')
  })
})

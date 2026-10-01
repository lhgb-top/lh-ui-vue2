import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhEmpty from '../../src/components/empty'

describe('LhEmpty', () => {
  it('renders the locale description by default', () => {
    const wrapper = mount(LhEmpty)
    expect(wrapper.classes()).toContain('lh-empty')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.find('.lh-empty__description').text()).toBe('暂无数据')
  })

  it('a custom description takes priority over the locale fallback', () => {
    const wrapper = mount(LhEmpty, { propsData: { description: '没有更多了' } })
    expect(wrapper.find('.lh-empty__description').text()).toBe('没有更多了')
  })

  it('description slot wins over the prop', () => {
    const wrapper = mount(LhEmpty, {
      propsData: { description: '被覆盖' },
      slots: { description: '<b>插槽描述</b>' },
    })
    expect(wrapper.find('.lh-empty__description').text()).toBe('插槽描述')
  })

  it('renders the default illustration when no image is given', () => {
    const wrapper = mount(LhEmpty)
    expect(wrapper.find('.lh-empty__illustration').exists()).toBe(true)
  })

  it('renders a custom image instead of the illustration', () => {
    const wrapper = mount(LhEmpty, { propsData: { image: '/empty.png' } })
    expect(wrapper.classes()).toContain('lh-empty--custom-image')
    expect(wrapper.find('.lh-empty__illustration').exists()).toBe(false)
    expect(wrapper.find('img').attributes('src')).toBe('/empty.png')
    // 装饰性图片对屏幕阅读器隐藏（alt 为空）
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })

  it('renders actions slot below the description', () => {
    const wrapper = mount(LhEmpty, {
      slots: { actions: '<button>重试</button>' },
    })
    expect(wrapper.find('.lh-empty__actions button').text()).toBe('重试')
  })
})

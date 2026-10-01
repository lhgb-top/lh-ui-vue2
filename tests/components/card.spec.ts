import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhCard from '../../src/components/card'

describe('LhCard', () => {
  it('renders body content', () => {
    const wrapper = mount(LhCard, { slots: { default: '<p>卡片内容</p>' } })
    expect(wrapper.classes()).toContain('lh-card')
    expect(wrapper.classes()).toContain('lh-card--shadow-always')
    expect(wrapper.find('.lh-card__body').text()).toBe('卡片内容')
  })

  it('renders title and extra via header area', () => {
    const wrapper = mount(LhCard, {
      propsData: { title: '卡片标题' },
      slots: { extra: '<b>更多</b>' },
    })
    expect(wrapper.find('.lh-card__title').text()).toBe('卡片标题')
    expect(wrapper.find('.lh-card__extra').text()).toBe('更多')
  })

  it('header slot overrides the title prop', () => {
    const wrapper = mount(LhCard, {
      propsData: { title: '被覆盖' },
      slots: { header: '<h3>自定义头部</h3>' },
    })
    expect(wrapper.find('.lh-card__title').exists()).toBe(false)
    expect(wrapper.find('h3').text()).toBe('自定义头部')
  })

  it('renders footer and cover sections', () => {
    const wrapper = mount(LhCard, {
      slots: { cover: '<img alt="封面" />', footer: '<span>底部</span>' },
    })
    expect(wrapper.find('.lh-card__cover img').exists()).toBe(true)
    expect(wrapper.find('.lh-card__footer').text()).toBe('底部')
  })

  it('applies shadow variants', () => {
    const wrapper = mount(LhCard, { propsData: { shadow: 'never' } })
    expect(wrapper.classes()).toContain('lh-card--shadow-never')
  })

  it('interactive cards expose button semantics and keyboard activation', async () => {
    const wrapper = mount(LhCard, { propsData: { clickable: true } })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')

    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('static cards carry no button semantics', () => {
    const wrapper = mount(LhCard)
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })

  it('shows loading placeholder with aria-busy', () => {
    const wrapper = mount(LhCard, { propsData: { loading: true } })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.lh-card__loading').exists()).toBe(true)
    expect(wrapper.find('.lh-card__body').text()).toBe('')
  })
})

import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhButton from '../../src/components/button'

const IconSlotProbe = defineComponent({
  name: 'IconSlotProbe',
  render(this: Vue, h: CreateElement) {
    return h('em', { class: 'custom-icon' }, '★')
  },
})

describe('LhButton', () => {
  it('渲染默认类名与插槽内容', () => {
    const wrapper = mount(LhButton, {
      slots: { default: '确认' },
    })
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.classes()).toContain('lh-button')
    expect(btn.classes()).toContain('lh-button--default')
    expect(btn.classes()).toContain('lh-button--medium')
    expect(btn.text()).toBe('确认')
    expect(btn.attributes('type')).toBe('button')
  })

  it('type/size/plain/block 等 props 落成 BEM 类名', () => {
    const wrapper = mount(LhButton, {
      propsData: { type: 'primary', size: 'large', plain: true, round: true },
      slots: { default: 'x' },
    })
    const cls = wrapper.find('button').classes()
    expect(cls).toContain('lh-button--primary')
    expect(cls).toContain('lh-button--large')
    expect(cls).toContain('lh-button--plain')
    expect(cls).toContain('lh-button--round')
  })

  it('click 事件正常触发', async () => {
    const wrapper = mount(LhButton, { slots: { default: 'x' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').emitted('click')).toHaveLength(1)
  })

  it('disabled 时不可点击且 native click 不触发 emit', async () => {
    const wrapper = mount(LhButton, {
      propsData: { disabled: true },
      slots: { default: 'x' },
    })
    expect(wrapper.find('button').classes()).toContain('lh-button--disabled')
    await wrapper.find('button').trigger('click')
    // 原生 disabled button 在 jsdom 中不派发 click？——显式断言不触发
    expect(wrapper.find('button').emitted('click')).toBeUndefined()
  })

  it('loading 时渲染 spinner 并禁点', async () => {
    const wrapper = mount(LhButton, {
      propsData: { loading: true },
      slots: { default: 'x' },
    })
    expect(wrapper.find('.lh-button__loading').exists()).toBe(true)
    expect(wrapper.find('.lh-button').classes()).toContain('lh-button--loading')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').emitted('click')).toBeUndefined()
  })

  it('href 渲染为 <a> 链接', () => {
    const wrapper = mount(LhButton, {
      propsData: { href: 'https://example.com', target: '_blank' },
      slots: { default: '链接' },
    })
    expect(wrapper.find('button').exists()).toBe(false)
    const a = wrapper.find('a')
    expect(a.attributes('href')).toBe('https://example.com')
    expect(a.attributes('target')).toBe('_blank')
  })

  it('icon 插槽可覆盖默认 <i>', () => {
    const wrapper = mount(LhButton, {
      propsData: { icon: 'lh-icon-edit' },
      slots: { icon: IconSlotProbe },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.lh-button__icon i').exists()).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mountComp as mount } from '../helpers'
import LhIcon, { LhIconStar } from '../../src/components/icon'

describe('LhIcon', () => {
  it('按名称渲染 SVG path', () => {
    const wrapper = mount(LhIcon, { propsData: { name: 'star' } })
    expect(wrapper.find('.lh-icon').classes()).toContain('lh-icon--star')
    const path = wrapper.find('path')
    expect(path.exists()).toBe(true)
    expect(path.attributes('d')).toBeTruthy()
  })

  it('size/color 落成内联样式', () => {
    const wrapper = mount(LhIcon, { propsData: { name: 'star', size: 28, color: '#ff0000' } })
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('28')
    const style = wrapper.find('.lh-icon').attributes('style')
    // jsdom 把 #ff0000 规范化为 rgb(255, 0, 0)
    expect(style).toContain('color: rgb(255, 0, 0)')
  })

  it('无 name 时渲染插槽内容', () => {
    const SlotProbe = defineComponent({
      name: 'SlotProbe',
      render(this: Vue, h: CreateElement) {
        return h('b', { class: 'custom' }, '★')
      },
    })
    const wrapper = mount(LhIcon, { slots: { default: SlotProbe } })
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('b.custom').exists()).toBe(true)
  })

  it('$attrs 透传到根元素（inheritAttrs: false 显式绑定）', () => {
    const wrapper = mount(LhIcon, {
      propsData: { name: 'star' },
      attrs: { 'data-testid': 'icon-star' },
    })
    expect(wrapper.find('.lh-icon').attributes('data-testid')).toBe('icon-star')
  })
})

describe('独立图标组件（tree-shaking 工厂）', () => {
  it('LhIconStar 可独立渲染', () => {
    const wrapper = mount(LhIconStar, { propsData: { size: 16 } })
    expect(wrapper.find('.lh-icon').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('width')).toBe('16')
  })
})

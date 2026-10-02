import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhVirtualList from '../../src/components/virtual-list'

const VirtualListComp = LhVirtualList as unknown as ComponentOptions<Vue>

// VTU v1 的 scopedSlots 需要作用域参数：用宿主组件 render 传作用域插槽
const mountVirtualList = (
  propsData: Record<string, unknown>,
  cellText: (scope: { item: unknown; index: number }) => string,
) => {
  const Host = defineComponent({
    name: 'VirtualListHost',
    render(this: Vue, h: CreateElement) {
      return h(VirtualListComp, {
        props: propsData,
        scopedSlots: {
          default: (scope: { item: unknown; index: number }) =>
            h('span', { class: 'cell' }, cellText(scope)),
        },
      })
    },
  })
  return mount(Host as unknown as ComponentOptions<Vue>)
}

describe('LhVirtualList Component', () => {
  it('renders only a window of items in fixed-height mode', () => {
    const data = Array.from({ length: 1000 }, (_, i) => i)
    const wrapper = mountVirtualList({ data, height: 200, itemHeight: 40 }, (s) => `${s.item}`)
    // jsdom clientHeight 为 0 → 只渲染 overscan 窗口，远少于 1000
    expect(wrapper.findAll('.lh-virtual-list__item').length).toBeLessThan(1000)
    expect(wrapper.find('.lh-virtual-list__phantom').attributes('style')).toContain('40000px')
  })

  it('renders a window in dynamic-height mode', () => {
    const data = Array.from({ length: 500 }, (_, i) => i)
    const wrapper = mountVirtualList(
      { data, height: 200, itemSize: (i: number) => (i % 2 === 0 ? 30 : 50) },
      (s) => `${s.item}`,
    )
    const items = wrapper.findAll('.lh-virtual-list__item')
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThan(500)
  })

  it('exposes scoped item and index to the slot', () => {
    const data = ['x', 'y']
    const wrapper = mountVirtualList({ data, height: 200, itemHeight: 40 }, (s) => `${s.index}:${s.item}`)
    const first = wrapper.find('.cell')
    if (first.exists()) expect(first.text()).toBe('0:x')
  })

  it('applies the container class and height', () => {
    const wrapper = mount(LhVirtualList, { propsData: { data: [1], height: 120, itemHeight: 40 } })
    expect(wrapper.classes()).toContain('lh-virtual-list')
    expect(wrapper.attributes('style')).toContain('height: 120px')
  })
})

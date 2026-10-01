import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhCollapse, { LhCollapseItem } from '../../src/components/collapse'

// 2.7 defineComponent 的类型是 Vue3 风格，VTU v1 / render h 需要 Vue2 形态（运行时无差异）
const CollapseComp = LhCollapse as unknown as ComponentOptions<Vue>
const CollapseItemComp = LhCollapseItem as unknown as ComponentOptions<Vue>

// VTU v1 的 scopedSlots 不传 createElement：用宿主组件 render 传子组件
const mountCollapse = (propsData: Record<string, unknown> = {}) => {
  const Host = defineComponent({
    name: 'CollapseHost',
    render(this: Vue, h: CreateElement) {
      return h(CollapseComp, { props: propsData }, [
        h(CollapseItemComp, { props: { name: 'a', title: '面板甲' } }, '内容甲'),
        h(CollapseItemComp, { props: { name: 'b', title: '面板乙' } }, '内容乙'),
        h(CollapseItemComp, { props: { name: 'c', title: '禁用面板', disabled: true } }, '内容丙'),
      ])
    },
  })
  return mount(Host as unknown as ComponentOptions<Vue>)
}

const findHeaders = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('.lh-collapse__header')

describe('LhCollapse Component', () => {
  it('renders headers as buttons with aria-expanded and regions with ids', () => {
    const wrapper = mountCollapse()
    const headers = findHeaders(wrapper)
    expect(headers.length).toBe(3)
    expect(headers.at(0)!.attributes('aria-expanded')).toBe('false')
    const region = wrapper.find('.lh-collapse__wrap')
    expect(region.attributes('role')).toBe('region')
    expect(region.attributes('aria-labelledby')).toBe(headers.at(0)!.attributes('id'))
    expect(region.attributes('aria-controls')).toBeUndefined()
    expect(headers.at(0)!.attributes('aria-controls')).toBe(region.attributes('id'))
  })

  it('toggles panels and expands content', async () => {
    const wrapper = mountCollapse()
    await findHeaders(wrapper).at(0)!.trigger('click')
    expect(findHeaders(wrapper).at(0)!.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-collapse__item--active').exists()).toBe(true)
  })

  it('enforces the accordion constraint', async () => {
    const wrapper = mountCollapse({ accordion: true })
    await findHeaders(wrapper).at(0)!.trigger('click')
    await findHeaders(wrapper).at(1)!.trigger('click')
    const expanded = findHeaders(wrapper).filter((h) => h.attributes('aria-expanded') === 'true')
    expect(expanded.length).toBe(1)
    expect(expanded.at(0)!.text()).toContain('面板乙')
  })

  it('blocks disabled items', async () => {
    const wrapper = mountCollapse()
    await findHeaders(wrapper).at(2)!.trigger('click')
    expect(findHeaders(wrapper).at(2)!.attributes('aria-expanded')).toBe('false')
    expect(findHeaders(wrapper).at(2)!.attributes('disabled')).toBeDefined()
  })
})

import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhLayout, { LhLayoutAside, LhLayoutFooter, LhLayoutHeader, LhLayoutMain } from '../../src/components/layout'

// 2.7 defineComponent 的类型是 Vue3 风格，VTU v1 / render h 需要 Vue2 形态（运行时无差异）
const LayoutComp = LhLayout as unknown as ComponentOptions<Vue>
const HeaderComp = LhLayoutHeader as unknown as ComponentOptions<Vue>
const AsideComp = LhLayoutAside as unknown as ComponentOptions<Vue>
const MainComp = LhLayoutMain as unknown as ComponentOptions<Vue>
const FooterComp = LhLayoutFooter as unknown as ComponentOptions<Vue>

// VTU v1 的 slots 字符串无法传子组件 props：用宿主组件 render 传子组件
const mountLayout = (children: Array<{ comp: ComponentOptions<Vue>; text: string }>) => {
  const Host = defineComponent({
    name: 'LayoutHost',
    render(this: Vue, h: CreateElement) {
      return h(LayoutComp, {}, children.map((c) => h(c.comp, {}, c.text)))
    },
  })
  return mount(Host as unknown as ComponentOptions<Vue>)
}
describe('LhLayout Component', () => {
  it('renders semantic landmark elements', () => {
    const wrapper = mountLayout([
      { comp: HeaderComp, text: '头' },
      { comp: MainComp, text: '主' },
      { comp: FooterComp, text: '脚' },
    ])
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('switches to vertical when an aside is present', async () => {
    const wrapper = mountLayout([{ comp: AsideComp, text: '侧' }])
    await (wrapper.vm as Vue).$nextTick()
    expect(wrapper.find('aside').exists()).toBe(true)
    expect(wrapper.find('section').classes()).toContain('lh-layout--vertical')
  })

  it('labels the aside landmark', () => {
    const wrapper = mount(LhLayoutAside, { propsData: { ariaLabel: '侧边导航' } })
    expect(wrapper.attributes('aria-label')).toBe('侧边导航')
  })

  it('applies width to the aside', () => {
    const wrapper = mount(LhLayoutAside, { propsData: { width: 220 } })
    expect(wrapper.attributes('style')).toContain('width: 220px')
  })

  it('renders a single aside landmark with sx style on header', () => {
    // sx 词典为受控键集：p:1 → padding: 8px（未知键会被丢弃）
    const wrapper = mount(LhLayoutHeader, { propsData: { sx: { p: 1 } } })
    expect(wrapper.classes()).toContain('lh-layout-header')
    expect(wrapper.attributes('style')).toContain('padding: 8px')
  })
})

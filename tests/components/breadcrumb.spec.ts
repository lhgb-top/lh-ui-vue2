import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhBreadcrumb, { LhBreadcrumbItem } from '../../src/components/breadcrumb'
import { lhlocale } from '../../src/locale'

const BreadcrumbComp = LhBreadcrumb as unknown as ComponentOptions<Vue>
const BreadcrumbItemComp = LhBreadcrumbItem as unknown as ComponentOptions<Vue>

// VTU v1 的 slots 不支持带 props 的组件：用宿主组件 render 传子组件
function mountBreadcrumb(items: { to?: string }[], mountProps: Record<string, unknown> = {}) {
  const Host = defineComponent({
    name: 'BreadcrumbHost',
    render(this: Vue, h: CreateElement) {
      return h(BreadcrumbComp, { props: mountProps }, [
        ...items.map((item, index) =>
          h(BreadcrumbItemComp, { props: { to: item.to } }, `Item ${index + 1}`),
        ),
      ])
    },
  })
  return mount(Host as unknown as ComponentOptions<Vue>)
}

describe('LhBreadcrumb', () => {
  it('renders nav + ol semantics', () => {
    const wrapper = mountBreadcrumb([{}, {}, {}])
    expect(wrapper.find('nav.lh-breadcrumb').exists()).toBe(true)
    expect(wrapper.find('ol.lh-breadcrumb__list').exists()).toBe(true)
    expect(wrapper.findAll('.lh-breadcrumb__item')).toHaveLength(3)
    wrapper.destroy()
  })

  it('renders separators between items and supports custom char', async () => {
    const wrapper = mountBreadcrumb([{}, {}, {}])
    // 子项注册完成后的微任务批次内序号/总数收敛
    await nextTick()
    expect(wrapper.findAll('.lh-breadcrumb__separator')).toHaveLength(2)
    expect(wrapper.find('.lh-breadcrumb__separator').text()).toBe('/')

    const custom = mountBreadcrumb([{}, {}, {}], { separator: '·' })
    await nextTick()
    expect(custom.find('.lh-breadcrumb__separator').text()).toBe('·')
    custom.destroy()
    wrapper.destroy()
  })

  it('marks the last item as the current page and keeps it unlinked', async () => {
    const wrapper = mountBreadcrumb([{ to: '/home' }, { to: '/current' }])
    await nextTick()
    const texts = wrapper.findAll('.lh-breadcrumb__text')
    expect(texts).toHaveLength(1)
    expect(texts.at(0)!.attributes('aria-current')).toBe('page')
    // 末项即使传了 to 也渲染为文本而非链接
    expect(wrapper.findAll('a.lh-breadcrumb__link')).toHaveLength(1)
    wrapper.destroy()
  })

  it('collapses middle items beyond maxItems with an expandable ellipsis', async () => {
    const wrapper = mountBreadcrumb([{}, {}, {}, {}, {}], { maxItems: 3 })
    await nextTick()
    // 首项 + 末尾 2 项可见，中间 2 项折叠；隐藏项用 v-show 保留挂载（uid 重排依赖）
    // findAll 的元素类型是 Element（VTU 1.x 的 findAll 无元素泛型，仅 find 有），取 style 需断言 HTMLElement
    const items = wrapper.findAll('.lh-breadcrumb__item')
    const visible = items.filter((item) => !(item.element as HTMLElement).style.display.includes('none'))
    expect(visible).toHaveLength(3)
    const ellipsis = wrapper.find('.lh-breadcrumb__ellipsis-btn')
    expect(ellipsis.exists()).toBe(true)
    expect(ellipsis.attributes('aria-label')).toBe('更多')

    await ellipsis.trigger('click')
    await nextTick()
    const expandedItems = wrapper.findAll('.lh-breadcrumb__item')
    expect(
      expandedItems.filter((item) => !(item.element as HTMLElement).style.display.includes('none')).length,
    ).toBe(expandedItems.length)
    // 省略号同样走 v-show（绑在 .lh-breadcrumb__ellipsis 上），展开后仅隐藏而非移出 DOM
    expect(wrapper.find<HTMLElement>('.lh-breadcrumb__ellipsis').element.style.display).toContain('none')
    wrapper.destroy()
  })

  it('uses localized labels and reacts to locale switches', async () => {
    const wrapper = mountBreadcrumb([{}])
    expect(wrapper.find('nav').attributes('aria-label')).toBe('面包屑导航')

    lhlocale.setLocale('en-US')
    await nextTick()
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')

    lhlocale.setLocale('zh-CN')
    wrapper.destroy()
  })
})

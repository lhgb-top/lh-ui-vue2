import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { VNode } from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhMenu, { LhMenuItem, LhMenuItemGroup, LhSubMenu } from '../../src/components/menu'

// 2.7 defineComponent 的类型是 Vue3 风格，VTU v1 / render h 需要 Vue2 形态（运行时无差异）
const MenuComp = LhMenu as unknown as ComponentOptions<Vue>
const MenuItemComp = LhMenuItem as unknown as ComponentOptions<Vue>
const SubMenuComp = LhSubMenu as unknown as ComponentOptions<Vue>
const MenuItemGroupComp = LhMenuItemGroup as unknown as ComponentOptions<Vue>

type MenuEmit = (event: string, ...args: unknown[]) => void

/** 默认子树：叶子 a / 子菜单 b（b-1、b-2）/ 禁用叶子 c */
const defaultItems = (h: CreateElement): VNode[] => [
  h(MenuItemComp, { props: { index: 'a' } }, '首页'),
  h(SubMenuComp, { props: { index: 'b', title: '设置' } }, [
    h(MenuItemComp, { props: { index: 'b-1' } }, '基本'),
    h(MenuItemComp, { props: { index: 'b-2' } }, '安全'),
  ]),
  h(MenuItemComp, { props: { index: 'c', disabled: true } }, '禁用'),
]

// VTU v1 的 scopedSlots 不传 createElement：用宿主组件 render 传子组件；
// 宿主转发 v-model（input）与菜单事件，供 wrapper.emitted 断言
const mountMenu = (
  menuProps: Record<string, unknown> = {},
  children: (h: CreateElement) => VNode[] = defaultItems,
) => {
  const Host = defineComponent({
    name: 'MenuHost',
    render(this: Vue & { $emit: MenuEmit }, h: CreateElement) {
      return h(
        MenuComp,
        {
          props: menuProps,
          on: {
            input: (v: string) => this.$emit('input', v),
            select: (...args: unknown[]) => this.$emit('select', ...args),
            open: (...args: unknown[]) => this.$emit('open', ...args),
            close: (...args: unknown[]) => this.$emit('close', ...args),
            'update:openeds': (v: string[]) => this.$emit('update:openeds', v),
          },
        },
        children(h),
      )
    },
  })
  // 键盘导航用例依赖真实 focus()，统一挂进文档
  return mount(Host as unknown as ComponentOptions<Vue>, { attachTo: document.body })
}

describe('LhMenu Component', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a vertical menu with menu role', () => {
    const wrapper = mountMenu()
    expect(wrapper.find('ul.lh-menu').exists()).toBe(true)
    expect(wrapper.find('ul.lh-menu').attributes('role')).toBe('menu')
    // 叶子项：a、b-1、b-2（内联子菜单内）、c
    expect(wrapper.findAll('.lh-menu-item').length).toBe(4)
    expect(wrapper.text()).toContain('首页')
  })

  it('activates an item and emits input / select', async () => {
    const wrapper = mountMenu()
    await wrapper.find('.lh-menu-item').trigger('click')
    expect(wrapper.emitted('input')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('select')?.[0]).toEqual(['a', ['a']])
    expect(wrapper.find('.lh-menu-item--active').exists()).toBe(true)
  })

  it('blocks disabled items', async () => {
    const wrapper = mountMenu()
    const disabled = wrapper.findAll('.lh-menu-item').at(3)!
    await disabled.trigger('click')
    expect(wrapper.emitted('input')).toBeUndefined()
    expect(disabled.classes()).toContain('lh-menu-item--disabled')
  })

  it('expands a sub-menu inline in vertical mode', async () => {
    const wrapper = mountMenu()
    await wrapper.find('.lh-sub-menu__title').trigger('click')
    expect(wrapper.find('.lh-sub-menu--opened').exists()).toBe(true)
    expect(wrapper.find('.lh-sub-menu__title').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.lh-sub-menu__inline').exists()).toBe(true)
  })

  it('enforces uniqueOpened accordion constraint', async () => {
    const wrapper = mountMenu(
      { uniqueOpened: true },
      (h) => [
        h(SubMenuComp, { props: { index: 'a', title: '甲' } }, [
          h(MenuItemComp, { props: { index: 'a-1' } }, 'A1'),
        ]),
        h(SubMenuComp, { props: { index: 'b', title: '乙' } }, [
          h(MenuItemComp, { props: { index: 'b-1' } }, 'B1'),
        ]),
      ],
    )
    const titles = wrapper.findAll('.lh-sub-menu__title')
    await titles.at(0)!.trigger('click')
    await titles.at(1)!.trigger('click')
    expect(wrapper.findAll('.lh-sub-menu--opened').length).toBe(1)
    expect(wrapper.findAll('.lh-sub-menu--opened').at(0)!.text()).toContain('乙')
  })

  it('renders a horizontal menu as menubar with popper sub-menu', async () => {
    const wrapper = mountMenu({ mode: 'horizontal' })
    expect(wrapper.find('ul.lh-menu').attributes('role')).toBe('menubar')
    await wrapper.find('.lh-sub-menu__title').trigger('mouseenter')
    // 飞出面板 host 移到 body，要从 document 查
    expect(document.querySelector('.lh-sub-menu__popper')).toBeTruthy()
    wrapper.destroy()
  })

  it('renders item groups with presentation role', () => {
    const wrapper = mountMenu({}, (h) => [
      h(MenuItemGroupComp, { props: { title: '分组一' } }, [
        h(MenuItemComp, { props: { index: 'a' } }, '项'),
      ]),
    ])
    const group = wrapper.find('.lh-menu-item-group')
    expect(group.attributes('role')).toBe('presentation')
    expect(group.text()).toContain('分组一')
    expect(wrapper.findAll('.lh-menu-item').length).toBe(1)
  })

  it('opens sub-menu via keyboard', async () => {
    const wrapper = mountMenu()
    const title = wrapper.find('.lh-sub-menu__title')
    await title.trigger('keydown', { key: 'Enter' })
    expect(wrapper.find('.lh-sub-menu--opened').exists()).toBe(true)
  })

  it('traverses across submenu boundaries with arrow keys', async () => {
    const wrapper = mountMenu({ defaultOpeneds: ['b'] })
    // 可见项 DOM 序：a → 标题 b → b-1 → b-2（c 禁用被跳过）
    const menuitems = () => wrapper.findAll('[role="menuitem"]')
    // a → ↓ → 子菜单标题（跨出叶子项边界）
    await wrapper.findAll('.lh-menu-item').at(0)!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuitems().at(1)!.element)
    // 标题 → ↓ → 面板首项（跨入子菜单面板边界）
    await menuitems().at(1)!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuitems().at(2)!.element)
    wrapper.destroy()
  })

  it('wraps focus around skipping disabled and closed panels', async () => {
    const wrapper = mountMenu()
    const a = wrapper.findAll('.lh-menu-item').at(0)!
    // 子菜单未展开：面板内项 aria-hidden 被跳过；禁用 c 跳过；↑ 从 a 回绕到标题 b
    await a.trigger('keydown', { key: 'ArrowUp' })
    const title = wrapper.find('.lh-sub-menu__title')
    expect(document.activeElement).toBe(title.element)
    wrapper.destroy()
  })
})

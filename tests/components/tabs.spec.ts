import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import type Vue from 'vue'
import type { ComponentOptions, CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhTabs, { LhTabPane } from '../../src/components/tabs'
import { lhlocale } from '../../src/locale'

const TabsComp = LhTabs as unknown as ComponentOptions<Vue>
const TabPaneComp = LhTabPane as unknown as ComponentOptions<Vue>

type TabsEmit = (event: string, ...args: unknown[]) => void

function mountTabs(extraProps: Record<string, unknown> = {}) {
  // 宿主转发 v-model（input）与 tabs 事件，供 wrapper.emitted 断言
  const Host = defineComponent({
    name: 'TabsHost',
    render(this: Vue & { $emit: TabsEmit }, h: CreateElement) {
      return h(
        TabsComp,
        {
          props: extraProps,
          on: {
            input: (v: string) => this.$emit('input', v),
            'tab-change': (v: string) => this.$emit('tab-change', v),
            'tab-remove': (v: string) => this.$emit('tab-remove', v),
            'tab-add': () => this.$emit('tab-add'),
          },
        },
        [
          h(TabPaneComp, { props: { name: 'a', label: 'Tab A' } }, 'Content A'),
          h(TabPaneComp, { props: { name: 'b', label: 'Tab B', disabled: true } }, 'Content B'),
          h(TabPaneComp, { props: { name: 'c', label: 'Tab C' } }, 'Content C'),
        ],
      )
    },
  })
  // 键盘导航用例依赖真实 focus()，树必须挂进文档，否则 jsdom 的
  // isFocusableAreaElement 会因 isConnected 为假直接跳过聚焦
  return mount(Host as unknown as ComponentOptions<Vue>, { attachTo: document.body })
}

describe('LhTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders tablist / tab / tabpanel roles with aria wiring', () => {
    const wrapper = mountTabs()
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs).toHaveLength(3)

    const active = tabs.at(0)!
    expect(active.attributes('aria-selected')).toBe('true')
    const panelId = active.attributes('aria-controls')
    expect(panelId).toBeTruthy()
    const panel = wrapper.find(`[id="${panelId}"]`)
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('tabpanel')
    // aria-labelledby 指向为其命名的页签，不是面板自身的 id
    expect(panel.attributes('aria-labelledby')).toBe(active.attributes('id'))
    wrapper.destroy()
  })

  it('activates the first enabled tab and hides other panels', () => {
    const wrapper = mountTabs()
    const panels = wrapper.findAll('[role="tabpanel"]')
    expect(panels).toHaveLength(3)
    expect((panels.at(0)!.element as HTMLElement).style.display).not.toBe('none')
    expect((panels.at(1)!.element as HTMLElement).style.display).toBe('none')
    expect(wrapper.text()).toContain('Content A')
    wrapper.destroy()
  })

  it('respects the controlled modelValue', () => {
    const wrapper = mountTabs({ modelValue: 'c' })
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.at(2)!.attributes('aria-selected')).toBe('true')
    expect(tabs.at(2)!.text()).toContain('Tab C')
    wrapper.destroy()
  })

  it('数值型 modelValue 归一化后激活对应页签', () => {
    // 页签名是字符串，modelValue 可能以数值传入（索引、计数器）：
    // 旧实现 record.name === modelValue（'c' === 3）恒不匹配，回退到第一页签
    const wrapper = mountTabs({ modelValue: 3 })
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.at(0)!.attributes('aria-selected')).toBe('true')
    wrapper.destroy()
  })

  it('显式绑定到空串名的页签可激活', () => {
    // resolveActiveName 旧用真值短路：name 为 '' 的页签永远无法被显式激活，
    // 只能靠「第一个可用页签」兜底意外命中。故把具名页签放前、空串页签放后：
    // 兜底会选中前者，显式匹配才会选中后者
    const Host = defineComponent({
      name: 'EmptyNameHost',
      render(h: CreateElement) {
        return h(
          TabsComp,
          { props: { modelValue: '' } },
          [
            h(TabPaneComp, { props: { name: 'first', label: 'First' } }, 'First content'),
            h(TabPaneComp, { props: { name: '', label: 'Empty' } }, 'Empty content'),
          ],
        )
      },
    })
    const wrapper = mount(Host as unknown as ComponentOptions<Vue>)
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.at(1)!.attributes('aria-selected')).toBe('true')
    expect(tabs.at(0)!.attributes('aria-selected')).toBe('false')
    wrapper.destroy()
  })

  it('uses roving tabindex across enabled tabs', () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.at(0)!.attributes('tabindex')).toBe('0')
    expect(tabs.at(1)!.attributes('tabindex')).toBe('-1')
    expect(tabs.at(2)!.attributes('tabindex')).toBe('-1')
    expect(tabs.at(1)!.attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })

  it('emits tab-change and v-model on click', async () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    await tabs.at(2)!.trigger('click')
    expect(wrapper.emitted('input')).toEqual([['c']])
    expect(wrapper.emitted('tab-change')).toEqual([['c']])
    expect(tabs.at(2)!.attributes('aria-selected')).toBe('true')
    wrapper.destroy()
  })

  it('ignores clicks on disabled tabs', async () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    await tabs.at(1)!.trigger('click')
    expect(wrapper.emitted('input')).toBeFalsy()
    wrapper.destroy()
  })

  it('moves selection with arrow keys, skipping disabled tabs', async () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    // 从 a 向右：跳过禁用的 b 直达 c
    await tabs.at(0)!.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.emitted('input')).toEqual([['c']])
    // 焦点移动到 c（自动激活）
    expect(document.activeElement?.getAttribute('data-name')).toBe('c')

    // Home 回到首个可用页签
    await wrapper.find('[data-name="c"]').trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('input')).toEqual([['c'], ['a']])
    wrapper.destroy()
  })

  it('closes tabs via the close button and the Delete key', async () => {
    const wrapper = mountTabs({ closable: true, modelValue: 'c' })
    const tabs = wrapper.findAll('[role="tab"]')
    // 非激活页签点关闭
    await tabs.at(0)!.find('.lh-tabs__tab-close').trigger('click')
    expect(wrapper.emitted('tab-remove')).toEqual([['a']])
    // 激活页签按 Delete 关闭
    await tabs.at(2)!.trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('tab-remove')).toEqual([['a'], ['c']])
    // 关闭激活页签后联动到相邻可用页签（剩余 a、c 中 c 移除 → a）
    wrapper.destroy()
  })

  it('does not close tabs when closable is off', async () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    await tabs.at(0)!.trigger('keydown', { key: 'Delete' })
    expect(wrapper.emitted('tab-remove')).toBeFalsy()
    wrapper.destroy()
  })

  it('renders the add button with a localized aria-label', async () => {
    const wrapper = mountTabs({ addable: true })
    const add = wrapper.find('.lh-tabs__add')
    expect(add.attributes('aria-label')).toBe('新增标签页')
    await add.trigger('click')
    expect(wrapper.emitted('tab-add')).toHaveLength(1)

    lhlocale.setLocale('en-US')
    await nextTick()
    expect(wrapper.find('.lh-tabs__add').attributes('aria-label')).toBe('Add tab')
    lhlocale.setLocale('zh-CN')
    wrapper.destroy()
  })
})

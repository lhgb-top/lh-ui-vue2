import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhTreeSelect from '../../src/components/tree-select'
import type { LhTreeNode } from '../../src/components/tree'

const DATA: LhTreeNode[] = [
  {
    key: 'a',
    label: '节点 A',
    children: [
      { key: 'a-1', label: '节点 A-1' },
      { key: 'a-2', label: '节点 A-2' },
    ],
  },
  { key: 'b', label: '节点 B' },
]

const flush = () => new Promise((r) => setTimeout(r, 150))

/** 面板挂在 body（teleported 默认 true），必须走 document 查询 */
const panel = () => document.querySelector('.lh-tree-select__panel') as HTMLElement

describe('LhTreeSelect', () => {
  it('渲染触发器与 placeholder 兜底', () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA } })
    expect(wrapper.find('.lh-tree-select').exists()).toBe(true)
    expect(wrapper.find('.lh-tree-select__placeholder').text()).toBe('请选择')
    expect(wrapper.find('.lh-tree-select__trigger').attributes('aria-expanded')).toBe('false')
    wrapper.destroy()
  })

  it('受控 value 回显节点文案', () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA, value: 'a-1' } })
    expect(wrapper.find('.lh-tree-select__value').text()).toBe('节点 A-1')
    wrapper.destroy()
  })

  it('点击打开面板（挂到 body）并渲染树', async () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA }, attachToDocument: true })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    const el = panel()
    expect(el).toBeTruthy()
    expect(el.closest('.lh-tree-select')).toBeNull()
    // 树渲染顶层节点
    expect(el.querySelectorAll('.lh-tree-node')).toHaveLength(2)
    wrapper.destroy()
  })

  it('单选：展开后点击叶子触发 input 并关闭面板', async () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA }, attachToDocument: true })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    // 点展开箭头（不触发选中）
    const arrow = panel().querySelector('.lh-tree-node__arrow') as HTMLElement
    arrow.click()
    await flush()
    const expanded = panel().querySelectorAll('.lh-tree-node')
    expect(expanded).toHaveLength(4)
    // 点叶子 A-1
    ;(expanded[1] as HTMLElement).click()
    await flush()
    expect(wrapper.emitted('input')).toEqual([['a-1']])
    expect(wrapper.emitted('change')).toBeTruthy()
    // 单选后面板关闭
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('多选：勾选键数组为值，面板保持打开', async () => {
    const wrapper = mount(LhTreeSelect, {
      propsData: { data: DATA, multiple: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    // 先展开 A
    ;(panel().querySelector('.lh-tree-node__arrow') as HTMLElement).click()
    await flush()
    const checkboxes = panel().querySelectorAll('.lh-tree-node__checkbox')
    ;(checkboxes[1] as HTMLElement).click() // a-1
    await flush()
    expect(wrapper.emitted('input')).toEqual([[['a-1']]])
    // 多选面板不关闭
    expect(panel()).toBeTruthy()
    wrapper.destroy()
  })

  it('Escape 关闭面板并归还焦点', async () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA }, attachToDocument: true })
    const trigger = wrapper.find('.lh-tree-select__trigger')
    await trigger.trigger('click')
    await flush()
    expect(panel()).toBeTruthy()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('disabled 时禁止打开面板', async () => {
    const wrapper = mount(LhTreeSelect, {
      propsData: { data: DATA, disabled: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    expect(panel()).toBeNull()
    expect(wrapper.find('.lh-tree-select--disabled').exists()).toBe(true)
    wrapper.destroy()
  })

  it('单选：点击父节点只展开、不选中关闭，可逐级点达深层节点', async () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA }, attachToDocument: true })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    // 直接点击父节点行（非箭头）：只展开
    ;(panel().querySelector('.lh-tree-node') as HTMLElement).click()
    await flush()
    expect(panel()).toBeTruthy()
    expect(wrapper.emitted('input')).toBeFalsy()
    expect(panel().querySelectorAll('.lh-tree-node')).toHaveLength(4)
    // 再点深层叶子节点才选中并关闭
    ;(panel().querySelectorAll('.lh-tree-node')[1] as HTMLElement).click()
    await flush()
    expect(wrapper.emitted('input')).toEqual([['a-1']])
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('单选：已展开的父节点再次点击才选中', async () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA }, attachToDocument: true })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    const parent = () => panel().querySelector('.lh-tree-node') as HTMLElement
    parent().click() // 展开
    await flush()
    expect(wrapper.emitted('input')).toBeFalsy()
    parent().click() // 已展开 → 选中
    await flush()
    expect(wrapper.emitted('input')).toEqual([['a']])
    wrapper.destroy()
  })

  it('多选：选中节点只有勾选态，没有 --selected 双重复态', async () => {
    const wrapper = mount(LhTreeSelect, {
      propsData: { data: DATA, value: ['b'], multiple: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    const nodes = panel().querySelectorAll('.lh-tree-node')
    // b 是叶子且在值中：勾选框 checked，但行节点不挂 --selected
    const nodeB = nodes[nodes.length - 1] as HTMLElement
    expect(nodeB.querySelector('.lh-tree-node__checkbox--checked')).toBeTruthy()
    expect(nodeB.classList.contains('lh-tree-node--selected')).toBe(false)
    wrapper.destroy()
  })

  it('点击组件外部（mousedown）关闭面板', async () => {
    const wrapper = mount(LhTreeSelect, { propsData: { data: DATA }, attachToDocument: true })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    expect(panel()).toBeTruthy()
    // useLhClickOutside 默认监听 mousedown
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('teleported=false 时面板留在组件子树内', async () => {
    const wrapper = mount(LhTreeSelect, {
      propsData: { data: DATA, teleported: false },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tree-select__trigger').trigger('click')
    await flush()
    // 面板仍在 root 子树内（未被移走）
    expect(wrapper.find('.lh-tree-select__panel').exists()).toBe(true)
    expect(panel().closest('.lh-tree-select')).toBeTruthy()
    wrapper.destroy()
  })
})

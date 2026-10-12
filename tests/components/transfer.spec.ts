import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhTransfer from '../../src/components/transfer'
import type { LhTransferItem } from '../../src/components/transfer'

const DATA: LhTransferItem[] = [
  { key: 1, label: '选项一' },
  { key: 2, label: '选项二' },
  { key: 3, label: '选项三', disabled: true },
  { key: 4, label: '选项四' },
]

// 注意：value 语义 = 左侧（源）键列表（与 plus 对齐）；未受控默认空 → 全部在右
describe('LhTransfer', () => {
  it('渲染双面板；受控 value（左侧键）决定分布', () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const panels = wrapper.findAll('.lh-transfer-panel')
    expect(panels).toHaveLength(2)
    expect(panels.at(0)!.findAll('.lh-transfer-panel__item')).toHaveLength(2)
    expect(panels.at(1)!.findAll('.lh-transfer-panel__item')).toHaveLength(2)
    wrapper.destroy()
  })

  it('未受控时默认全部在右', () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA } })
    const panels = wrapper.findAll('.lh-transfer-panel')
    expect(panels.at(0)!.findAll('.lh-transfer-panel__item')).toHaveLength(0)
    expect(panels.at(1)!.findAll('.lh-transfer-panel__item')).toHaveLength(4)
    wrapper.destroy()
  })

  it('勾选右侧项左移触发 input/change', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA } })
    // 全部在右：勾选第一个（选项一）
    await wrapper.find('.lh-transfer-panel__item .lh-transfer-panel__checkbox').trigger('change')
    await wrapper.vm.$nextTick()
    // 点左移按钮（actions 第 2 个）
    const buttons = wrapper.findAll('.lh-transfer__button')
    await buttons.at(1)!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('input')).toEqual([[[1]]])
    expect(wrapper.emitted('change')).toEqual([[[1], 'right-to-left']])
    // 左侧出现选项一
    const leftItems = wrapper.findAll('.lh-transfer-panel').at(0)!.findAll('.lh-transfer-panel__item')
    expect(leftItems).toHaveLength(1)
    expect(leftItems.at(0)!.text()).toContain('选项一')
    wrapper.destroy()
  })

  it('左移后右移回退（受控）', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1] } })
    // 左侧有选项一：勾选它并右移
    const leftPanel = wrapper.findAll('.lh-transfer-panel').at(0)!
    await leftPanel.find('.lh-transfer-panel__checkbox').trigger('change')
    await wrapper.find('.lh-transfer__button').trigger('click')
    expect(wrapper.emitted('input')).toEqual([[[]]])
    expect(wrapper.emitted('change')![0][1]).toBe('left-to-right')
    wrapper.destroy()
  })

  it('disabled 项不可勾选', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA } })
    const disabledItem = wrapper.findAll('.lh-transfer-panel__item--disabled').at(0)!
    expect(disabledItem.find('.lh-transfer-panel__checkbox').attributes('disabled')).toBeDefined()
    await disabledItem.trigger('click')
    await wrapper.vm.$nextTick()
    // 无勾选时移动按钮禁用
    expect(wrapper.find('.lh-transfer__button').attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })

  it('左面板全选跳过 disabled，右移后 emit 剩余左侧键', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2, 3, 4] } })
    const checkAll = wrapper.find('.lh-transfer-panel__check-all input')
    await checkAll.trigger('change')
    await wrapper.vm.$nextTick()
    // 勾选可选项 1/2/4（跳过 disabled 3），右移后左侧只剩 3
    await wrapper.find('.lh-transfer__button').trigger('click')
    expect(wrapper.emitted('input')).toEqual([[[3]]])
    wrapper.destroy()
  })

  it('搜索过滤左侧面板项', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2, 3, 4] } })
    const search = wrapper.find('.lh-transfer-panel__search')
    await search.setValue('选项二')
    await wrapper.vm.$nextTick()
    const leftPanel = wrapper.findAll('.lh-transfer-panel').at(0)!
    expect(leftPanel.findAll('.lh-transfer-panel__item')).toHaveLength(1)
    expect(leftPanel.find('.lh-transfer-panel__item').text()).toContain('选项二')
    wrapper.destroy()
  })

  it('disabled 整体禁用', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, disabled: true } })
    expect(wrapper.find('.lh-transfer--disabled').exists()).toBe(true)
    await wrapper.find('.lh-transfer__button').trigger('click')
    expect(wrapper.emitted('input')).toBeFalsy()
    wrapper.destroy()
  })

  // ---------- 键盘 + 无障碍（Wave D） ----------

  it('列表项为 option 语义，aria-selected 随勾选状态变化', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const leftPanel = wrapper.findAll('.lh-transfer-panel').at(0)!
    const items = leftPanel.findAll('.lh-transfer-panel__item')
    expect(items.at(0)!.attributes('role')).toBe('option')
    expect(items.at(0)!.attributes('aria-selected')).toBe('false')

    // 空格勾选第一项
    await items.at(0)!.trigger('keydown', { key: ' ' })
    await wrapper.vm.$nextTick()
    expect(leftPanel.findAll('.lh-transfer-panel__item').at(0)!.attributes('aria-selected')).toBe(
      'true',
    )
    wrapper.destroy()
  })

  it('roving tabindex：每面板仅一个 option 可 Tab 进入', () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const panels = wrapper.findAll('.lh-transfer-panel')
    for (let i = 0; i < panels.length; i += 1) {
      const tabbable = panels
        .at(i)!
        .findAll('.lh-transfer-panel__item')
        .filter((item) => item.attributes('tabindex') === '0')
      expect(tabbable).toHaveLength(1)
    }
    wrapper.destroy()
  })

  it('锚点落在禁用项时回落到首个可用项', () => {
    // 右面板为 [3 disabled, 4]：tab 落点必须在选项四而非选项三
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const rightPanel = wrapper.findAll('.lh-transfer-panel--right').at(0)!
    const tabbable = rightPanel
      .findAll('.lh-transfer-panel__item')
      .filter((i) => i.attributes('tabindex') === '0')
    expect(tabbable).toHaveLength(1)
    expect(tabbable.at(0)!.text()).toContain('选项四')
    wrapper.destroy()
  })

  it('上下方向键在列内移动焦点，跳过禁用项', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const rightPanel = wrapper.findAll('.lh-transfer-panel--right').at(0)!
    const items = () => rightPanel.findAll('.lh-transfer-panel__item')
    // 焦点在选项四（首可用项），ArrowUp 应跳过 disabled 的选项三，停在... 无上一项则不动
    await items()
      .at(1)!
      .trigger('keydown', { key: 'ArrowUp' })
    await wrapper.vm.$nextTick()
    const upTabbable = items().filter((i) => i.attributes('tabindex') === '0')
    expect(upTabbable.at(0)!.text()).toContain('选项四')

    // 从选项四 ArrowDown 到列表底，仍停原地（不循环）
    await items()
      .at(1)!
      .trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    expect(
      items()
        .filter((i) => i.attributes('tabindex') === '0')
        .at(0)!
        .text(),
    ).toContain('选项四')
    wrapper.destroy()
  })

  it('左右方向键在两面板间跳焦', async () => {
    // attachTo：jsdom 只有挂在 document 上的元素 focus() 才会更新 activeElement
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(LhTransfer, {
      propsData: { data: DATA, value: [1, 2] },
      attachTo: host,
    })
    const leftPanel = wrapper.findAll('.lh-transfer-panel--left').at(0)!
    const rightPanel = wrapper.findAll('.lh-transfer-panel--right').at(0)!

    // 左面板首项 ArrowRight → 焦点进入右面板
    await leftPanel.find('.lh-transfer-panel__item').trigger('keydown', { key: 'ArrowRight' })
    await new Promise((r) => setTimeout(r, 0))
    expect(rightPanel.element.contains(document.activeElement)).toBe(true)

    // 右面板 ArrowLeft → 焦点回到左面板
    await rightPanel
      .findAll('.lh-transfer-panel__item')
      .filter((i) => i.attributes('tabindex') === '0')
      .at(0)!
      .trigger('keydown', { key: 'ArrowLeft' })
    await new Promise((r) => setTimeout(r, 0))
    expect(leftPanel.element.contains(document.activeElement)).toBe(true)
    wrapper.destroy()
    host.remove()
  })

  it('Enter 与空格都能勾选当前项', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const leftPanel = wrapper.findAll('.lh-transfer-panel--left').at(0)!
    const item = () => leftPanel.findAll('.lh-transfer-panel__item').at(0)!

    await item().trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    expect(item().attributes('aria-selected')).toBe('true')

    await item().trigger('keydown', { key: ' ' })
    await wrapper.vm.$nextTick()
    expect(item().attributes('aria-selected')).toBe('false')
    wrapper.destroy()
  })

  it('Escape 重置焦点锚点', async () => {
    const wrapper = mount(LhTransfer, { propsData: { data: DATA, value: [1, 2] } })
    const leftPanel = wrapper.findAll('.lh-transfer-panel--left').at(0)!
    const items = () => leftPanel.findAll('.lh-transfer-panel__item')

    // 先 ArrowDown 移动焦点
    await items().at(0).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    expect(items().at(1)!.attributes('tabindex')).toBe('0')

    // Escape 回到锚点（无勾选 → 首项）
    await items().at(1).trigger('keydown', { key: 'Escape' })
    await wrapper.vm.$nextTick()
    expect(items().at(0)!.attributes('tabindex')).toBe('0')
    wrapper.destroy()
  })
})

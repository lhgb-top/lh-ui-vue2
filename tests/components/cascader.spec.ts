import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhCascader from '../../src/components/cascader'

const OPTIONS = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  { value: 'jiangsu', label: '江苏', disabled: true },
]

/** 红线 #10：jsdom 里 Transition 的进入/离开靠定时器推进 */
const flush = () => new Promise((r) => setTimeout(r, 150))

/** 拿到挂在 body 的面板 */
const panel = () => document.querySelector('.lh-cascader__panel') as HTMLElement

describe('LhCascader', () => {
  it('渲染触发器与 placeholder 兜底', () => {
    const wrapper = mount(LhCascader)
    expect(wrapper.find('.lh-cascader').exists()).toBe(true)
    expect(wrapper.find('.lh-cascader__input-inner').attributes('placeholder')).toBe('请选择')
    wrapper.destroy()
  })

  it('受控 value 回显完整路径文案', () => {
    const wrapper = mount(LhCascader, {
      propsData: { value: ['zhejiang', 'hangzhou', 'xihu'], options: OPTIONS },
    })
    // Vue 绑定的是 input 的 value property（attribute 不同步，读 property）
    const input = wrapper.find('.lh-cascader__input-inner').element as HTMLInputElement
    expect(input.value).toBe('浙江/杭州/西湖')
    wrapper.destroy()
  })

  it('showAllLevels=false 仅回显末级', () => {
    const wrapper = mount(LhCascader, {
      propsData: { value: ['zhejiang', 'hangzhou', 'xihu'], options: OPTIONS, showAllLevels: false },
    })
    const input = wrapper.find('.lh-cascader__input-inner').element as HTMLInputElement
    expect(input.value).toBe('西湖')
    wrapper.destroy()
  })

  it('点击打开面板（挂到 body），渲染第一级', async () => {
    const wrapper = mount(LhCascader, { propsData: { options: OPTIONS }, attachToDocument: true })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const el = panel()
    expect(el).toBeTruthy()
    expect(el.closest('.lh-cascader')).toBeNull()
    expect(el.querySelectorAll('.lh-cascader-panel__column')).toHaveLength(1)
    expect(el.querySelectorAll('.lh-cascader-panel__item')).toHaveLength(2)
    wrapper.destroy()
  })

  it('点击非叶子节点展开下一级', async () => {
    const wrapper = mount(LhCascader, { propsData: { options: OPTIONS }, attachToDocument: true })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const columns = panel().querySelectorAll('.lh-cascader-panel__column')
    expect(columns).toHaveLength(2)
    // 第二级含杭州/宁波
    const level2 = columns[1].querySelectorAll('.lh-cascader-panel__item')
    expect(level2[0].textContent?.trim()).toBe('杭州')
    wrapper.destroy()
  })

  it('点击叶子节点触发 input/change 完整路径', async () => {
    const wrapper = mount(LhCascader, { propsData: { options: OPTIONS }, attachToDocument: true })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const level2 = panel().querySelectorAll('.lh-cascader-panel__column')[1]
    ;(level2.querySelectorAll('.lh-cascader-panel__item')[0] as HTMLElement).click()
    await flush()
    const level3 = panel().querySelectorAll('.lh-cascader-panel__column')[2]
    ;(level3.querySelector('.lh-cascader-panel__item') as HTMLElement).click()
    await flush()
    expect(wrapper.emitted('input')).toEqual([[['zhejiang', 'hangzhou', 'xihu']]])
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('emitPath=false 时仅 emit 末级值', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS, emitPath: false },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const level2 = panel().querySelectorAll('.lh-cascader-panel__column')[1]
    ;(level2.querySelectorAll('.lh-cascader-panel__item')[1] as HTMLElement).click()
    await flush()
    // emitPath=false 时值仍是数组形态（末级值包一层数组保持类型一致）
    expect(wrapper.emitted('input')).toEqual([[['ningbo']]])
    wrapper.destroy()
  })

  it('emitPath=false 选中嵌套节点后输入框同步末级文案', async () => {
    // 模拟 v-model 回写：组件 emit input → 父级 setProps value
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS, emitPath: false, showAllLevels: false },
      // 红线 #11：VTU v1 用 listeners 转发事件
      listeners: { input: (v: (string | number)[]) => wrapper.setProps({ value: v }) },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const level2 = panel().querySelectorAll('.lh-cascader-panel__column')[1]
    // 宁波是嵌套叶子节点：value 仅末级值 ['ningbo']，
    // 输入框须递归整棵树还原出「宁波」（findPathByValues 逐级下钻会落空）
    ;(level2.querySelectorAll('.lh-cascader-panel__item')[1] as HTMLElement).click()
    await flush()
    const input = wrapper.find('.lh-cascader__input-inner').element as HTMLInputElement
    expect(input.value).toBe('宁波')
    wrapper.destroy()
  })

  it('emitPath=false 受控末级值递归回显', () => {
    // showAllLevels 默认 true：即便 value 只是末级值，也要还原完整路径文案
    const wrapper = mount(LhCascader, {
      propsData: { value: ['xihu'], options: OPTIONS, emitPath: false },
    })
    const input = wrapper.find('.lh-cascader__input-inner').element as HTMLInputElement
    expect(input.value).toBe('浙江/杭州/西湖')
    wrapper.destroy()
  })

  it('checkStrictly 下点击未展开的父节点直接选中（不钻取）', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS, checkStrictly: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    // 浙江：有子节点且未展开——普通模式会展开，checkStrictly 应直接选中
    ;(items[0] as HTMLElement).click()
    await flush()
    expect(wrapper.emitted('input')).toEqual([[['zhejiang']]])
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('checkStrictly=false 时点击未展开父节点仍展开下级', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    expect(panel().querySelectorAll('.lh-cascader-panel__column')).toHaveLength(2)
    expect(wrapper.emitted('input')).toBeFalsy()
    wrapper.destroy()
  })

  it('disabled 选项不可选中', async () => {
    const wrapper = mount(LhCascader, { propsData: { options: OPTIONS }, attachToDocument: true })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    expect(items[1].className).toContain('lh-cascader-panel__item--disabled')
    ;(items[1] as HTMLElement).click()
    await flush()
    expect(wrapper.emitted('input')).toBeFalsy()
    wrapper.destroy()
  })

  it('clearable 时清空触发 input([])', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { value: ['zhejiang', 'ningbo'], options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader__clear').trigger('click')
    expect(wrapper.emitted('input')).toEqual([[[]]])
    expect(wrapper.emitted('change')).toEqual([[[], null]])
    wrapper.destroy()
  })

  it('filterable 搜索过滤结果', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS, filterable: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const input = wrapper.find('.lh-cascader__input-inner')
    await input.setValue('湖')
    await flush()
    const results = panel().querySelectorAll('.lh-cascader-panel__search-item')
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0].textContent).toContain('西湖')
    wrapper.destroy()
  })

  it('multiple 多选累积标签', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS, multiple: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const level2 = panel().querySelectorAll('.lh-cascader-panel__column')[1]
    ;(level2.querySelectorAll('.lh-cascader-panel__item')[1] as HTMLElement).click()
    await flush()
    const emitted = wrapper.emitted('input')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual(['ningbo'])
    // 多选不关闭面板
    expect(panel()).toBeTruthy()
    wrapper.destroy()
  })

  it('itemConfig 自定义键钻取并回显文案', async () => {
    // 自定义键：value→id、label→name、children→sub
    const CUSTOM = [
      {
        id: 'zhejiang',
        name: '浙江',
        sub: [{ id: 'hangzhou', name: '杭州', sub: [{ id: 'xihu', name: '西湖' }] }],
      },
    ]
    const wrapper = mount(LhCascader, {
      propsData: {
        options: CUSTOM,
        itemConfig: { value: 'id', label: 'name', children: 'sub' },
      },
      // 红线 #11：VTU v1 用 listeners 模拟 v-model 回写，否则受控值不更新
      listeners: { input: (v: (string | number)[]) => wrapper.setProps({ value: v }) },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    // 第一级按 name 渲染
    expect(panel().querySelector('.lh-cascader-panel__item-label')?.textContent?.trim()).toBe('浙江')
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const level2 = panel().querySelectorAll('.lh-cascader-panel__column')[1]
    ;(level2.querySelectorAll('.lh-cascader-panel__item')[0] as HTMLElement).click()
    await flush()
    const level3 = panel().querySelectorAll('.lh-cascader-panel__column')[2]
    ;(level3.querySelector('.lh-cascader-panel__item') as HTMLElement).click()
    await flush()
    // emit 的是自定义键里的 id
    expect(wrapper.emitted('input')).toEqual([[['zhejiang', 'hangzhou', 'xihu']]])
    const input = wrapper.find('.lh-cascader__input-inner').element as HTMLInputElement
    expect(input.value).toBe('浙江/杭州/西湖')
    wrapper.destroy()
  })

  it('itemConfig 自定义键下 filterable 搜索不崩溃且命中', async () => {
    const CUSTOM = [
      {
        id: 'zhejiang',
        name: '浙江',
        sub: [{ id: 'xihu', name: '西湖' }],
      },
    ]
    const wrapper = mount(LhCascader, {
      propsData: {
        options: CUSTOM,
        itemConfig: { value: 'id', label: 'name', children: 'sub' },
        filterable: true,
      },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    // 旧实现对裸 node.label 做 includes，自定义键节点 label 为 undefined 会崩溃
    await wrapper.find('.lh-cascader__input-inner').setValue('西湖')
    await flush()
    const results = panel().querySelectorAll('.lh-cascader-panel__search-item')
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0].textContent).toContain('西湖')
    wrapper.destroy()
  })

  it('emitPath=false 时搜索结果命中已有值高亮', async () => {
    const wrapper = mount(LhCascader, {
      propsData: {
        value: ['xihu'],
        options: OPTIONS,
        emitPath: false,
        filterable: true,
      },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    await wrapper.find('.lh-cascader__input-inner').setValue('西湖')
    await flush()
    // 旧实现把 props.value（末级）与完整路径直接比较，恒不命中
    const active = panel().querySelector('.lh-cascader-panel__search-item--active')
    expect(active).toBeTruthy()
    expect(active?.textContent).toContain('西湖')
    wrapper.destroy()
  })

  it('multiple 受控清空时标签同步消失', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { value: ['ningbo'], options: OPTIONS, multiple: true },
    })
    expect(wrapper.findAll('.lh-cascader__tag').length).toBe(1)
    // 旧 watch 的 length > 0 守卫会跳过空数组，标签残留
    await wrapper.setProps({ value: [] })
    expect(wrapper.findAll('.lh-cascader__tag').length).toBe(0)
    wrapper.destroy()
  })

  it('disabled 时禁止打开面板', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS, disabled: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  // ---------- 键盘 + 无障碍（Wave D） ----------

  it('触发器为 combobox 语义，aria-expanded 随面板开合变化', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    const input = wrapper.find('.lh-cascader__input-inner')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-haspopup')).toBe('menu')
    expect(input.attributes('aria-expanded')).toBe('false')

    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    // aria-controls 指向面板 id
    expect(input.attributes('aria-controls')).toBe(panel().id)
    wrapper.destroy()
  })

  it('面板为 menu 语义，列为 listbox，列项为 option', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    expect(panel().getAttribute('role')).toBe('menu')
    const column = panel().querySelector('.lh-cascader-panel__column')!
    expect(column.getAttribute('role')).toBe('listbox')
    expect(column.getAttribute('aria-label')).toBe('第 1 级')

    const item = column.querySelector('.lh-cascader-panel__item')!
    expect(item.getAttribute('role')).toBe('option')
    expect(item.getAttribute('aria-selected')).toBe('false')
    // disabled 项 tabindex=-1
    const items = column.querySelectorAll('.lh-cascader-panel__item')
    expect(items[1].getAttribute('tabindex')).toBe('-1')
    expect(items[1].getAttribute('aria-disabled')).toBe('true')
    wrapper.destroy()
  })

  it('roving tabindex：每列仅一个 option 可 Tab 进入', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    // 展开 浙江 后有两列，各列应各只有一个 tabindex=0
    const items = panel().querySelectorAll('.lh-cascader-panel__item')
    ;(items[0] as HTMLElement).click()
    await flush()
    const columns = panel().querySelectorAll('.lh-cascader-panel__column')
    expect(columns).toHaveLength(2)
    columns.forEach((col) => {
      const tabbable = [...col.querySelectorAll('.lh-cascader-panel__item')].filter(
        (el) => el.getAttribute('tabindex') === '0',
      )
      expect(tabbable).toHaveLength(1)
    })
    wrapper.destroy()
  })

  it('触发器 ArrowDown 打开面板并聚焦首列首项', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader__input-inner').trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(panel()).toBeTruthy()
    const first = panel()!.querySelector('.lh-cascader-panel__item')!
    expect(document.activeElement).toBe(first)
    wrapper.destroy()
  })

  it('列内上下方向键移动焦点，跳过禁用项', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const column = panel()!.querySelector('.lh-cascader-panel__column')!
    const [zhejiang, jiangsu] = [...column.querySelectorAll('.lh-cascader-panel__item')]

    // 浙江 ArrowDown：下一项江苏被禁用，不循环 → 焦点回落锚点（仍在浙江）
    zhejiang.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    expect(column.querySelector('[tabindex="0"]')).toBe(zhejiang)
    expect(jiangsu.getAttribute('tabindex')).toBe('-1')
    wrapper.destroy()
  })

  it('Enter 展开非叶子节点，焦点进入下一列', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const zhejiang = panel()!.querySelector('.lh-cascader-panel__item')!
    zhejiang.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    expect(panel()!.querySelectorAll('.lh-cascader-panel__column')).toHaveLength(2)
    const hangzhou = panel()!.querySelectorAll('.lh-cascader-panel__column')[1]
      .querySelector('.lh-cascader-panel__item')!
    expect(document.activeElement).toBe(hangzhou)
    wrapper.destroy()
  })

  it('ArrowRight 展开 / 跨列前进，ArrowLeft 回退', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const zhejiang = panel()!.querySelector('.lh-cascader-panel__item')!

    // ArrowRight 展开浙江，焦点进第二列
    zhejiang.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await flush()
    expect(panel()!.querySelectorAll('.lh-cascader-panel__column')).toHaveLength(2)
    const hangzhou = panel()!.querySelectorAll('.lh-cascader-panel__column')[1]
      .querySelector('.lh-cascader-panel__item')!
    expect(document.activeElement).toBe(hangzhou)

    // ArrowLeft 回到第一列
    hangzhou.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await flush()
    expect(document.activeElement).toBe(zhejiang)
    wrapper.destroy()
  })

  it('Enter 选中叶子节点触发 input 并关闭面板', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    // 展开 浙江
    const zhejiang = panel()!.querySelector('.lh-cascader-panel__item')!
    zhejiang.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await flush()
    // 选中 宁波（叶子）
    const ningbo = panel()!.querySelectorAll('.lh-cascader-panel__column')[1]
      .querySelectorAll('.lh-cascader-panel__item')[1]
    ningbo!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    expect(wrapper.emitted('input')).toEqual([[['zhejiang', 'ningbo']]])
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('Escape 关闭面板并把焦点还给输入框', async () => {
    const wrapper = mount(LhCascader, {
      propsData: { options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('.lh-cascader').trigger('click')
    await flush()
    const item = panel()!.querySelector('.lh-cascader-panel__item')!
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flush()
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('.lh-cascader__input-inner').element)
    wrapper.destroy()
  })
})

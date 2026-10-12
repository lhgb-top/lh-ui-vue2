import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhTimePicker from '../../src/components/time-picker'

const NOON = new Date(2026, 9, 15, 12, 30, 45)

/** 红线 #10：jsdom 里 Transition 的进入/离开靠定时器推进，nextTick 等不到 */
const flush = () => new Promise((r) => setTimeout(r, 150))

/** 拿到挂在 body 的面板 */
const panel = () => document.querySelector('.lh-time-picker__panel') as HTMLElement

describe('LhTimePicker', () => {
  it('渲染输入框与 placeholder 兜底', () => {
    const wrapper = mount(LhTimePicker)
    expect(wrapper.find('.lh-time-picker').exists()).toBe(true)
    // 默认占位走语言包 timepicker.placeholder（不再把格式 token 转义成「时:分:秒」）
    expect(wrapper.find('.lh-time-picker__input-inner').attributes('placeholder')).toBe('请选择时间')
    wrapper.destroy()
  })

  it('面板底部含「此刻 / 取消 / 确定」三个按钮，取消直接关闭面板', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await new Promise((r) => setTimeout(r, 150))
    const footer = document.querySelector('.lh-time-picker-panel__footer') as HTMLElement
    expect(footer).toBeTruthy()
    const buttons = footer.querySelectorAll('button')
    expect([...buttons].map((b) => (b as HTMLElement).textContent?.trim())).toEqual([
      '此刻',
      '取消',
      '确定',
    ])
    // 取消按钮：只关闭面板，不 emit
    ;(buttons[1] as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 150))
    expect(document.querySelector('.lh-time-picker-panel')).toBeNull()
    expect(wrapper.emitted('input')).toBeFalsy()
    wrapper.destroy()
  })

  it('受控 value 回显时间文本', () => {
    const wrapper = mount(LhTimePicker, { propsData: { value: NOON } })
    expect(wrapper.find('.lh-time-picker__value').text()).toBe('12:30:45')
    wrapper.destroy()
  })

  it('点击打开面板（挂到 body），含时分秒三列', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const el = panel()
    expect(el).toBeTruthy()
    expect(el.closest('.lh-time-picker')).toBeNull()
    expect(el.querySelectorAll('.lh-time-picker-panel__column')).toHaveLength(3)
    // 时列 24 项、分秒列 60 项
    const columns = el.querySelectorAll('.lh-time-picker-panel__column')
    expect(columns[0].querySelectorAll('.lh-time-picker-panel__column-item')).toHaveLength(24)
    expect(columns[1].querySelectorAll('.lh-time-picker-panel__column-item')).toHaveLength(60)
    wrapper.destroy()
  })

  it('format 不含 ss 时隐藏秒列', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { format: 'HH:mm' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel().querySelectorAll('.lh-time-picker-panel__column')).toHaveLength(2)
    wrapper.destroy()
  })

  it('点击时间项更新高亮，确定后触发 input/change', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const el = panel()
    const hourItems = el.querySelectorAll('.lh-time-picker-panel__column')[0]
    ;(hourItems.querySelectorAll('.lh-time-picker-panel__column-item')[8] as HTMLElement).click()
    await flush()
    expect(hourItems.querySelector('.lh-time-picker-panel__column-item--active')?.textContent?.trim()).toBe('08')

    const footer = el.querySelector('.lh-time-picker-panel__footer')!
    // 底部为「此刻 / 取消 / 确定」，按文案定位确定按钮
    const confirmBtn = [...footer.querySelectorAll('button')].find(
      (b) => (b as HTMLElement).textContent?.trim() === '确定',
    ) as HTMLElement
    confirmBtn.click()
    await flush()
    const emitted = wrapper.emitted('input')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBeInstanceOf(Date)
    expect((emitted![0][0] as Date).getHours()).toBe(8)
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('此刻按钮填入当前时间', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const el = panel()
    const footer = el.querySelector('.lh-time-picker-panel__footer')!
    ;(footer.querySelectorAll('button')[0] as HTMLElement).click()
    await flush()
    const active = el.querySelector('.lh-time-picker-panel__column-item--active')
    expect(active).toBeTruthy()
    wrapper.destroy()
  })

  it('clearable 时清空触发 input(null)', async () => {
    const wrapper = mount(LhTimePicker, { propsData: { value: NOON }, attachToDocument: true })
    await wrapper.find('.lh-time-picker__clear').trigger('click')
    expect(wrapper.emitted('input')).toEqual([[null]])
    expect(wrapper.emitted('change')).toEqual([[null]])
    wrapper.destroy()
  })

  it('步进为 2 时刻表按步长生成', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { stepHour: 2 },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const hourColumn = panel().querySelectorAll('.lh-time-picker-panel__column')[0]
    const items = hourColumn.querySelectorAll('.lh-time-picker-panel__column-item')
    expect(items).toHaveLength(12)
    expect(items[1].textContent?.trim()).toBe('02')
    wrapper.destroy()
  })

  it('arrowControl 时列头渲染上下箭头按钮', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { arrowControl: true },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel().querySelectorAll('.lh-time-picker-panel__arrow')).toHaveLength(6)
    wrapper.destroy()
  })

  it('disabled 时禁止打开面板', async () => {
    const wrapper = mount(LhTimePicker, { propsData: { disabled: true }, attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel()).toBeNull()
    expect(wrapper.find('.lh-time-picker--disabled').exists()).toBe(true)
    wrapper.destroy()
  })

  it('点击组件外部关闭面板', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel()).toBeTruthy()
    document.body.click()
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  // ============ 无障碍：触发器 / 面板 / 列语义 ============

  it('触发器带 combobox 语义与弹层 aria 三件套', () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    const trigger = wrapper.find('.lh-time-picker__input')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    // 收起时 aria-expanded 必须是显式 'false'（Vue2 会移除 false 值，故走 resolveAriaAttrs）
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-controls')).toBeTruthy()
    wrapper.destroy()
  })

  it('disabled 时触发器移出 tab 序列', () => {
    const wrapper = mount(LhTimePicker, { propsData: { disabled: true } })
    expect(wrapper.find('.lh-time-picker__input').attributes('tabindex')).toBe('-1')
    wrapper.destroy()
  })

  it('面板为 role=dialog 且与触发器 aria-controls 同 id', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const el = panel()
    expect(el.getAttribute('role')).toBe('dialog')
    expect(el.getAttribute('aria-label')).toBe('选择时间')
    const trigger = wrapper.find('.lh-time-picker__input')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(el.getAttribute('id'))
    wrapper.destroy()
  })

  it('时间列是 listbox，项是 option 且选中态可读', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const columns = panel().querySelectorAll('.lh-time-picker-panel__column-body')
    expect(columns[0].getAttribute('role')).toBe('listbox')
    expect(columns[0].getAttribute('aria-label')).toBe('小时')
    expect(columns[1].getAttribute('aria-label')).toBe('分钟')
    expect(columns[2].getAttribute('aria-label')).toBe('秒')
    const opt = columns[0].querySelector('.lh-time-picker-panel__column-item')!
    expect(opt.getAttribute('role')).toBe('option')
    // 无值打开时时列为 00，首项即激活：aria-selected 显式 'true'
    expect(opt.getAttribute('aria-selected')).toBe('true')
    // 非激活项显式 'false'（Vue2 会移除 false 值，这里验证 resolveAriaAttrs 已转字符串）
    const inactive = columns[0].querySelectorAll('.lh-time-picker-panel__column-item')[1]!
    expect(inactive.getAttribute('aria-selected')).toBe('false')
    wrapper.destroy()
  })

  it('列 body 在 tab 序列且 aria-activedescendant 指向激活项', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { value: NOON },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const columns = panel().querySelectorAll('.lh-time-picker-panel__column-body')
    // 三列 body 各是独立 tab 落点（listbox 本体可聚焦，option 不进 tab 序列）
    expect(columns[0].getAttribute('tabindex')).toBe('0')
    expect(columns[1].getAttribute('tabindex')).toBe('0')
    expect(columns[2].getAttribute('tabindex')).toBe('0')
    // activedescendant 与激活项 id 同构
    const hourActive = columns[0].getAttribute('aria-activedescendant')
    expect(hourActive).toBe(`${panel().id}-hour-12`)
    expect(columns[0].querySelector(`#${hourActive}`)?.textContent?.trim()).toBe('12')
    expect(columns[1].getAttribute('aria-activedescendant')).toBe(`${panel().id}-minute-30`)
    expect(columns[2].getAttribute('aria-activedescendant')).toBe(`${panel().id}-second-45`)
    // option 自身不在 tab 序列
    const opt = columns[0].querySelector('.lh-time-picker-panel__column-item')!
    expect(opt.getAttribute('tabindex')).toBeNull()
    wrapper.destroy()
  })

  // ============ 键盘 ============

  it('触发器 Enter 打开面板', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('keydown', { key: 'Enter' })
    await flush()
    expect(panel()).toBeTruthy()
    wrapper.destroy()
  })

  it('面板打开时 Escape 关闭', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel()).toBeTruthy()
    await wrapper.find('.lh-time-picker__input').trigger('keydown', { key: 'Escape' })
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('触发器 ArrowDown 打开面板并聚焦时列', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(panel()).toBeTruthy()
    const hourBody = panel().querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    expect(document.activeElement).toBe(hourBody)
    wrapper.destroy()
  })

  it('下箭头按步进递增时列，上箭头递减', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    const active = () =>
      hourBody.querySelector('.lh-time-picker-panel__column-item--active')?.textContent?.trim()
    expect(active()).toBe('00')
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    expect(active()).toBe('01')
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await flush()
    expect(active()).toBe('00')
    wrapper.destroy()
  })

  it('时列步进为 2 时方向键按 2 递增', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { stepHour: 2 },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    const active = () =>
      hourBody.querySelector('.lh-time-picker-panel__column-item--active')?.textContent?.trim()
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    expect(active()).toBe('02')
    wrapper.destroy()
  })

  it('方向键在时列循环：23 下一步回 00', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { value: new Date(2026, 9, 15, 23, 0, 0) },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    const active = () =>
      hourBody.querySelector('.lh-time-picker-panel__column-item--active')?.textContent?.trim()
    expect(active()).toBe('23')
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    expect(active()).toBe('00')
    wrapper.destroy()
  })

  it('左右方向键在时/分/秒列之间跳焦', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel().querySelectorAll('.lh-time-picker-panel__column-body')).toHaveLength(3)

    // 面板在 Transition 内，状态变更会重建节点：每次断言前重新查询（红线 #10）
    const body = (i: number) =>
      panel().querySelectorAll('.lh-time-picker-panel__column-body')[i] as HTMLElement

    // 每步都在「当前真正聚焦的列」上派发，与真实浏览器的键事件来源一致
    // 时列 ArrowRight → 分列
    body(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(1))

    // 分列 ArrowRight → 秒列
    body(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(2))

    // 秒列 ArrowRight 越界：焦点留原处
    body(2).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(2))

    // 秒列 ArrowLeft → 分列
    body(2).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(1))

    // 分列 ArrowLeft → 时列
    body(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(0))

    // 时列 ArrowLeft 越界：焦点留原处
    body(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(0))
    wrapper.destroy()
  })

  it('HH:mm 格式只有两列，秒列不渲染', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { format: 'HH:mm' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    expect(panel().querySelectorAll('.lh-time-picker-panel__column-body')).toHaveLength(2)
    const body = (i: number) =>
      panel().querySelectorAll('.lh-time-picker-panel__column-body')[i] as HTMLElement
    // 先聚焦分列，「越界不动」才有可比对象
    body(1).focus()
    // 分列 ArrowRight 越界不动
    body(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(1))
    wrapper.destroy()
  })

  it('Enter 确认键盘改动的时刻，关闭面板并把焦点还给触发器', async () => {
    const wrapper = mount(LhTimePicker, {
      propsData: { value: new Date(2026, 9, 15, 10, 0, 0) },
      attachToDocument: true,
    })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    expect(wrapper.emitted('input')![0][0] as Date).toEqual(new Date(2026, 9, 15, 11, 0, 0))
    expect(wrapper.emitted('change')![0][0] as Date).toEqual(new Date(2026, 9, 15, 11, 0, 0))
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('.lh-time-picker__input').element)
    wrapper.destroy()
  })

  it('面板内 Escape 关闭并把焦点还给触发器', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flush()
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('.lh-time-picker__input').element)
    wrapper.destroy()
  })

  it('方向键移动后确定，提交的是键盘改动的时刻', async () => {
    const wrapper = mount(LhTimePicker, { attachToDocument: true })
    await wrapper.find('.lh-time-picker__input').trigger('click')
    await flush()
    const el = panel()
    const hourBody = el.querySelectorAll('.lh-time-picker-panel__column-body')[0]!
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    const footer = el.querySelector('.lh-time-picker-panel__footer')!
    const confirmBtn = [...footer.querySelectorAll('button')].find(
      (b) => (b as HTMLElement).textContent?.trim() === '确定',
    ) as HTMLElement
    confirmBtn.click()
    await flush()
    const val = wrapper.emitted('input')![0][0] as Date
    expect(val.getHours()).toBe(2)
    wrapper.destroy()
  })
})

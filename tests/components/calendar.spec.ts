import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhCalendar from '../../src/components/calendar'

const TODAY = new Date(2026, 9, 3)

describe('LhCalendar', () => {
  it('渲染常驻面板与星期表头', () => {
    const wrapper = mount(LhCalendar)
    expect(wrapper.find('.lh-calendar').exists()).toBe(true)
    // 7 个星期文案
    expect(wrapper.findAll('.lh-calendar__weekday')).toHaveLength(7)
    // 表头行 + 数据周行（35 或 42 格，即 5 或 6 周）
    const dataRows = wrapper.findAll('.lh-calendar__row').length - 1
    expect([5, 6]).toContain(dataRows)
    expect(wrapper.findAll('.lh-calendar__cell').length).toBe(dataRows * 7)
    wrapper.destroy()
  })

  it('点击日期触发 input/change（单选 v-model）', async () => {
    const wrapper = mount(LhCalendar)
    // :not() 排除上下月填充格，点当月第一个
    const currentMonthCell = wrapper.find('.lh-calendar__cell:not(.lh-calendar__cell--outside)')
    await currentMonthCell.trigger('click')
    const emitted = wrapper.emitted('input')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBeInstanceOf(Date)
    expect(wrapper.emitted('change')).toBeTruthy()
    wrapper.destroy()
  })

  it('受控 value 高亮选中态', () => {
    const wrapper = mount(LhCalendar, { propsData: { value: TODAY } })
    const selected = wrapper.find('.lh-calendar__cell--selected')
    expect(selected.exists()).toBe(true)
    expect(selected.attributes('aria-selected')).toBe('true')
    wrapper.destroy()
  })

  it('range 模式：两次点击产出起止时间段', async () => {
    const wrapper = mount(LhCalendar, { propsData: { selection: 'range' } })
    const currentMonth = wrapper.findAll('.lh-calendar__cell:not(.lh-calendar__cell--outside)')
    await currentMonth.at(0)!.trigger('click')
    await currentMonth.at(2)!.trigger('click')
    const emitted = wrapper.emitted('input')
    expect(emitted).toBeTruthy()
    const value = emitted![1][0] as Date[]
    expect(value).toHaveLength(2)
    // 起止归一：前小后大
    expect(value[0].getTime()).toBeLessThanOrEqual(value[1].getTime())
    // 中间格落入 in-range
    expect(wrapper.find('.lh-calendar__cell--in-range').exists()).toBe(true)
    wrapper.destroy()
  })

  it('multiple 模式：点击切换多选', async () => {
    const wrapper = mount(LhCalendar, { propsData: { selection: 'multiple' } })
    const currentMonth = wrapper.findAll('.lh-calendar__cell:not(.lh-calendar__cell--outside)')
    await currentMonth.at(0)!.trigger('click')
    await currentMonth.at(1)!.trigger('click')
    const emitted = wrapper.emitted('input')
    expect((emitted![1][0] as Date[])).toHaveLength(2)
    // 再点同一格取消
    await currentMonth.at(0)!.trigger('click')
    const last = wrapper.emitted('input')!
    expect((last[last.length - 1][0] as Date[])).toHaveLength(1)
    wrapper.destroy()
  })

  it('range 约束外的日期禁用', () => {
    const wrapper = mount(LhCalendar, {
      propsData: { range: [new Date(2026, 9, 10), new Date(2026, 9, 20)] },
    })
    const disabled = wrapper.find('.lh-calendar__cell--outside')
    // 上下月填充格一定在约束外
    expect(disabled.attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })

  it('月份导航按钮平移面板', async () => {
    const wrapper = mount(LhCalendar)
    const titleBefore = wrapper.find('.lh-calendar__title').text()
    const navButtons = wrapper.findAll('.lh-calendar__nav')
    await navButtons.at(1)!.trigger('click')
    expect(wrapper.find('.lh-calendar__title').text()).not.toBe(titleBefore)
    wrapper.destroy()
  })

  it('input 模式：点击输入框展开/收起', async () => {
    const wrapper = mount(LhCalendar, { propsData: { mode: 'input' }, attachToDocument: true })
    const input = wrapper.find('.lh-calendar__input')
    expect(wrapper.find('.lh-calendar__panels').isVisible()).toBe(false)
    await input.trigger('click')
    expect(wrapper.find('.lh-calendar__panels').isVisible()).toBe(true)
    await input.trigger('click')
    expect(wrapper.find('.lh-calendar__panels').isVisible()).toBe(false)
    wrapper.destroy()
  })

  it('多面板：panels 控制并列月数', () => {
    const wrapper = mount(LhCalendar, { propsData: { panels: 2 } })
    expect(wrapper.findAll('.lh-calendar__panel')).toHaveLength(2)
    wrapper.destroy()
  })

  it('cell 插槽自定义单元格内容', () => {
    const wrapper = mount(LhCalendar, {
      scopedSlots: {
        cell: '<span class="my-cell" slot-scope="{ date }">{{ date.getDate() }}号</span>',
      },
    })
    expect(wrapper.find('.my-cell').exists()).toBe(true)
    wrapper.destroy()
  })
})

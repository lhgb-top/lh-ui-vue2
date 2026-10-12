import { describe, expect, it } from 'vitest'
import { mountComp as mount } from '../helpers'
import LhDatePicker from '../../src/components/date-picker'

const FIXED = new Date(2026, 9, 15)

/** 红线 #10：jsdom 里 Transition 的进入/离开靠 rAF/定时器推进，nextTick 等不到 */
const flush = () => new Promise((r) => setTimeout(r, 150))

/** 拿到挂在 body 的面板（面板被移出组件子树，必须走 document） */
const panel = () => document.querySelector('.lh-date-picker__panel') as HTMLElement

describe('LhDatePicker', () => {
  it('渲染输入框与 placeholder 兜底', () => {
    const wrapper = mount(LhDatePicker)
    expect(wrapper.find('.lh-date-picker').exists()).toBe(true)
    // 默认占位走语言包 datepicker.placeholder（不再把格式 token 转义成「年-月-日」）
    expect(wrapper.find('.lh-date-picker__input-inner').attributes('placeholder')).toBe('请选择日期')
    // 显式 placeholder 优先
    const withProp = mount(LhDatePicker, { propsData: { placeholder: '选个日子' } })
    expect(withProp.find('.lh-date-picker__input-inner').attributes('placeholder')).toBe('选个日子')
    wrapper.destroy()
    withProp.destroy()
  })

  it('受控 value 回显格式化文本', () => {
    const wrapper = mount(LhDatePicker, { propsData: { value: FIXED } })
    expect(wrapper.find('.lh-date-picker__value').text()).toBe('2026-10-15')
    wrapper.destroy()
  })

  it('点击打开面板（挂到 body，移出组件子树）', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const el = panel()
    expect(el).toBeTruthy()
    // host 已被移到 body，面板不在组件 $el 子树内
    expect(el.closest('.lh-date-picker')).toBeNull()
    expect(el.querySelectorAll('.lh-date-picker-panel__day').length).toBeGreaterThanOrEqual(35)
    wrapper.destroy()
  })

  it('点今天再确定触发 input/change 并关闭', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const footer = panel().querySelector('.lh-date-picker-panel__footer')!
    const buttons = footer.querySelectorAll('button')
    ;(buttons[0] as HTMLElement).click()
    await flush()
    ;(buttons[1] as HTMLElement).click()
    await flush()
    const emitted = wrapper.emitted('input')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBeInstanceOf(Date)
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('clearable 时清空触发 input(null)', async () => {
    const wrapper = mount(LhDatePicker, { propsData: { value: FIXED }, attachToDocument: true })
    await wrapper.find('.lh-date-picker__clear').trigger('click')
    expect(wrapper.emitted('input')).toEqual([[null]])
    expect(wrapper.emitted('change')).toEqual([[null]])
    wrapper.destroy()
  })

  it('标题点击逐级下钻：日期 → 月份 → 年份', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const el = panel()
    const title = el.querySelector('.lh-date-picker-panel__title-text') as HTMLElement
    expect(el.querySelector('.lh-date-picker-panel__days')).toBeTruthy()

    title.click()
    await flush()
    expect(el.querySelector('.lh-date-picker-panel__month-grid')).toBeTruthy()

    title.click()
    await flush()
    expect(el.querySelector('.lh-date-picker-panel__year-grid')).toBeTruthy()
    wrapper.destroy()
  })

  it('上一月/下一月切换日历', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const el = panel()
    const title = el.querySelector('.lh-date-picker-panel__title-text') as HTMLElement
    const before = title.textContent
    const btns = el.querySelectorAll('.lh-date-picker-panel__btn')
    ;(btns[1] as HTMLElement).click()
    await flush()
    expect(title.textContent).not.toBe(before)
    wrapper.destroy()
  })

  it('month 模式：点月份即选中并关闭', async () => {
    const wrapper = mount(LhDatePicker, { propsData: { mode: 'month' }, attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const cells = panel().querySelectorAll('.lh-date-picker-panel__month-cell')
    ;(cells[3] as HTMLElement).click()
    await flush()
    const emitted = wrapper.emitted('input')
    expect(emitted![0][0]).toBeInstanceOf(Date)
    expect((emitted![0][0] as Date).getMonth()).toBe(3)
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('year 模式：点年份即选中', async () => {
    const wrapper = mount(LhDatePicker, { propsData: { mode: 'year' }, attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const cell = panel().querySelector('.lh-date-picker-panel__year-cell') as HTMLElement
    cell.click()
    await flush()
    const emitted = wrapper.emitted('input')
    expect(emitted![0][0]).toBeInstanceOf(Date)
    wrapper.destroy()
  })

  it('disabled 时禁止打开面板', async () => {
    const wrapper = mount(LhDatePicker, { propsData: { disabled: true }, attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    expect(panel()).toBeNull()
    expect(wrapper.find('.lh-date-picker--disabled').exists()).toBe(true)
    wrapper.destroy()
  })

  it('点击组件外部关闭面板', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    expect(panel()).toBeTruthy()
    document.body.click()
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  /** 点本月某号（避开上下月填充格） */
  function clickDay(dayNum: number) {
    const cells = Array.from(panel().querySelectorAll('.lh-date-picker-panel__day'))
    const cell = cells.find(
      (c) => c.textContent?.trim() === String(dayNum) && !c.className.includes('--other'),
    )
    ;(cell as HTMLElement).click()
  }

  /** 点时间列某项（列序：时、分、秒） */
  function clickTimeItem(colIndex: number, text: string) {
    const columns = panel().querySelectorAll('.lh-date-picker-panel__time-column')
    const items = Array.from(columns[colIndex].querySelectorAll('.lh-date-picker-panel__time-item'))
    ;(items.find((i) => i.textContent?.trim() === text) as HTMLElement).click()
  }

  it('datetime 选日期保留已有时刻', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { value: new Date(2026, 9, 15, 14, 30, 45), mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    // 面板带时间列
    expect(panel().querySelectorAll('.lh-date-picker-panel__time-column').length).toBe(3)
    // 旧值时刻应被还原到时间列
    const activeHours = Array.from(
      panel().querySelectorAll('.lh-date-picker-panel__time-item--active'),
    )
    expect(activeHours[0].textContent?.trim()).toBe('14')
    clickDay(10)
    await flush()
    const footer = panel().querySelector('.lh-date-picker-panel__footer')!
    ;(footer.querySelectorAll('button')[1] as HTMLElement).click()
    await flush()
    const emitted = wrapper.emitted('input')!
    const val = emitted[0][0] as Date
    expect(val.getDate()).toBe(10)
    // 时刻保留，不被日历格子的 00:00 覆盖
    expect(val.getHours()).toBe(14)
    expect(val.getMinutes()).toBe(30)
    expect(val.getSeconds()).toBe(45)
    wrapper.destroy()
  })

  it('datetime 先选日期再改时间，确认时合并新时刻', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    clickDay(15)
    await flush()
    // 选完日期后改时间列
    clickTimeItem(0, '08')
    clickTimeItem(1, '30')
    await flush()
    const footer = panel().querySelector('.lh-date-picker-panel__footer')!
    ;(footer.querySelectorAll('button')[1] as HTMLElement).click()
    await flush()
    const val = wrapper.emitted('input')![0][0] as Date
    expect(val.getDate()).toBe(15)
    expect(val.getHours()).toBe(8)
    expect(val.getMinutes()).toBe(30)
    wrapper.destroy()
  })

  it('range 两段式选择：归一化区间并高亮中间日', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { mode: 'range' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    // 第一次点击：落锚点（起点高亮，尚无区间）
    clickDay(20)
    await flush()
    expect(panel().querySelector('.lh-date-picker-panel--start')).toBeTruthy()
    expect(panel().querySelector('.lh-date-picker-panel--in-range')).toBeNull()
    // 第二次点击（故意反序）：归一化为有序区间
    clickDay(10)
    await flush()
    expect(panel().querySelectorAll('.lh-date-picker-panel--in-range').length).toBe(9)
    const footer = panel().querySelector('.lh-date-picker-panel__footer')!
    ;(footer.querySelectorAll('button')[1] as HTMLElement).click()
    await flush()
    const val = wrapper.emitted('input')![0][0] as [Date, Date]
    expect(Array.isArray(val)).toBe(true)
    expect(val[0].getDate()).toBe(10)
    expect(val[1].getDate()).toBe(20)
    wrapper.destroy()
  })

  it('range 未选择直接确定不吞值', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { mode: 'range' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const footer = panel().querySelector('.lh-date-picker-panel__footer')!
    ;(footer.querySelectorAll('button')[1] as HTMLElement).click()
    await flush()
    // 空选只关闭面板，不 emit 空值
    expect(wrapper.emitted('input')).toBeFalsy()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  it('cellClassName 给日期单元格附加自定义类名', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: {
        value: FIXED,
        cellClassName: (date: Date) => (date.getDay() === 0 ? 'is-sunday' : ''),
      },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const sundays = panel().querySelectorAll('.is-sunday')
    // 2026-10 的面板含上下月填充日：9/27、10/4、10/11、10/18、10/25 共 5 个周日
    expect(sundays.length).toBe(5)
    // 自定义类名与内置类名共存
    expect(sundays[0].classList.contains('lh-date-picker-panel__day')).toBe(true)
    wrapper.destroy()
  })

  it('popperClass 附加到面板容器', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { popperClass: 'my-popper' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    expect(panel().classList.contains('my-popper')).toBe(true)
    wrapper.destroy()
  })

  // ============ 无障碍：触发器 / 面板语义 ============

  it('触发器带 combobox 语义与弹层 aria 三件套', () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    const trigger = wrapper.find('.lh-date-picker__input')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    // 收起时 aria-expanded 必须是显式 'false'（Vue2 会移除 false 值，故走 resolveAriaAttrs）
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-controls')).toBeTruthy()
    wrapper.destroy()
  })

  it('disabled 时触发器移出 tab 序列', () => {
    const wrapper = mount(LhDatePicker, { propsData: { disabled: true } })
    expect(wrapper.find('.lh-date-picker__input').attributes('tabindex')).toBe('-1')
    wrapper.destroy()
  })

  it('面板为 role=dialog 且与触发器 aria-controls 同 id', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const el = panel()
    expect(el.getAttribute('role')).toBe('dialog')
    expect(el.getAttribute('aria-label')).toBe('选择日期')
    const trigger = wrapper.find('.lh-date-picker__input')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(el.getAttribute('id'))
    wrapper.destroy()
  })

  it('日期网格是 grid/row/gridcell 三层结构', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { value: FIXED },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const grid = panel().querySelector('.lh-date-picker-panel__days')!
    expect(grid.getAttribute('role')).toBe('grid')
    const rows = grid.querySelectorAll('[role="row"]')
    expect(rows.length).toBeGreaterThanOrEqual(5)
    const cells = grid.querySelectorAll('[role="gridcell"]')
    expect(cells.length).toBeGreaterThanOrEqual(35)
    // 选中日 / 今日带语义标记
    const selected = grid.querySelector('.lh-date-picker-panel--selected') as HTMLElement
    expect(selected.getAttribute('aria-selected')).toBe('true')
    const todayCell = grid.querySelector('.lh-date-picker-panel--today') as HTMLElement
    expect(todayCell.getAttribute('aria-current')).toBe('date')
    // 格子有完整日期可读文案
    expect(todayCell.getAttribute('aria-label')).toMatch(/\d{4}年\d+月\d+日/)
    wrapper.destroy()
  })

  it('roving tabindex：只有锚点格可 Tab 进入', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const cells = Array.from(panel().querySelectorAll('[role="gridcell"]'))
    const tabbable = cells.filter((c) => c.getAttribute('tabindex') === '0')
    expect(tabbable.length).toBe(1)
    // 无值时锚点是今日
    expect((tabbable[0] as HTMLElement).className).toContain('lh-date-picker-panel--today')
    wrapper.destroy()
  })

  it('有值时锚点落在选中日', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { value: FIXED },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const tabbable = panel().querySelector('[role="gridcell"][tabindex="0"]') as HTMLElement
    expect(tabbable.className).toContain('lh-date-picker-panel--selected')
    wrapper.destroy()
  })

  // ============ 键盘：触发器 ============

  it('触发器 Enter 打开面板', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('keydown', { key: 'Enter' })
    await flush()
    expect(panel()).toBeTruthy()
    wrapper.destroy()
  })

  it('面板打开时 Escape 关闭', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    expect(panel()).toBeTruthy()
    await wrapper.find('.lh-date-picker__input').trigger('keydown', { key: 'Escape' })
    await flush()
    expect(panel()).toBeNull()
    wrapper.destroy()
  })

  // ============ 键盘：日期网格 ============

  /** 当前聚焦格 */
  const focusedDay = () =>
    panel().querySelector('[role="gridcell"][tabindex="0"]') as HTMLElement

  it('方向键在网格内移动焦点', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const before = focusedDay().getAttribute('aria-label')
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await flush()
    const after = focusedDay().getAttribute('aria-label')
    expect(after).not.toBe(before)
    // 仍在同一月（横向移动优先在行内 / 行间流动，不翻月）
    expect(panel().querySelectorAll('[role="gridcell"][tabindex="0"]').length).toBe(1)
    wrapper.destroy()
  })

  it('Enter 选中聚焦日', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const target = focusedDay()
    const label = target.getAttribute('aria-label')!
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    // 选中的日子高亮，且可读文案就是聚焦前那一格
    const selected = panel().querySelector('.lh-date-picker-panel--selected') as HTMLElement
    expect(selected.getAttribute('aria-label')).toBe(label)
    wrapper.destroy()
  })

  it('Home / End 走行内语义，行首左溢出翻月', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    // 先跳到月中某格（用一次 ArrowRight 确保锚点不在行首）
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await flush()

    // End 落行末、Home 落行首，行内往返对称
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await flush()
    const endLabel = focusedDay().getAttribute('aria-label')
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await flush()
    const homeLabel = focusedDay().getAttribute('aria-label')
    expect(homeLabel).not.toBe(endLabel)
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await flush()
    expect(focusedDay().getAttribute('aria-label')).toBe(endLabel)

    // 连续 ArrowLeft 走到网格首格后左溢出 → 翻到上个月（不依赖「今日在第几行」）
    const before = panel().querySelector('.lh-date-picker-panel__title-text')!.textContent
    for (let i = 0; i < 42 && panel()!.querySelector('.lh-date-picker-panel__title-text')!.textContent === before; i += 1) {
      focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      await flush()
    }
    expect(panel().querySelector('.lh-date-picker-panel__title-text')!.textContent).not.toBe(before)
    wrapper.destroy()
  })

  it('PageUp / PageDown 翻月', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const title = () => panel().querySelector('.lh-date-picker-panel__title-text')!.textContent
    const before = title()
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))
    await flush()
    expect(title()).not.toBe(before)
    focusedDay().dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }))
    await flush()
    expect(title()).toBe(before)
    wrapper.destroy()
  })

  it('月份 / 年份视图也是可键盘导航的 grid', async () => {
    const wrapper = mount(LhDatePicker, { attachToDocument: true })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const title = panel().querySelector('.lh-date-picker-panel__title-text') as HTMLElement
    title.click()
    await flush()

    const mgrid = panel().querySelector('.lh-date-picker-panel__month-grid')!
    expect(mgrid.getAttribute('role')).toBe('grid')
    expect(mgrid.querySelectorAll('[role="gridcell"]').length).toBe(12)
    const mTabbable = Array.from(mgrid.querySelectorAll('[role="gridcell"]')).filter(
      (c) => c.getAttribute('tabindex') === '0',
    )
    expect(mTabbable.length).toBe(1)
    // 月份方向键移动
    const mBefore = (mTabbable[0] as HTMLElement).textContent
    ;(mTabbable[0] as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    )
    await flush()
    const mAfter = (
      panel().querySelector('.lh-date-picker-panel__month-grid [tabindex="0"]') as HTMLElement
    ).textContent
    expect(mAfter).not.toBe(mBefore)

    // 年份视图
    title.click()
    await flush()
    const ygrid = panel().querySelector('.lh-date-picker-panel__year-grid')!
    expect(ygrid.getAttribute('role')).toBe('grid')
    expect(ygrid.querySelectorAll('[role="gridcell"]').length).toBe(12)
    wrapper.destroy()
  })

  it('datetime 时间列是 listbox / option', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    // listbox 语义落在 body 上：标题不能作 listbox 的非法子项
    const body = panel().querySelector('.lh-date-picker-panel__time-body')!
    expect(body.getAttribute('role')).toBe('listbox')
    expect(body.getAttribute('tabindex')).toBe('0')
    const opt = body.querySelector('.lh-date-picker-panel__time-item')!
    expect(opt.getAttribute('role')).toBe('option')
    wrapper.destroy()
  })

  it('datetime 时间列 aria-activedescendant 指向激活项', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { value: new Date(2026, 9, 15, 14, 30, 45), mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const bodies = panel().querySelectorAll('.lh-date-picker-panel__time-body')
    const pid = panel().getAttribute('id')
    expect(bodies[0].getAttribute('aria-activedescendant')).toBe(`${pid}-hour-14`)
    expect(bodies[1].getAttribute('aria-activedescendant')).toBe(`${pid}-minute-30`)
    expect(bodies[2].getAttribute('aria-activedescendant')).toBe(`${pid}-second-45`)
    // 激活项 id 真实存在
    expect(panel().querySelector(`#${pid}-hour-14`)).toBeTruthy()
    wrapper.destroy()
  })

  it('datetime 时间列上下方向键步进时刻', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { value: new Date(2026, 9, 15, 14, 30, 45), mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const body = (i: number) =>
      panel().querySelectorAll('.lh-date-picker-panel__time-body')[i] as HTMLElement
    const activeOf = (i: number) =>
      body(i)
        .querySelector('.lh-date-picker-panel__time-item--active')
        ?.textContent?.trim()
    expect(activeOf(0)).toBe('14')
    body(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await flush()
    expect(activeOf(0)).toBe('15')
    body(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await flush()
    expect(activeOf(0)).toBe('14')
    wrapper.destroy()
  })

  it('datetime 时间列左右方向键跨列跳焦，首末列越界不动', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const body = (i: number) =>
      panel().querySelectorAll('.lh-date-picker-panel__time-body')[i] as HTMLElement
    // 每步都在当前聚焦列上派发，与真实键事件来源一致
    body(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(1))
    body(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(2))
    // 秒列 ArrowRight 越界：留原处
    body(2).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(2))
    body(2).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(1))
    body(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(0))
    // 时列 ArrowLeft 越界：留原处
    body(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(body(0))
    wrapper.destroy()
  })

  it('datetime 时间列 Enter 确认并归还焦点，Escape 关闭并归还焦点', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { value: new Date(2026, 9, 15, 14, 30, 45), mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelector('.lh-date-picker-panel__time-body') as HTMLElement
    // Enter 直接确认当前时刻
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    const val = wrapper.emitted('input')![0][0] as Date
    expect(val.getHours()).toBe(14)
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('.lh-date-picker__input').element)
    wrapper.destroy()
  })

  it('datetime 时间列 Escape 关闭面板并把焦点还给触发器', async () => {
    const wrapper = mount(LhDatePicker, {
      propsData: { mode: 'datetime' },
      attachToDocument: true,
    })
    await wrapper.find('.lh-date-picker__input').trigger('click')
    await flush()
    const hourBody = panel().querySelector('.lh-date-picker-panel__time-body') as HTMLElement
    hourBody.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flush()
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('.lh-date-picker__input').element)
    wrapper.destroy()
  })
})

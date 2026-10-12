import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhSlider from '../../src/components/slider'

describe('LhSlider Component', () => {
  it('should render', () => {
    const wrapper = mount(LhSlider)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render with disabled class', () => {
    const wrapper = mount(LhSlider, {
      propsData: { disabled: true },
    })
    expect(wrapper.classes()).toContain('lh-slider--disabled')
  })

  it('should render with range class', () => {
    const wrapper = mount(LhSlider, {
      propsData: { range: true, modelValue: [0, 50] },
    })
    expect(wrapper.classes()).toContain('lh-slider--range')
  })

  it('should render two buttons in range mode', () => {
    const wrapper = mount(LhSlider, {
      propsData: { range: true, modelValue: [0, 50] },
    })
    const buttons = wrapper.findAll('.lh-slider__button-wrapper')
    expect(buttons.length).toBe(2)
  })

  it('should render one button in single mode', () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 50 },
    })
    const buttons = wrapper.findAll('.lh-slider__button-wrapper')
    expect(buttons.length).toBe(1)
  })

  it('should render marks when provided', () => {
    const wrapper = mount(LhSlider, {
      propsData: { marks: { 0: 'Low', 50: 'Mid', 100: 'High' } },
    })
    expect(wrapper.find('.lh-slider__marks').exists()).toBe(true)
  })

  it('should not render marks when not provided', () => {
    const wrapper = mount(LhSlider, {
      propsData: {},
    })
    expect(wrapper.find('.lh-slider__marks').exists()).toBe(false)
  })

  it('should render input when showInput is true', () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 50, showInput: true },
    })
    expect(wrapper.find('.lh-slider__input').exists()).toBe(true)
  })

  it('should responsive to size change', () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 50, size: 'small' },
    })
    expect(wrapper.classes()).toContain('lh-slider--small')
  })

  it('should initialize local value from modelValue', () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: [20, 80], range: true },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.lh-slider__button-wrapper').exists()).toBe(true)
  })

  it('should not be draggable when disabled', () => {
    const wrapper = mount(LhSlider, {
      propsData: { disabled: true },
    })
    expect(wrapper.classes()).toContain('lh-slider--disabled')
  })

  it('renders progress bar from track start for single value (regression)', async () => {
    // 回归：单值模式的 bar 曾按 [v, v] 双端公式计算，宽度恒为 0
    const wrapper = mount(LhSlider, { propsData: { modelValue: 40, min: 0, max: 100 } })
    await wrapper.vm.$nextTick()
    const bar = wrapper.find('.lh-slider__bar')
    expect(bar.attributes('style')).toContain('left: 0%')
    expect(bar.attributes('style')).toContain('width: 40%')
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhSlider, { propsData: { sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })

  // —— 键盘 + 无障碍（WAI-ARIA slider 模式） ——

  it('exposes role="slider" and the value aria attrs on the thumb', () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 40, min: 0, max: 100, step: 10 },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')
    expect(thumb.attributes('role')).toBe('slider')
    expect(thumb.attributes('aria-valuenow')).toBe('40')
    expect(thumb.attributes('aria-valuemin')).toBe('0')
    expect(thumb.attributes('aria-valuemax')).toBe('100')
    expect(thumb.attributes('aria-valuetext')).toBe('40')
    expect(thumb.attributes('aria-orientation')).toBe('horizontal')
    expect(thumb.attributes('aria-label')).toBe('滑块')
  })

  it('is focusable (tabindex=0) when enabled and removed from tab order when disabled', () => {
    const enabled = mount(LhSlider, { propsData: { modelValue: 40 } })
    expect(enabled.find('.lh-slider__button-wrapper').attributes('tabindex')).toBe('0')

    const disabled = mount(LhSlider, { propsData: { modelValue: 40, disabled: true } })
    const thumb = disabled.find('.lh-slider__button-wrapper')
    expect(thumb.attributes('tabindex')).toBe('-1')
    expect(thumb.attributes('aria-disabled')).toBe('true')
  })

  it('moves by step on ArrowRight / ArrowLeft and emits input + change', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 30, min: 0, max: 100, step: 10 },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(40)
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(40)
    expect(thumb.attributes('aria-valuenow')).toBe('40')

    await thumb.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(30)
    expect(thumb.attributes('aria-valuenow')).toBe('30')
  })

  it('clamps at the borders and does not wrap around', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 0, min: 0, max: 100, step: 10 },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')

    // 已在最小值：再按左键值不变，不触发事件（与拖拽边界一致）
    await thumb.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('input')).toBeUndefined()

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(10)
  })

  it('jumps to the extremes on Home / End', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 40, min: 0, max: 100, step: 10 },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')

    await thumb.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(100)

    await thumb.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(0)
  })

  it('steps by max(step, (max-min)/10) on PageUp / PageDown', async () => {
    // (200-0)/10 = 20 > step(10)，大步进取 20，与方向键的 10 区分开
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 30, min: 0, max: 200, step: 10 },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')

    await thumb.trigger('keydown', { key: 'PageUp' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(50)

    await thumb.trigger('keydown', { key: 'PageDown' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe(30)
  })

  it('ignores keyboard input when disabled', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 30, min: 0, max: 100, step: 10, disabled: true },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')

    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('input')).toBeUndefined()
    expect(thumb.attributes('aria-valuenow')).toBe('30')
  })

  it('does not intercept non-navigation keys', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { modelValue: 30, min: 0, max: 100, step: 10 },
    })
    const thumb = wrapper.find('.lh-slider__button-wrapper')

    await thumb.trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('input')).toBeUndefined()
  })

  it('labels range thumbs distinctly and keeps each thumb on its own side', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { range: true, modelValue: [40, 60], min: 0, max: 100, step: 10 },
    })
    const thumbs = wrapper.findAll('.lh-slider__button-wrapper')
    expect(thumbs.length).toBe(2)
    expect(thumbs.at(0)!.attributes('aria-label')).toBe('起始滑块')
    expect(thumbs.at(1)!.attributes('aria-label')).toBe('结束滑块')

    // 起始 thumb 右移越过结束端时钳在 60（键盘不交换两端，焦点与值始终一致）
    await thumbs.at(0)!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toEqual([50, 60])
    await thumbs.at(0)!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toEqual([60, 60])
    // 已抵达本端活动范围上界，不再变化
    await thumbs.at(0)!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toEqual([60, 60])

    // 结束 thumb 左移同样钳在起始端
    await thumbs.at(1)!.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toEqual([60, 60])
  })

  it('moves the end thumb independently in range mode', async () => {
    const wrapper = mount(LhSlider, {
      propsData: { range: true, modelValue: [20, 80], min: 0, max: 100, step: 10 },
    })
    const thumbs = wrapper.findAll('.lh-slider__button-wrapper')

    await thumbs.at(1)!.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('input')?.at(-1)?.[0]).toEqual([20, 70])
    expect(thumbs.at(1)!.attributes('aria-valuenow')).toBe('70')
  })
})

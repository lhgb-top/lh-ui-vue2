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

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhSlider, { propsData: { sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})

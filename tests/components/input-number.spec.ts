import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhInputNumber from '../../src/components/input-number'
import { inputEl } from '../helpers'

describe('LhInputNumber Component', () => {
  it('should render', () => {
    const wrapper = mount(LhInputNumber)
    expect(wrapper.exists()).toBe(true)
  })

  it('should display model value', () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 5 },
    })
    const input = wrapper.find('input')
    expect(inputEl(input.element).value).toBe('5')
  })

  it('should emit v-model on increment', async () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 5 },
    })
    const increaseBtn = wrapper.find('.lh-input-number__increase')
    await increaseBtn.trigger('click')
    const events = wrapper.emitted('input')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual([6])
  })

  it('should emit v-model on decrement', async () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 5 },
    })
    const decreaseBtn = wrapper.find('.lh-input-number__decrease')
    await decreaseBtn.trigger('click')
    const events = wrapper.emitted('input')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual([4])
  })

  it('should not increment when at max', async () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 10, max: 10 },
    })
    const increaseBtn = wrapper.find('.lh-input-number__increase')
    await increaseBtn.trigger('click')
    const events = wrapper.emitted('input')
    expect(events).toBeUndefined()
  })

  it('should not decrement when at min', async () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 0, min: 0 },
    })
    const decreaseBtn = wrapper.find('.lh-input-number__decrease')
    await decreaseBtn.trigger('click')
    const events = wrapper.emitted('input')
    expect(events).toBeUndefined()
  })

  it('should respect disabled state', () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 5, disabled: true },
    })
    expect(wrapper.classes()).toContain('lh-input-number--disabled')
  })

  it('should hide controls when controls prop is false', () => {
    const wrapper = mount(LhInputNumber, {
      propsData: { modelValue: 5, controls: false },
    })
    expect(wrapper.find('.lh-input-number__increase').exists()).toBe(false)
    expect(wrapper.find('.lh-input-number__decrease').exists()).toBe(false)
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhInputNumber, { propsData: { sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})

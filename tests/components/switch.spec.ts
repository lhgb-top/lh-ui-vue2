import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LhSwitch from '../../src/components/switch'

describe('LhSwitch', () => {
  it('role/aria 属性正确', () => {
    const wrapper = mount(LhSwitch, { propsData: { modelValue: true } })
    const el = wrapper.find('[role="switch"]')
    expect(el.attributes('aria-checked')).toBe('true')
    expect(el.classes()).toContain('lh-switch--checked')
  })

  it('点击触发 input/change（v-model 双绑）', async () => {
    const wrapper = mount(LhSwitch, { propsData: { modelValue: false } })
    await wrapper.find('[role="switch"]').trigger('click')
    expect(wrapper.find('[role="switch"]').emitted('input')).toEqual([[true]])
    expect(wrapper.find('[role="switch"]').emitted('change')).toEqual([[true]])
  })

  it('disabled 时点击不触发', async () => {
    const wrapper = mount(LhSwitch, { propsData: { modelValue: false, disabled: true } })
    await wrapper.find('[role="switch"]').trigger('click')
    expect(wrapper.find('[role="switch"]').emitted('input')).toBeUndefined()
  })

  it('activeText/inactiveText 按 checked 切换', async () => {
    const wrapper = mount(LhSwitch, {
      propsData: { modelValue: false, activeText: '开', inactiveText: '关' },
    })
    expect(wrapper.find('.lh-switch__label').text()).toBe('关')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('.lh-switch__label').text()).toBe('开')
  })

  it('loading 时渲染 loading 圈并禁点', async () => {
    const wrapper = mount(LhSwitch, { propsData: { modelValue: false, loading: true } })
    expect(wrapper.find('.lh-switch__loading').exists()).toBe(true)
    await wrapper.find('[role="switch"]').trigger('click')
    expect(wrapper.find('[role="switch"]').emitted('input')).toBeUndefined()
  })
})

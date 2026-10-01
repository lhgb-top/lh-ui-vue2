import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LhAlert from '../../src/components/alert'
import { lhlocale } from '../../src/locale'

describe('LhAlert', () => {
  it('renders default info alert', () => {
    const wrapper = mount(LhAlert, { slots: { default: '提示内容' } })
    expect(wrapper.classes()).toContain('lh-alert')
    expect(wrapper.classes()).toContain('lh-alert--info')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.find('.lh-alert__description').text()).toBe('提示内容')
  })

  it('maps warning and danger types to the alert role', () => {
    const warning = mount(LhAlert, { propsData: { type: 'warning' } })
    expect(warning.attributes('role')).toBe('alert')

    const danger = mount(LhAlert, { propsData: { type: 'danger' } })
    expect(danger.attributes('role')).toBe('alert')
  })

  it('applies plain style and show-icon class', () => {
    const wrapper = mount(LhAlert, { propsData: { plain: true, showIcon: true } })
    expect(wrapper.classes()).toContain('lh-alert--plain')
    expect(wrapper.classes()).toContain('lh-alert--show-icon')
    expect(wrapper.find('.lh-alert__icon').exists()).toBe(true)
  })

  it('renders title and title slot', () => {
    const withProp = mount(LhAlert, { propsData: { title: '标题' } })
    expect(withProp.find('.lh-alert__title').text()).toBe('标题')
    expect(withProp.classes()).toContain('lh-alert--with-title')

    const withSlot = mount(LhAlert, { slots: { title: '<h4>插槽标题</h4>' } })
    expect(withSlot.find('.lh-alert__title h4').text()).toBe('插槽标题')
  })

  it('closes and emits close via the named close button', async () => {
    const wrapper = mount(LhAlert, { propsData: { closable: true } })
    const closeBtn = wrapper.find('.lh-alert__close')
    expect(closeBtn.attributes('aria-label')).toBe('关闭警告')

    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.lh-alert').exists()).toBe(false)
  })

  it('close button label follows locale switches', async () => {
    const wrapper = mount(LhAlert, { propsData: { closable: true } })
    expect(wrapper.find('.lh-alert__close').attributes('aria-label')).toBe('关闭警告')

    lhlocale.setLocale('en-US')
    await nextTick()
    expect(wrapper.find('.lh-alert__close').attributes('aria-label')).toBe('Dismiss alert')

    lhlocale.setLocale('zh-CN')
  })

  it('hides the close button when not closable', () => {
    const wrapper = mount(LhAlert)
    expect(wrapper.find('.lh-alert__close').exists()).toBe(false)
  })
})

import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LhTag from '../../src/components/tag'

describe('LhTag', () => {
  it('渲染默认类名与文本', () => {
    const wrapper = mount(LhTag, { slots: { default: '标签' } })
    expect(wrapper.find('.lh-tag').classes()).toContain('lh-tag--default')
    expect(wrapper.find('.lh-tag').classes()).toContain('lh-tag--medium')
    expect(wrapper.text()).toBe('标签')
  })

  it('type/round/hit 落成 BEM 类名', () => {
    const wrapper = mount(LhTag, {
      propsData: { type: 'primary', round: true, hit: true },
      slots: { default: 'x' },
    })
    const cls = wrapper.find('.lh-tag').classes()
    expect(cls).toContain('lh-tag--primary')
    expect(cls).toContain('lh-tag--round')
    expect(cls).toContain('lh-tag--hit')
  })

  it('closable 时渲染关闭按钮并触发 close', async () => {
    const onClose = vi.fn()
    const wrapper = mount(LhTag, {
      propsData: { closable: true, onClose },
      slots: { default: 'x' },
    })
    expect(wrapper.find('.lh-tag__close').exists()).toBe(true)
    await wrapper.find('.lh-tag__close').trigger('click')
    expect(wrapper.find('.lh-tag').emitted('close')).toHaveLength(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('disabled 时不触发 close', async () => {
    const wrapper = mount(LhTag, {
      propsData: { closable: true, disabled: true },
      slots: { default: 'x' },
    })
    await wrapper.find('.lh-tag__close').trigger('click')
    expect(wrapper.find('.lh-tag').emitted('close')).toBeUndefined()
  })

  it('未绑定 click 监听时不进入 tab 序列', () => {
    const wrapper = mount(LhTag, { slots: { default: 'x' } })
    const tag = wrapper.find('.lh-tag')
    expect(tag.attributes('role')).toBeUndefined()
    expect(tag.attributes('tabindex')).toBeUndefined()
  })

  it('绑定 click 监听时获得 button 语义且键盘可激活', async () => {
    const wrapper = mount(LhTag, {
      slots: { default: 'x' },
      listeners: { click: () => {} },
    })
    const tag = wrapper.find('.lh-tag')
    expect(tag.attributes('role')).toBe('button')
    expect(tag.attributes('tabindex')).toBe('0')

    await tag.trigger('keydown', { key: 'Enter' })
    await tag.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('disabled 时绑定了 click 监听也不可键盘激活', async () => {
    const wrapper = mount(LhTag, {
      propsData: { disabled: true },
      slots: { default: 'x' },
      listeners: { click: () => {} },
    })
    const tag = wrapper.find('.lh-tag')
    expect(tag.attributes('role')).toBeUndefined()
    expect(tag.attributes('tabindex')).toBeUndefined()
    await tag.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

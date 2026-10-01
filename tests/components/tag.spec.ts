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
})

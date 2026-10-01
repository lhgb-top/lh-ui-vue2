import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LhAvatar from '../../src/components/avatar'

describe('LhAvatar', () => {
  it('renders a span with base class', () => {
    const wrapper = mount(LhAvatar)
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('lh-avatar')
  })

  it('applies shape class', () => {
    const wrapper = mount(LhAvatar, { propsData: { shape: 'square' } })
    expect(wrapper.classes()).toContain('lh-avatar--square')
  })

  it('defaults to circle shape', () => {
    const wrapper = mount(LhAvatar)
    expect(wrapper.classes()).toContain('lh-avatar--circle')
  })

  it('applies size class', () => {
    const wrapper = mount(LhAvatar, { propsData: { size: 'large' } })
    expect(wrapper.classes()).toContain('lh-avatar--large')
  })

  it('renders image when src is provided', () => {
    const wrapper = mount(LhAvatar, {
      propsData: { src: 'https://example.com/avatar.png' },
    })
    expect(wrapper.find('img.lh-avatar__img').exists()).toBe(true)
    expect(wrapper.attributes('class')).not.toContain('lh-avatar__icon')
  })

  it('renders icon fallback when src is absent', () => {
    const wrapper = mount(LhAvatar, { propsData: { icon: 'lh-icon-user' } })
    expect(wrapper.find('i.lh-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders first character of text as fallback', () => {
    const wrapper = mount(LhAvatar, { propsData: { text: '青花瓷' } })
    expect(wrapper.find('.lh-avatar__text').exists()).toBe(true)
    expect(wrapper.text()).toBe('青')
  })

  it('falls back to text after image load error', async () => {
    const wrapper = mount(LhAvatar, {
      propsData: { src: 'https://example.com/broken.png', text: '备用' },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('备')
    expect(wrapper.emitted('error')).toBeTruthy()
  })

  it('renders slot when no src, icon or text', () => {
    const wrapper = mount(LhAvatar, { slots: { default: '<em>自定义</em>' } })
    expect(wrapper.find('em').exists()).toBe(true)
  })

  it('applies object-fit style from fit prop', () => {
    const wrapper = mount(LhAvatar, {
      propsData: { src: 'https://example.com/a.png', fit: 'contain' },
    })
    expect(wrapper.find('img').attributes('style')).toContain('object-fit: contain')
  })

  it('hides the decorative icon glyph and names the avatar via alt', () => {
    const icon = mount(LhAvatar, { propsData: { icon: 'lh-icon-user' } })
    expect(icon.find('i.lh-avatar__icon').attributes('aria-hidden')).toBe('true')

    const named = mount(LhAvatar, {
      propsData: { icon: 'lh-icon-user', alt: '用户头像' },
    })
    // 非图片分支由根元素承担 img 语义，alt 提供名称
    expect(named.attributes('role')).toBe('img')
    expect(named.attributes('aria-label')).toBe('用户头像')
  })

  it('lets the image element carry its own semantics', () => {
    const wrapper = mount(LhAvatar, {
      propsData: { src: 'https://example.com/a.png', alt: '用户头像' },
    })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.find('img').attributes('alt')).toBe('用户头像')
  })

  it('applies sx props as inline styles on the root element', () => {
    const wrapper = mount(LhAvatar, { propsData: { text: '青', sx: { mt: 2, w: '50%' } } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-top: 16px')
    expect(style).toContain('width: 50%')
  })
})

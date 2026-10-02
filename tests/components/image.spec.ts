import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LhImage, { LhImageViewer } from '../../src/components/image'

const src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

describe('LhImage Component', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders an img with alt and lazy loading', () => {
    const wrapper = mount(LhImage, { propsData: { src, alt: '水墨山水', lazy: true } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('水墨山水')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('decoding')).toBe('async')
  })

  it('applies the fit class', () => {
    const wrapper = mount(LhImage, { propsData: { src, alt: 'x', fit: 'contain' } })
    expect(wrapper.find('.lh-image__inner--contain').exists()).toBe(true)
  })

  it('switches to the error slot on load failure', async () => {
    const wrapper = mount(LhImage, { propsData: { src: 'http://localhost/broken.png', alt: 'x' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.lh-image__error').exists()).toBe(true)
    expect(wrapper.emitted('error')).toBeTruthy()
  })

  it('opens the viewer on click when preview is enabled', async () => {
    const wrapper = mount(LhImage, { propsData: { src, alt: 'x', preview: true }, attachTo: document.body })
    await wrapper.find('img').trigger('click')
    // 预览器 host 在 mounted 移到 body，要从 document 查
    expect(document.querySelector('.lh-image-viewer')).toBeTruthy()
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true')
    // Esc 关闭
    document.querySelector('.lh-image-viewer')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await (wrapper.vm as { $nextTick: () => Promise<void> }).$nextTick()
    expect(document.querySelector('.lh-image-viewer')).toBeNull()
    wrapper.destroy()
  })

  it('does not open a viewer without preview', async () => {
    const wrapper = mount(LhImage, { propsData: { src, alt: 'x' } })
    await wrapper.find('img').trigger('click')
    expect(document.querySelector('.lh-image-viewer')).toBeNull()
    wrapper.destroy()
  })
})

describe('LhImageViewer Component', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('moves its host to body and renders the toolbar', () => {
    const wrapper = mount(LhImageViewer, {
      propsData: { images: ['a.png', 'b.png'] },
      attachTo: document.body,
    })
    // host-to-body：根 host 已挂到 body
    expect(wrapper.element.parentElement).toBe(document.body)
    expect(document.querySelector('.lh-image-viewer')).toBeTruthy()
    expect(wrapper.findAll('.lh-image-viewer__nav').length).toBe(2)
    wrapper.destroy()
  })

  it('switches images via nav buttons and emits switch', async () => {
    const wrapper = mount(LhImageViewer, {
      propsData: { images: ['a.png', 'b.png', 'c.png'] },
      attachTo: document.body,
    })
    await wrapper.find('.lh-image-viewer__nav--next').trigger('click')
    expect(wrapper.emitted('switch')?.[0]).toEqual([1])
    const img = wrapper.find('.lh-image-viewer__img')
    expect((img.element as HTMLImageElement).src).toContain('b.png')
    await wrapper.find('.lh-image-viewer__nav--prev').trigger('click')
    expect(wrapper.emitted('switch')?.[1]).toEqual([0])
    wrapper.destroy()
  })

  it('zooms and rotates via toolbar buttons', async () => {
    const wrapper = mount(LhImageViewer, {
      propsData: { images: ['a.png'] },
      attachTo: document.body,
    })
    const tools = wrapper.findAll('.lh-image-viewer__tool')
    await tools.at(1)!.trigger('click')
    expect((wrapper.find('.lh-image-viewer__img').element as HTMLElement).style.transform)
      .toContain('scale(1.25)')
    await tools.at(2)!.trigger('click')
    expect((wrapper.find('.lh-image-viewer__img').element as HTMLElement).style.transform)
      .toContain('rotate(90deg)')
    wrapper.destroy()
  })

  it('closes via close button and emits close', async () => {
    const wrapper = mount(LhImageViewer, {
      propsData: { images: ['a.png'] },
      attachTo: document.body,
    })
    await wrapper.find('.lh-image-viewer__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    wrapper.destroy()
  })
})

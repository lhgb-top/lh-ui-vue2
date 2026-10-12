import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LhBackTop from '../../src/components/backtop'

describe('LhBackTop Component', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('is hidden below the visibility threshold and appears above it', async () => {
    // jsdom 无真实滚动布局：直接模拟 scrollingElement 的 scrollTop
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: { scrollTop: 100 },
    })
    const wrapper = mount(LhBackTop, { propsData: { visibilityHeight: 200 }, attachTo: document.body })
    expect(wrapper.find('.lh-backtop').exists()).toBe(false)

    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: { scrollTop: 300 },
    })
    window.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(wrapper.find('.lh-backtop').exists()).toBe(true))
    wrapper.destroy()
  })

  it('emits click and scrolls back to top', async () => {
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: { scrollTop: 500 },
    })
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    const wrapper = mount(LhBackTop, { propsData: { visibilityHeight: 200 }, attachTo: document.body })
    window.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(wrapper.find('.lh-backtop').exists()).toBe(true))
    await wrapper.find('.lh-backtop').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(scrollTo).toHaveBeenCalled()
    wrapper.destroy()
  })

  it('has an aria-label on the icon-only button', async () => {
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: { scrollTop: 500 },
    })
    const wrapper = mount(LhBackTop, { attachTo: document.body })
    window.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(wrapper.find('.lh-backtop').exists()).toBe(true))
    expect(wrapper.find('.lh-backtop').attributes('aria-label')).toBe('返回顶部')
    wrapper.destroy()
  })

  it('emits scrollend with the current scrollTop after scrolling stops', async () => {
    // jsdom 不派发原生 scrollend：走 scroll + 防抖兜底路径
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: { scrollTop: 420 },
    })
    const wrapper = mount(LhBackTop, { propsData: { visibilityHeight: 200 }, attachTo: document.body })
    window.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(wrapper.emitted('scrollend')).toBeTruthy())
    expect(wrapper.emitted('scrollend')?.[0]).toEqual([420])
    wrapper.destroy()
  })

  it('rebinds to a target element assigned after mount (:target="$refs.x" 场景)', async () => {
    // 父级 ref 在 mounted 后才赋值：target 先 undefined（回退 window），后变为真实元素
    const scroller = document.createElement('div')
    document.body.appendChild(scroller)
    const wrapper = mount(LhBackTop, {
      propsData: { visibilityHeight: 200 },
      attachTo: document.body,
    })
    // 挂载后容器才接入：watch 触发解绑 window + 换绑元素
    await wrapper.setProps({ target: scroller })
    scroller.scrollTop = 300
    scroller.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(wrapper.find('.lh-backtop').exists()).toBe(true))
    // 旧目标（window）滚动不再影响可见性
    window.dispatchEvent(new Event('scroll'))
    expect(wrapper.find('.lh-backtop').exists()).toBe(true)
    wrapper.destroy()
  })
})

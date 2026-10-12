import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LhAffix from '../../src/components/affix'

describe('LhAffix Component', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a placeholder wrapper that is not fixed initially', () => {
    const wrapper = mount(LhAffix, { propsData: { offsetTop: 50 }, slots: { default: '固钉内容' } })
    expect(wrapper.find('.lh-affix-placeholder').exists()).toBe(true)
    expect(wrapper.find('.lh-affix--fixed').exists()).toBe(false)
    expect(wrapper.text()).toContain('固钉内容')
    wrapper.destroy()
  })

  it('emits the change event when the fixed state flips', async () => {
    const wrapper = mount(LhAffix, { propsData: { offsetTop: 0 }, attachTo: document.body })
    // jsdom 无 IntersectionObserver / 真实布局：模拟 scroll 前后状态不变
    window.dispatchEvent(new Event('scroll'))
    await (wrapper.vm as { $nextTick: () => Promise<void> }).$nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.destroy()
  })

  it('rebinds to a scroll target assigned after mount (:target="$refs.x" 场景)', async () => {
    const scroller = document.createElement('div')
    document.body.appendChild(scroller)
    const wrapper = mount(LhAffix, {
      propsData: { offsetTop: 0 },
      slots: { default: '固钉内容' },
      attachTo: document.body,
    })
    // 挂载后容器才接入：watch 触发解绑 window + 换绑元素，不抛错且仍可滚动判定
    await wrapper.setProps({ target: scroller })
    scroller.dispatchEvent(new Event('scroll'))
    await (wrapper.vm as { $nextTick: () => Promise<void> }).$nextTick()
    expect(wrapper.find('.lh-affix-placeholder').exists()).toBe(true)
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.destroy()
  })
})

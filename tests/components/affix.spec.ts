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
})

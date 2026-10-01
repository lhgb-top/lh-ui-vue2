import { describe, expect, it } from 'vitest'
import { mountComp as mount, inputEl } from '../helpers'
import LhInput from '../../src/components/input'

describe('LhInput', () => {
  it('渲染原生控件与 placeholder 兜底', () => {
    const wrapper = mount(LhInput)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('请输入')
    expect(wrapper.find('.lh-input--medium').exists()).toBe(true)
  })

  it('输入触发 input 事件并携带值（v-model 载荷）', async () => {
    const wrapper = mount(LhInput)
    const input = wrapper.find('input')
    inputEl(input.element).value = '墨'
    await input.trigger('input')
    const emitted = wrapper.find('.lh-input__wrapper').emitted('input')
    expect(emitted).toHaveLength(1)
    expect((emitted![0] as unknown[])[0]).toBe('墨')
  })

  it('maxlength 截断超长输入', async () => {
    const wrapper = mount(LhInput, { propsData: { maxlength: 3 } })
    const input = wrapper.find('input')
    inputEl(input.element).value = '水墨青花瓷'
    await input.trigger('input')
    const emitted = wrapper.find('.lh-input__wrapper').emitted('input')
    expect((emitted![0] as unknown[])[0]).toBe('水墨青')
  })

  it('showWordLimit + maxlength 显示字数统计', async () => {
    const wrapper = mount(LhInput, { propsData: { showWordLimit: true, maxlength: 5 } })
    const input = wrapper.find('input')
    inputEl(input.element).value = 'abc'
    await input.trigger('input')
    expect(wrapper.find('.lh-input__count').text()).toBe('3/5')
  })

  it('clearable 且有值时显示清空按钮，点击清空并触发 clear', async () => {
    const wrapper = mount(LhInput, { propsData: { clearable: true, modelValue: '有值' } })
    const clearBtn = wrapper.find('.lh-input__clear')
    expect(clearBtn.exists()).toBe(true)
    await clearBtn.trigger('click')
    const emitted = wrapper.find('.lh-input__wrapper').emitted('input')
    expect((emitted![0] as unknown[])[0]).toBe('')
    expect(wrapper.find('.lh-input__wrapper').emitted('clear')).toHaveLength(1)
  })

  it('focus/blur 状态类与事件', async () => {
    // 原生 focus() 派发 focus 事件，但要求元素已在文档中（VTU 的合成 trigger 不可靠）
    const wrapper = mount(LhInput, { attachToDocument: true })
    const input = wrapper.find('input')
    inputEl(input.element).focus()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-input__wrapper').classes()).toContain('lh-input__wrapper--focused')
    expect(wrapper.find('.lh-input__wrapper').emitted('focus')).toHaveLength(1)
    inputEl(input.element).blur()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-input__wrapper').classes()).not.toContain(
      'lh-input__wrapper--focused',
    )
    expect(wrapper.find('.lh-input__wrapper').emitted('blur')).toHaveLength(1)
    wrapper.destroy()
  })

  it('type=textarea 渲染多行控件', () => {
    const wrapper = mount(LhInput, { propsData: { type: 'textarea', rows: 4 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('.lh-input--textarea').exists()).toBe(true)
  })

  it('disabled 时控件禁用', () => {
    const wrapper = mount(LhInput, { propsData: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.lh-input').classes()).toContain('lh-input--disabled')
  })
})

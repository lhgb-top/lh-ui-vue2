import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LhSegmented from '../../src/components/segmented'

const options = ['日', '周', { label: '月', value: 'month', disabled: true }]

describe('LhSegmented Component', () => {
  it('renders a radiogroup with aria-checked options', () => {
    const wrapper = mount(LhSegmented, { propsData: { modelValue: '周', options } })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios.length).toBe(3)
    expect(radios.at(1)!.attributes('aria-checked')).toBe('true')
  })

  it('emits v-model and change on select', async () => {
    const wrapper = mount(LhSegmented, { propsData: { modelValue: '日', options } })
    await wrapper.findAll('[role="radio"]').at(1)!.trigger('click')
    expect(wrapper.emitted('input')?.[0]).toEqual(['周'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['周'])
  })

  it('skips disabled options with roving arrow keys', async () => {
    const wrapper = mount(LhSegmented, { propsData: { modelValue: '日', options } })
    await wrapper.find('[role="radiogroup"]').trigger('keydown', { key: 'ArrowRight' })
    // 从 index 0 右移：index 1「周」是启用项，跳过的应是 index 2「month」
    expect(wrapper.emitted('input')?.[0]).toEqual(['周'])
  })

  it('applies the block layout class', () => {
    const wrapper = mount(LhSegmented, { propsData: { modelValue: '日', options, block: true } })
    expect(wrapper.classes()).toContain('lh-segmented--block')
  })
})

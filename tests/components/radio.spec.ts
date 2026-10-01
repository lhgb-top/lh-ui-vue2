import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mountComp as mount, inputEl } from '../helpers'
import LhRadio, { LhRadioGroup } from '../../src/components/radio'

describe('LhRadio', () => {
  it('checked 状态渲染类名（modelValue 与 value 匹配）', () => {
    const wrapper = mount(LhRadio, {
      propsData: { modelValue: 'a', value: 'a', label: '选项' },
    })
    expect(wrapper.find('.lh-radio').classes()).toContain('lh-radio--checked')
    expect(wrapper.find('.lh-radio__label').text()).toBe('选项')
  })

  it('change 触发 input/change（v-model 双绑）', async () => {
    const wrapper = mount(LhRadio, { propsData: { modelValue: 'a', value: 'b', label: 'x' } })
    await wrapper.find('input[type="radio"]').trigger('change')
    const emitted = wrapper.find('.lh-radio').emitted('input')
    expect(emitted).toEqual([['b']])
    expect(wrapper.find('.lh-radio').emitted('change')).toEqual([['b']])
  })

  it('disabled 时 change 不触发', async () => {
    const wrapper = mount(LhRadio, {
      propsData: { modelValue: 'a', value: 'b', disabled: true, label: 'x' },
    })
    expect(wrapper.find('.lh-radio').classes()).toContain('lh-radio--disabled')
    await wrapper.find('input[type="radio"]').trigger('change')
    expect(wrapper.find('.lh-radio').emitted('input')).toBeUndefined()
  })
})

describe('LhRadioGroup', () => {
  const GroupScenario = defineComponent({
    name: 'GroupScenario',
    data: () => ({ picked: 'a' as unknown }),
    render(this: Vue & { picked: unknown }, h: CreateElement) {
      return h(LhRadioGroup, {
        props: { modelValue: this.picked },
        on: { input: (v: unknown) => { this.picked = v } },
      }, [
        h(LhRadio, { props: { label: 'A', value: 'a' } }),
        h(LhRadio, { props: { label: 'B', value: 'b' } }),
      ])
    },
  })

  it('组内选中态联动与切换', async () => {
    const wrapper = mount(GroupScenario)
    const radios = wrapper.findAll('input[type="radio"]')
    expect((radios.at(0)!.element as HTMLInputElement).checked).toBe(true)
    expect((radios.at(1)!.element as HTMLInputElement).checked).toBe(false)

    ;inputEl(radios.at(1)!.element).checked = true
    await radios.at(1)!.trigger('change')
    expect((wrapper.vm as unknown as { picked: unknown }).picked).toBe('b')
    expect((radios.at(0)!.element as HTMLInputElement).checked).toBe(false)
    expect((radios.at(1)!.element as HTMLInputElement).checked).toBe(true)
  })
})

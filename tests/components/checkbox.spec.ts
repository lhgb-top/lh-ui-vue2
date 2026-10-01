import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mountComp as mount, inputEl } from '../helpers'
import LhCheckbox, { LhCheckboxGroup } from '../../src/components/checkbox'

describe('LhCheckbox', () => {
  it('checked 状态渲染类名', () => {
    const wrapper = mount(LhCheckbox, { propsData: { modelValue: true, label: '选项' } })
    expect(wrapper.find('.lh-checkbox').classes()).toContain('lh-checkbox--checked')
    expect(wrapper.find('.lh-checkbox__label').text()).toBe('选项')
  })

  it('change 事件触发 input/change（v-model 双绑）', async () => {
    const wrapper = mount(LhCheckbox, { propsData: { modelValue: false, label: 'x' } })
    const input = wrapper.find('input[type="checkbox"]')
    inputEl(input.element).checked = true
    await input.trigger('change')
    const emitted = wrapper.find('.lh-checkbox').emitted('input')
    expect(emitted).toEqual([[true]])
    expect(wrapper.find('.lh-checkbox').emitted('change')).toEqual([[true]])
  })

  it('indeterminate 通过 DOM 属性落到原生控件', async () => {
    const wrapper = mount(LhCheckbox, {
      propsData: { modelValue: false, indeterminate: true, label: 'x' },
    })
    await wrapper.vm.$nextTick()
    expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)
  })
})

describe('LhCheckboxGroup', () => {
  // render 函数场景组件（vue 入口为 runtime-only，禁用模板字符串——AGENTS.md 红线 #10）
  const GroupScenario = defineComponent({
    name: 'GroupScenario',
    data: () => ({ picked: ['a'] as unknown[] }),
    render(this: Vue & { picked: unknown[] }, h: CreateElement) {
      return h(LhCheckboxGroup, {
        props: { modelValue: this.picked },
        on: { input: (v: unknown[]) => { this.picked = v } },
      }, [
        h(LhCheckbox, { props: { label: 'A', value: 'a' } }),
        h(LhCheckbox, { props: { label: 'B', value: 'b' } }),
      ])
    },
  })

  it('组内成员选中态与 toggle 汇总', async () => {
    const wrapper = mount(GroupScenario)
    // a 已选中、b 未选中
    const boxes = wrapper.findAll('input[type="checkbox"]')
    expect((boxes.at(0)!.element as HTMLInputElement).checked).toBe(true)
    expect((boxes.at(1)!.element as HTMLInputElement).checked).toBe(false)

    // 勾选 b → group 汇总 [a, b]
    inputEl(boxes.at(1)!.element).checked = true
    await boxes.at(1)!.trigger('change')
    expect((wrapper.vm as unknown as { picked: unknown[] }).picked).toEqual(['a', 'b'])
  })

  const DisabledScenario = defineComponent({
    name: 'DisabledScenario',
    data: () => ({ groupDisabled: true }),
    render(this: Vue & { groupDisabled: boolean }, h: CreateElement) {
      return h(LhCheckboxGroup, { props: { disabled: this.groupDisabled } }, [
        h(LhCheckbox, { props: { label: 'A', value: 'a' } }),
      ])
    },
  })

  it('group 的 disabled 传导给子 checkbox（computed context）', () => {
    const wrapper = mount(DisabledScenario)
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })
})

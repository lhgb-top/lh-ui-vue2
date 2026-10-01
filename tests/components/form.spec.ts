import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mountComp as mount } from '../helpers'
import { inputEl } from '../helpers'
import LhForm, { LhFormItem } from '../../src/components/form'
import LhInput from '../../src/components/input'

/**
 * 场景：LhForm > LhFormItem(prop=name, required) > LhInput
 * 验证完整校验链：必填失败 → errorMessage → aria-invalid → validate/resetFields
 */
const FormScenario = defineComponent({
  name: 'FormScenario',
  data: () => ({ form: { name: '' } as Record<string, unknown> }),
  render(this: Vue & { form: Record<string, unknown> }, h: CreateElement) {
    return h(LhForm, { props: { model: this.form, rules: { name: [{ required: true }] } } }, [
      h(LhFormItem, { props: { prop: 'name', label: '姓名', required: true } }, [
        h(LhInput, {
          props: { modelValue: String(this.form.name ?? '') },
          on: {
            input: (v: string) => {
              this.form.name = v
            },
          },
        }),
      ]),
    ])
  },
})

describe('LhForm / LhFormItem（校验链）', () => {
  it('渲染 form 容器与 label', () => {
    const wrapper = mount(FormScenario)
    expect(wrapper.find('form.lh-form').exists()).toBe(true)
    expect(wrapper.find('.lh-form-item__label').text()).toContain('姓名')
    expect(wrapper.find('.lh-form-item__required').exists()).toBe(true)
  })

  it('validate() 失败时展示错误并标记 aria-invalid', async () => {
    const wrapper = mount(FormScenario)
    const formEl = wrapper.find({ name: 'LhForm' })
    const ok = await (formEl.vm as unknown as { validate: () => Promise<boolean> }).validate()
    expect(ok).toBe(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-form-item--error').exists()).toBe(true)
    const error = wrapper.find('.lh-form-item__error')
    expect(error.exists()).toBe(true)
    expect(error.attributes('role')).toBe('alert')
    // 表单控件联动：aria-invalid 落到原生 input
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('填写后 validate() 通过，错误消失', async () => {
    const wrapper = mount(FormScenario)
    const formEl = wrapper.find({ name: 'LhForm' })
    // 模拟输入
    const input = wrapper.find('input')
    inputEl(input.element).value = '王冕'
    await input.trigger('input')
    const ok = await (formEl.vm as unknown as { validate: () => Promise<boolean> }).validate()
    expect(ok).toBe(true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-form-item--error').exists()).toBe(false)
  })

  it('resetFields 恢复初始值', async () => {
    const wrapper = mount(FormScenario)
    const formEl = wrapper.find({ name: 'LhForm' })
    const input = wrapper.find('input')
    inputEl(input.element).value = '王冕'
    await input.trigger('input')
    await (formEl.vm as unknown as { resetFields: () => void }).resetFields()
    await wrapper.vm.$nextTick()
    // resetField 直接改 model 对象；输入框值经 v-model 同步前先确认 model 已复位
    expect((wrapper.vm as unknown as { form: { name: unknown } }).form.name).toBe('')
  })

  it('labelWidth 落成 label 内联宽度', () => {
    const LabelScenario = defineComponent({
      name: 'LabelScenario',
      render(this: Vue, h: CreateElement) {
        return h(
          LhForm,
          { props: { model: {}, labelWidth: 120 } },
          [h(LhFormItem, { props: { label: '标题' } })],
        )
      },
    })
    const wrapper = mount(LabelScenario)
    const style = wrapper.find('.lh-form-item__label').attributes('style')
    expect(style).toContain('width: 120px')
  })
})


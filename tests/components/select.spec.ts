import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mountComp as mount } from '../helpers'
import LhSelect from '../../src/components/select'

interface LhSelectOption {
  value: unknown
  label: string
  disabled?: boolean
}

const OPTIONS: LhSelectOption[] = [
  { value: 'ink', label: '水墨' },
  { value: 'paper', label: '宣纸' },
  { value: 'seal', label: '印章', disabled: true },
]

const OptionsScenario = defineComponent({
  name: 'OptionsScenario',
  data: () => ({ picked: undefined as unknown, options: OPTIONS }),
  render(this: Vue & { picked: unknown; options: LhSelectOption[] }, h: CreateElement) {
    return h(LhSelect, {
      props: { modelValue: this.picked, options: this.options },
      on: {
        input: (v: unknown) => {
          this.picked = v
        },
      },
    })
  },
})

describe('LhSelect', () => {
  it('渲染触发器与 placeholder 兜底', () => {
    const wrapper = mount(LhSelect)
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true)
    expect(wrapper.find('.lh-select__value').text()).toBe('请选择')
  })

  it('回显选中项；teleported 下拉挂到 body', async () => {
    const wrapper = mount(LhSelect, {
      propsData: { modelValue: 'ink', options: OPTIONS },
      attachToDocument: true,
    })
    expect(wrapper.find('.lh-select__value').text()).toBe('水墨')
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('[role="listbox"]')
    expect(dropdown).toBeTruthy()
    expect(dropdown!.children.length).toBe(3)
    wrapper.destroy()
  })

  it('点击选项触发 input/change（v-model 双绑）', async () => {
    const wrapper = mount(OptionsScenario)
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('[role="option"]')
    ;(options[1] as HTMLElement).click()
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as { picked: unknown }).picked).toBe('paper')
    // 选择后下拉收起
    expect(document.querySelector('[role="listbox"]')).toBeNull()
  })

  it('disabled 选项不可选中', async () => {
    const wrapper = mount(OptionsScenario)
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('[role="option"]')
    ;(options[2] as HTMLElement).click()
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as { picked: unknown }).picked).toBeUndefined()
  })

  it('键盘导航：ArrowDown 高亮 + Enter 选中', async () => {
    const wrapper = mount(OptionsScenario)
    const trigger = wrapper.find('[role="combobox"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-select__option--highlighted').exists()).toBe(true)
    await trigger.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as { picked: unknown }).picked).toBe('ink')
  })

  it('clearable 清空触发 input/clear', async () => {
    const wrapper = mount(LhSelect, {
      propsData: { modelValue: 'ink', options: OPTIONS, clearable: true },
    })
    expect(wrapper.find('.lh-select__clear').exists()).toBe(true)
    await wrapper.find('.lh-select__clear').trigger('click')
    const emitted = wrapper.find('.lh-select').emitted('input')
    expect(emitted).toEqual([[undefined]])
    expect(wrapper.find('.lh-select').emitted('clear')).toHaveLength(1)
  })

  it('disabled 时点击不展开', async () => {
    const wrapper = mount(LhSelect, {
      propsData: { options: OPTIONS, disabled: true },
      attachToDocument: true,
    })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="listbox"]')).toBeNull()
    wrapper.destroy()
  })
})

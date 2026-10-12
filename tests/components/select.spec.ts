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
    wrapper.destroy()
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
    wrapper.destroy()
  })

  it('disabled 选项不可选中', async () => {
    const wrapper = mount(OptionsScenario)
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('[role="option"]')
    ;(options[2] as HTMLElement).click()
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as { picked: unknown }).picked).toBeUndefined()
    // 禁用项不关闭下拉，必须显式销毁，否则 teleported 下拉滞留 body 污染后续用例
    wrapper.destroy()
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
    wrapper.destroy()
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
    wrapper.destroy()
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

  it('aria 属性字符串化：falsy 也保留（Vue2 会移除 false 值属性）', async () => {
    const wrapper = mount(LhSelect, {
      propsData: { modelValue: 'ink', options: OPTIONS },
      attachToDocument: true,
    })
    const trigger = wrapper.find('[role="combobox"]')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-disabled')).toBe('false')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="combobox"]').attributes('aria-expanded')).toBe('true')
    // 选中项 aria-selected='true'；未选中项必须字符串化为 'false'（Vue2 会移除 false 值属性）
    const options = document.querySelectorAll('[role="option"]')
    expect(options[0]?.getAttribute('aria-selected')).toBe('true')
    expect(options[1]?.getAttribute('aria-selected')).toBe('false')
    wrapper.destroy()
  })

  it('下拉包裹过渡（lh-select-fade），收起后卸载', async () => {
    const wrapper = mount(LhSelect, {
      propsData: { modelValue: 'ink', options: OPTIONS },
      attachToDocument: true,
    })
    await wrapper.find('[role="combobox"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.lh-select__dropdown')).toBeTruthy()
    await wrapper.find('[role="combobox"]').trigger('click')
    // jsdom 检测不到 CSS 过渡时长，leave 由 Vue 同步收尾（真实浏览器按 lh-select-fade
    // 播完再移除，已在 dev 沙箱走查确认）；等帧后断言已卸载（M2 红线 #10）
    await new Promise((r) => setTimeout(r, 150))
    expect(document.querySelector('.lh-select__dropdown')).toBeNull()
    wrapper.destroy()
  })

  it('未传 modelValue 时无 value 的选项不误显示已选中', () => {
    // Object.is(undefined, undefined) 恒真：旧实现会让无 value 的选项在未选时占据回显位
    const wrapper = mount(LhSelect, {
      propsData: {
        options: [{ label: '无取值项' }, { value: 'ink', label: '水墨' }] as LhSelectOption[],
      },
      attachToDocument: true,
    })
    // 未选任何项时应展示 placeholder 而非「无取值项」
    expect(wrapper.find('.lh-select__value').text()).toBe('请选择')
    wrapper.destroy()
  })
})

import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhConfigProvider, { useLhConfigContext } from '../../src/components/config-provider'
import { t } from '../../src/locale'

/**
 * 注意：vue 入口是 runtime-only（无模板编译器），测试辅助组件一律用 render 函数。
 */
const Inner = defineComponent({
  name: 'Inner',
  render(this: Vue, h: CreateElement) {
    return h('div', { class: 'inner' }, '内容')
  },
})

const Consumer = defineComponent({
  name: 'Consumer',
  setup() {
    const ctx = useLhConfigContext()
    return { ctx }
  },
  render(this: Vue & { ctx: { size?: string } | null }, h: CreateElement) {
    // 2.7 中 setup 返回的 ref 在 this 上已解包
    return h('div', { class: 'consumer' }, String(this.ctx?.size ?? 'none'))
  },
})

describe('LhConfigProvider', () => {
  it('渲染 provider 容器与默认插槽', () => {
    const wrapper = mount(LhConfigProvider, { slots: { default: Inner } })
    expect(wrapper.find('.lh-config-provider').exists()).toBe(true)
    expect(wrapper.find('.inner').text()).toBe('内容')
  })

  it('themeVars 落成 --lh- 前缀的内联样式', () => {
    const wrapper = mount(LhConfigProvider, {
      propsData: { themeVars: { 'primary-color': '#123456' } },
    })
    expect(wrapper.find('.lh-config-provider').attributes('style')).toContain(
      '--lh-primary-color: #123456',
    )
  })

  it('provide 的是 computed 引用：provider props 变化传导给 inject 方', async () => {
    const wrapper = mount(LhConfigProvider, {
      propsData: { size: 'small' },
      slots: { default: Consumer },
    })
    expect(wrapper.find('.consumer').text()).toBe('small')

    await wrapper.setProps({ size: 'medium' })
    expect(wrapper.find('.consumer').text()).toBe('medium')
  })

  it('locale prop 即时同步到全局 lhlocale（watch immediate）', async () => {
    const wrapper = mount(LhConfigProvider, { propsData: { locale: 'en-US' } })
    expect(t('input.placeholder')).toBe('Please input')

    await wrapper.setProps({ locale: 'zh-CN' })
    expect(t('input.placeholder')).toBe('请输入')
  })

  it('未挂 provider 时注入为 null，消费路径安全', () => {
    const wrapper = mount(Consumer)
    expect(wrapper.text()).toBe('none')
  })
})

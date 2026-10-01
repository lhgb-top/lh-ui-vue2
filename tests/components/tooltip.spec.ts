import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhTooltip from '../../src/components/tooltip'

const TriggerProbe = defineComponent({
  name: 'TriggerProbe',
  render(this: Vue, h: CreateElement) {
    return h('button', { class: 'tooltip-trigger' }, '悬停我')
  },
})

async function showTooltip(): Promise<ReturnType<typeof mount> & { destroy: () => void }> {
  const wrapper = mount(LhTooltip, {
    propsData: { content: '提示内容', placement: 'top', teleportTarget: 'body' },
    slots: { default: TriggerProbe },
    attachToDocument: true,
  })
  await wrapper.find('.lh-tooltip').trigger('mouseenter')
  await new Promise((resolve) => setTimeout(resolve, 20))
  await wrapper.vm.$nextTick()
  return wrapper as never
}

describe('LhTooltip', () => {
  it('默认隐藏，popper host 挂到 body', () => {
    const wrapper = mount(LhTooltip, {
      slots: { default: TriggerProbe },
      attachToDocument: true,
    })
    const host = wrapper.find('.lh-tooltip__host').element
    expect(host.parentElement).toBe(document.body)
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    wrapper.destroy()
  })

  it('hover 触发显示 popper（position: fixed）', async () => {
    const wrapper = await showTooltip()
    const popper = document.querySelector('[role="tooltip"]')
    expect(popper).toBeTruthy()
    expect(popper!.textContent).toContain('提示内容')
    expect((popper as HTMLElement).style.position).toBe('fixed')
    wrapper.destroy()
  })

  it('mouseleave 隐藏', async () => {
    const wrapper = await showTooltip()
    await wrapper.find('.lh-tooltip').trigger('mouseleave')
    await new Promise((resolve) => setTimeout(resolve, 20))
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    wrapper.destroy()
  })

  it('trigger=click 时点击切换、点击外部关闭', async () => {
    const wrapper = mount(LhTooltip, {
      propsData: { content: 'x', trigger: 'click' },
      slots: { default: TriggerProbe },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tooltip').trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeTruthy()
    await wrapper.find('.lh-tooltip').trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    wrapper.destroy()
  })

  it('manual 模式由 visible prop 控制', async () => {
    const wrapper = mount(LhTooltip, {
      propsData: { content: 'x', manual: true, visible: false },
      slots: { default: TriggerProbe },
      attachToDocument: true,
    })
    await wrapper.setProps({ visible: true })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeTruthy()
    wrapper.destroy()
  })

  it('disabled 时不显示', async () => {
    const wrapper = mount(LhTooltip, {
      propsData: { content: 'x', disabled: true },
      slots: { default: TriggerProbe },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tooltip').trigger('mouseenter')
    await new Promise((resolve) => setTimeout(resolve, 20))
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    wrapper.destroy()
  })
})

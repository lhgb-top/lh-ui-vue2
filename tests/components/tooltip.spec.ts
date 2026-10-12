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

  // 定位回归：popper 类名携带实际方位（--top/--bottom），据此判定 flip 是否生效。
  // 类名里同时有 --dark（effect）与 --primary（type），需精确匹配方位后缀。
  const PLACEMENT_SUFFIXES = [
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
    'left-start',
    'left-end',
    'right-start',
    'right-end',
    'top',
    'bottom',
    'left',
    'right',
  ]

  function actualPlacementOf(popper: Element): string | null {
    const prefix = 'lh-tooltip__popper--'
    const cls = Array.from(popper.classList).find((c) =>
      PLACEMENT_SUFFIXES.some((s) => c === `${prefix}${s}`),
    )
    return cls ? cls.replace(prefix, '') : null
  }

  /** 造可控几何：jsdom 默认 getBoundingClientRect 全 0，无法触发翻转判定 */
  function stubGeometry(triggerTop: number, triggerHeight = 32, popperHeight = 30): void {
    const triggerRect = {
      top: triggerTop,
      bottom: triggerTop + triggerHeight,
      left: 100,
      right: 160,
      width: 60,
      height: triggerHeight,
      x: 100,
      y: triggerTop,
      toJSON() {},
    }
    HTMLElement.prototype.getBoundingClientRect = () => triggerRect as DOMRect
    // popper 走 offsetWidth/offsetHeight（布局尺寸，见 overlay.ts 注释）
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 120 })
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: popperHeight,
    })
    // 视口高度固定 800，给上下都留足翻转判定空间
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  }

  it('placement=top 且上方有空间时保持 top', async () => {
    stubGeometry(200)
    const wrapper = await showTooltip()
    const popper = document.querySelector('[role="tooltip"]')!
    expect(actualPlacementOf(popper)).toBe('top')
    wrapper.destroy()
  })

  it('上方空间不足时自动翻转到底部（flip 默认开启）', async () => {
    // 触发器贴顶：top 需 0-8-30=-38>=8 不成立，bottom 需 32+8+30=70<=792 成立
    stubGeometry(0)
    const wrapper = await showTooltip()
    const popper = document.querySelector('[role="tooltip"]')!
    expect(actualPlacementOf(popper)).toBe('bottom')
    wrapper.destroy()
  })

  it('flip=false 时贴顶仍严格保持 top（核心回归）', async () => {
    stubGeometry(0)
    const wrapper = mount(LhTooltip, {
      propsData: { content: '严格定位', placement: 'top', flip: false, teleportTarget: 'body' },
      slots: { default: TriggerProbe },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tooltip').trigger('mouseenter')
    await new Promise((resolve) => setTimeout(resolve, 20))
    await wrapper.vm.$nextTick()
    const popper = document.querySelector('[role="tooltip"]')!
    expect(actualPlacementOf(popper)).toBe('top')
    wrapper.destroy()
  })

  it('运行时由 flip=true 改为 flip=false 触发重定位', async () => {
    stubGeometry(0)
    const wrapper = mount(LhTooltip, {
      propsData: { content: '切换', placement: 'top', teleportTarget: 'body' },
      slots: { default: TriggerProbe },
      attachToDocument: true,
    })
    await wrapper.find('.lh-tooltip').trigger('mouseenter')
    await new Promise((resolve) => setTimeout(resolve, 20))
    await wrapper.vm.$nextTick()
    expect(actualPlacementOf(document.querySelector('[role="tooltip"]')!)).toBe('bottom')

    await wrapper.setProps({ flip: false })
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(actualPlacementOf(document.querySelector('[role="tooltip"]')!)).toBe('top')
    wrapper.destroy()
  })
})

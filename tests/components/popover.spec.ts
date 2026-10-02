import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhPopover from '../../src/components/popover'

// runtime-only 构建：VTU v1 的 slots 不支持模板字符串，统一用渲染函数探针
const textProbe = (text: string) =>
  defineComponent({
    name: 'TextProbe',
    render(this: Vue, h: CreateElement) {
      return h('span', text)
    },
  })

const ButtonProbe = defineComponent({
  name: 'ButtonProbe',
  render(this: Vue, h: CreateElement) {
    return h('button', 'open')
  },
})

const InputProbe = defineComponent({
  name: 'InputProbe',
  render(this: Vue, h: CreateElement) {
    return h('input', { attrs: { type: 'text' } })
  },
})

const TitleProbe = defineComponent({
  name: 'TitleProbe',
  render(this: Vue, h: CreateElement) {
    return h('span', { class: 'my-title' }, '自定义标题')
  },
})

const ContentProbe = defineComponent({
  name: 'ContentProbe',
  render(this: Vue, h: CreateElement) {
    return h('span', { class: 'my-content' }, '自定义内容')
  },
})

const PopperActionProbe = defineComponent({
  name: 'PopperActionProbe',
  render(this: Vue, h: CreateElement) {
    return h('button', { attrs: { id: 'popper-action' } }, '动作')
  },
})

const LongContentProbe = defineComponent({
  name: 'LongContentProbe',
  render(this: Vue, h: CreateElement) {
    return h('span', '长内容'.repeat(30))
  },
})

describe('LhPopover', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const getPopper = () => document.querySelector('.lh-popover__popper')

  it('renders the trigger slot', () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: { default: textProbe('Click me') },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('lh-popover')
    expect(wrapper.text()).toContain('Click me')
    wrapper.destroy()
  })

  it('shows on click trigger and emits update:visible / show', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', title: '标题' },
      slots: { default: ButtonProbe },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(getPopper()).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    expect(wrapper.emitted('show')).toBeTruthy()

    wrapper.destroy()
  })

  it('toggles off on a second click', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])
    expect(wrapper.emitted('hide')).toBeTruthy()

    wrapper.destroy()
  })

  it('hides on Escape', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])

    wrapper.destroy()
  })

  it('hides on click outside', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    document.body.insertAdjacentHTML('beforeend', '<div id="far-away">elsewhere</div>')
    document
      .getElementById('far-away')
      ?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('hide')).toBeTruthy()

    wrapper.destroy()
  })

  it('shows on hover trigger without a delay when configured', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'hover', showAfter: 0, hideAfter: 0 },
      slots: { default: textProbe('hover me') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    await wrapper.find('.lh-popover').trigger('mouseleave')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()

    wrapper.destroy()
  })

  it('shows on focus trigger', async () => {
    const wrapper = mount(LhPopover, {
      // focus/hover 走延迟通道：showAfter/hideAfter 任一缺省都会拿到 200/100ms
      // 的默认延迟，这里都要显式归零，否则显隐不在同一个微任务里完成
      propsData: { trigger: 'focus', showAfter: 0, hideAfter: 0 },
      slots: { default: InputProbe },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('focusin')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    await wrapper.find('.lh-popover').trigger('focusout')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()

    wrapper.destroy()
  })

  it('renders role=dialog with aria-labelledby for the title', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', title: '标题' },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    const popper = getPopper()
    expect(popper?.getAttribute('role')).toBe('dialog')
    const labelledby = popper?.getAttribute('aria-labelledby')
    expect(labelledby).toBeTruthy()
    expect(document.getElementById(labelledby as string)?.textContent).toBe('标题')

    wrapper.destroy()
  })

  it('marks the trigger as aria-expanded and aria-haspopup for click trigger', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    expect(wrapper.find('.lh-popover').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.lh-popover').attributes('aria-haspopup')).toBe('dialog')

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.lh-popover').attributes('aria-expanded')).toBe('true')

    wrapper.destroy()
  })

  it('does not respond to trigger events in manual mode', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'manual', visible: false },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.find('.lh-popover').trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()

    wrapper.destroy()
  })

  it('syncs visible from the outside in manual mode', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'manual', visible: false },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.setProps({ visible: true })
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    wrapper.destroy()
  })

  it('exposes show / hide / toggle methods', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'manual', visible: false },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    const vm = wrapper.vm as unknown as {
      show: () => void
      hide: () => void
      toggle: () => void
    }
    vm.show()
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    vm.toggle()
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()

    vm.toggle()
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    wrapper.destroy()
  })

  it('renders the title and content slots', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: {
        default: textProbe('open'),
        title: TitleProbe,
        content: ContentProbe,
      },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(getPopper()?.querySelector('.my-title')).toBeTruthy()
    expect(getPopper()?.querySelector('.my-content')).toBeTruthy()

    wrapper.destroy()
  })

  it('teleports the popper to the given target', async () => {
    const host = document.createElement('div')
    host.id = 'popper-host'
    document.body.appendChild(host)

    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', teleportTarget: '#popper-host' },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(host.querySelector('.lh-popover__popper')).toBeTruthy()

    wrapper.destroy()
    host.remove()
  })

  it('applies the width prop', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', width: 240 },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(getPopper()?.getAttribute('style')).toContain('width: 240px')

    wrapper.destroy()
  })

  it('hides the arrow when arrow is false', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', arrow: false },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()

    expect(getPopper()?.querySelector('.lh-popover__arrow')).toBeNull()

    wrapper.destroy()
  })

  it('does not show when disabled', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', disabled: true },
      slots: { default: textProbe('open') },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()

    wrapper.destroy()
  })

  it('moves focus into the popper on click trigger', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: {
        default: textProbe('open'),
        content: PopperActionProbe,
      },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(document.activeElement?.id).toBe('popper-action')

    // Tab 在弹出层内循环（末项 → 首项）
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    )
    expect(document.activeElement?.id).toBe('popper-action')

    wrapper.destroy()
  })

  it('writes the arrow offset so the arrow tracks the trigger center', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click', placement: 'bottom' },
      slots: { default: ButtonProbe, content: LongContentProbe },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const popper = getPopper() as HTMLElement
    expect(popper).toBeTruthy()
    // 定位后写入 px 偏移；未定位时 SCSS 回退到 50%
    expect(popper.style.getPropertyValue('--lh-arrow-offset')).toMatch(/^-?\d+px$/)

    wrapper.destroy()
  })

  it('closes when the trigger is scrolled out of the viewport', async () => {
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'click' },
      slots: { default: ButtonProbe },
      attachTo: document.body,
    })

    await wrapper.find('.lh-popover').trigger('click')
    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    // jsdom 无真实布局，直接造一个整体离开视口的 trigger rect
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 5000,
      bottom: 5040,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 5000,
      toJSON: () => ({}),
    })
    window.dispatchEvent(new Event('scroll'))

    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()

    vi.restoreAllMocks()
    wrapper.destroy()
  })

  it('closes on scroll-out even in controlled (manual) mode', async () => {
    // 回归：受控模式下面板同样要在触发器滚出视口时收起。弹出层是 fixed 定位，
    // 触发器离开后它仍会以高 z-index 悬浮在页面内容之上，旧实现用
    // if (!isControlled.value) return 把受控面板留在了页面上。
    const wrapper = mount(LhPopover, {
      propsData: { trigger: 'manual', visible: true },
      slots: { default: ButtonProbe },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeTruthy()

    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 5000,
      bottom: 5040,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 5000,
      toJSON: () => ({}),
    })
    window.dispatchEvent(new Event('scroll'))

    await wrapper.vm.$nextTick()
    expect(getPopper()).toBeNull()
    // 受控模式必须同步外部状态，否则外部的 visible 会与实际显隐脱节
    expect(wrapper.emitted('update:visible')?.at(-1)).toEqual([false])

    vi.restoreAllMocks()
    wrapper.destroy()
  })
})

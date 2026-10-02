import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhDrawer from '../../src/components/drawer'

// runtime-only 构建：VTU v1 的 slots 不支持模板字符串，统一用渲染函数探针
const textProbe = (text: string) =>
  defineComponent({
    name: 'TextProbe',
    render(this: Vue, h: CreateElement) {
      return h('span', text)
    },
  })

const HeaderProbe = defineComponent({
  name: 'HeaderProbe',
  render(this: Vue, h: CreateElement) {
    return h('span', { class: 'my-header' }, '自定义头部')
  },
})

const FooterProbe = defineComponent({
  name: 'FooterProbe',
  render(this: Vue, h: CreateElement) {
    return h('span', { class: 'my-footer' }, '自定义底部')
  },
})

const PanelActionProbe = defineComponent({
  name: 'PanelActionProbe',
  render(this: Vue, h: CreateElement) {
    return h('button', { attrs: { id: 'panel-action' } }, '动作')
  },
})

describe('LhDrawer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const getDrawer = () => document.querySelector('.lh-drawer')
  const getPanel = () => document.querySelector('.lh-drawer__panel')

  it('stays hidden by default', () => {
    mount(LhDrawer, {
      propsData: {},
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    expect(getDrawer()).toBeNull()
  })

  it('renders when the model is true', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, title: '详情' },
      slots: { default: textProbe('抽屉内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    const drawer = getDrawer()
    expect(drawer).toBeTruthy()
    expect(drawer?.getAttribute('role')).toBe('dialog')
    expect(drawer?.getAttribute('aria-modal')).toBe('true')
    expect(getPanel()?.textContent).toContain('抽屉内容')
    expect(getPanel()?.classList.contains('lh-drawer__panel--right')).toBe(true)

    wrapper.destroy()
  })

  it('emits close on modelValue change to false', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, title: '详情' },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ modelValue: false })
    // vue2 的 v-model 事件名是 input（不是 plus 的 update:modelValue）
    expect(wrapper.emitted('input')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.destroy()
  })

  it('closes on mask click by default', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, title: '详情' },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    await wrapper.find('.lh-drawer__mask').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.destroy()
  })

  it('does not close on mask click when maskClosable is false', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, maskClosable: false },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    await wrapper.find('.lh-drawer__mask').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeFalsy()

    wrapper.destroy()
  })

  it('closes on Escape', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, title: '详情' },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.destroy()
  })

  it('does not close on Escape when closeOnEsc is false', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, closeOnEsc: false },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeFalsy()

    wrapper.destroy()
  })

  it('applies the size to the panel', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, size: 480 },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    expect(getPanel()?.getAttribute('style')).toContain('width: 480px')

    await wrapper.setProps({ direction: 'bottom', size: '40%' })
    await wrapper.vm.$nextTick()
    const panel = getPanel()
    expect(panel?.getAttribute('style')).toContain('height: 40%')
    expect(panel?.classList.contains('lh-drawer__panel--bottom')).toBe(true)

    wrapper.destroy()
  })

  it('renders the header and footer slots', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true },
      slots: {
        header: HeaderProbe,
        default: textProbe('内容'),
        footer: FooterProbe,
      },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    expect(getDrawer()?.querySelector('.my-header')).toBeTruthy()
    expect(getDrawer()?.querySelector('.my-footer')).toBeTruthy()

    wrapper.destroy()
  })

  it('gives the close button an accessible name', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, title: '详情' },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    const close = getDrawer()?.querySelector('.lh-drawer__close') as HTMLElement
    expect(close).toBeTruthy()
    expect(close.getAttribute('aria-label')).toBe('关闭抽屉')

    wrapper.destroy()
  })

  it('hides the close button when showClose is false', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, showClose: false },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    expect(getDrawer()?.querySelector('.lh-drawer__close')).toBeNull()

    wrapper.destroy()
  })

  it('locks and restores body scroll', async () => {
    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: false },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).not.toBe('hidden')

    wrapper.destroy()
  })

  it('moves focus into the panel and returns it on close', async () => {
    const trigger = document.createElement('button')
    trigger.id = 'drawer-trigger'
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: false, title: '详情' },
      slots: { default: PanelActionProbe },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    // 焦点只要进入面板即可：面板内 DOM 序的首个可聚焦元素是头部关闭按钮，
    // 不必是插槽里的按钮
    expect(getPanel()?.contains(document.activeElement)).toBe(true)

    await wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(document.activeElement?.id).toBe('drawer-trigger')

    wrapper.destroy()
    trigger.remove()
  })

  it('renders under body when teleportTarget is given', async () => {
    // teleportTarget 已兑现：host 根元素挂到指定容器（2.7 无 Teleport 的手动搬移）
    const host = document.createElement('div')
    host.id = 'drawer-host'
    document.body.appendChild(host)

    const wrapper = mount(LhDrawer, {
      propsData: { modelValue: true, teleportTarget: '#drawer-host' },
      slots: { default: textProbe('内容') },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    expect(host.querySelector('.lh-drawer')).toBeTruthy()
    // body 直接子代不应再有 drawer host（querySelector 会搜到 host 内部后代，用 :scope 限定）
    expect(document.body.querySelector(':scope > .lh-drawer__host')).toBeNull()

    wrapper.destroy()
    host.remove()
  })
})

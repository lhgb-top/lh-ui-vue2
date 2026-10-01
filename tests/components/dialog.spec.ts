import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mount } from '@vue/test-utils'
import LhDialog from '../../src/components/dialog'

const BodyProbe = defineComponent({
  name: 'BodyProbe',
  render(this: Vue, h: CreateElement) {
    return h('p', { class: 'dialog-body-probe' }, '正文')
  },
})

describe('LhDialog', () => {
  it('默认关闭且 host 挂到 body（Vue2 无 Teleport 的替代方案）', () => {
    const wrapper = mount(LhDialog, { propsData: { title: '提示' } })
    const host = document.body.querySelector('.lh-dialog__host')
    expect(host).toBeTruthy()
    expect(host!.contains(wrapper.find('.lh-dialog__host').element)).toBe(true)
    expect(document.querySelector('.lh-dialog__container')).toBeNull()
    wrapper.destroy()
  })

  it('modelValue=true 渲染弹层（遮罩 + 标题 + 关闭按钮）', async () => {
    const wrapper = mount(LhDialog, {
      propsData: { modelValue: true, title: '提示' },
      slots: { default: BodyProbe },
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.lh-dialog__overlay')).toBeTruthy()
    expect(document.querySelector('.lh-dialog__title')!.textContent).toBe('提示')
    expect(document.querySelector('.dialog-body-probe')).toBeTruthy()
    expect(document.querySelector('.lh-dialog')!.getAttribute('role')).toBe('dialog')
    wrapper.destroy()
  })

  it('点击遮罩触发 input(false)/close（v-model 关闭）', async () => {
    const wrapper = mount(LhDialog, { propsData: { modelValue: true } })
    await wrapper.vm.$nextTick()
    await wrapper.find('.lh-dialog__overlay').trigger('click')
    const emitted = wrapper.find('.lh-dialog__host').emitted('input')
    expect(emitted).toEqual([[false]])
    expect(wrapper.find('.lh-dialog__host').emitted('close')).toHaveLength(1)
    wrapper.destroy()
  })

  it('closeOnClickModal=false 时点击遮罩不关闭', async () => {
    const wrapper = mount(LhDialog, {
      propsData: { modelValue: true, closeOnClickModal: false },
    })
    await wrapper.vm.$nextTick()
    await wrapper.find('.lh-dialog__overlay').trigger('click')
    expect(wrapper.find('.lh-dialog__host').emitted('input')).toBeUndefined()
    wrapper.destroy()
  })

  it('ESC 关闭受 closeOnPressEscape 控制', async () => {
    const wrapper = mount(LhDialog, {
      propsData: { modelValue: true, closeOnPressEscape: false },
    })
    await wrapper.vm.$nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.lh-dialog__host').emitted('input')).toBeUndefined()
    wrapper.destroy()
  })

  it('footer 插槽渲染', async () => {
    const FooterProbe = defineComponent({
      name: 'FooterProbe',
      render(this: Vue, h: CreateElement) {
        return h('button', { class: 'footer-probe' }, '确定')
      },
    })
    const wrapper = mount(LhDialog, {
      propsData: { modelValue: true },
      slots: { footer: FooterProbe },
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.lh-dialog__footer .footer-probe')).toBeTruthy()
    wrapper.destroy()
  })

  it('defineExpose 的 close() 可关闭', async () => {
    const wrapper = mount(LhDialog, { propsData: { modelValue: true } })
    await wrapper.vm.$nextTick()
    const dialog = wrapper.find('.lh-dialog__host')
    await (dialog.vm as unknown as { close: () => void }).close()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.lh-dialog__container')).toBeNull()
    wrapper.destroy()
  })
})

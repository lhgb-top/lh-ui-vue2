import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type Vue from 'vue'
import type { CreateElement } from 'vue'
import { mountToBody } from '../../src/imperative'

const Probe = defineComponent({
  name: 'Probe',
  props: {
    text: { type: String, default: 'ok' },
  },
  render(this: Vue & { text: string }, h: CreateElement) {
    return h('div', { class: 'probe' }, this.text)
  },
})

describe('mountToBody', () => {
  it('渲染进 body 末尾容器并透传 propsData', () => {
    const inst = mountToBody(Probe, { text: 'hello' })
    expect(document.body.contains(inst.container)).toBe(true)
    expect(document.body.contains(inst.el)).toBe(true)
    expect(inst.el.textContent).toBe('hello')
    inst.destroy()
  })

  it('destroy 移除容器且幂等', () => {
    const inst = mountToBody(Probe)
    expect(document.body.contains(inst.el)).toBe(true)
    inst.destroy()
    expect(document.body.contains(inst.container)).toBe(false)
    expect(document.body.contains(inst.el)).toBe(false)
    // 幂等：重复 destroy 不抛错
    expect(() => inst.destroy()).not.toThrow()
  })

  it('独立实例树：不继承父级 provide/inject', () => {
    // 命令式挂载走 new Vue 独立实例树，vm.$parent 为空（无 App 根）
    const inst = mountToBody(Probe)
    expect(inst.vm.$parent).toBeUndefined()
    inst.destroy()
  })
})

import { mount as vtuMount } from '@vue/test-utils'
import type { MountOptions, Wrapper } from '@vue/test-utils'
import type Vue from 'vue'

/**
 * Vue 2.7 的 defineComponent() 返回 Vue3 风格的组件类型，与 VTU v1 的
 * mount(comp: VueConstructor) 参数类型不兼容（运行时完全可用，纯类型摩擦）。
 * 测试统一走此 helper 收窄；SFC 导入（经 *.vue shim）不受影响。
 */
export function mountComp(comp: unknown, options?: MountOptions<Vue>): Wrapper<Vue> {
  return (vtuMount as unknown as (c: unknown, o?: MountOptions<Vue>) => Wrapper<Vue>)(comp, options)
}

/** VTU v1 的 wrapper.element 类型是 Element，原生表单控件属性访问需要收窄 */
export function inputEl(el: Element): HTMLInputElement {
  return el as HTMLInputElement
}

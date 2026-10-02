/**
 * Vue 2 命令式挂载基建（Message/Notification/Loading 等服务组件与弹层组件的地基）
 *
 * Vue2 无 Teleport：弹层组件在 mounted 时把内容渲染进本工具创建的 body 容器，
 * beforeDestroy 时调用 destroy()；命令式服务直接用 new Vue({ render }).$mount() 渲染。
 * 独立实例树**不继承** ConfigProvider 的 provide/inject（与 plus 的服务组件同款约束）。
 *
 * SSR 安全：函数只允许在客户端生命周期（mounted / 事件回调）内调用。
 */
import Vue from 'vue'
import type { Component, CreateElement, VNode } from 'vue'

/** mountToBody 的返回实例 */
export interface LhMountedInstance {
  /** 命令式 Vue 实例 */
  vm: Vue
  /** 渲染根元素（已插入 container 内） */
  el: HTMLElement
  /** body 末尾的容器元素（弹层组件可在此渲染内容） */
  container: HTMLElement
  /** 销毁：$destroy + 移除容器；幂等 */
  destroy: () => void
}

/**
 * 把组件渲染进指定容器（弹层组件可在此渲染内容）
 * @param comp 目标组件（SFC 或组件选项）
 * @param propsData 传给组件的 props
 * @param container 承载容器（由调用方持有）
 */
export function mountToContainer(
  comp: Component,
  propsData: Record<string, unknown> | undefined,
  container: HTMLElement,
): LhMountedInstance {
  const vm = new Vue({
    render: (h: CreateElement): VNode => h(comp, { props: propsData ?? {} }),
  })
  // 离文档渲染后手动插入：$mount() 不带参时 $el 尚未进 DOM，容器时序可控
  vm.$mount()
  const el = vm.$el as HTMLElement
  container.appendChild(el)

  let destroyed = false
  return {
    vm,
    el,
    container,
    destroy() {
      if (destroyed) return
      destroyed = true
      vm.$destroy()
      el.remove()
    },
  }
}

/**
 * 把组件渲染进 body 末尾的独立容器
 * @param comp 目标组件（SFC 或组件选项）
 * @param propsData 传给组件的 props
 */
export function mountToBody(
  comp: Component,
  propsData?: Record<string, unknown>,
): LhMountedInstance {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const instance = mountToContainer(comp, propsData, container)
  const innerDestroy = instance.destroy
  instance.destroy = () => {
    innerDestroy()
    container.remove()
  }
  return instance
}

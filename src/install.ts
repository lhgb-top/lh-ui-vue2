import type { VueConstructor } from 'vue'

/** 带安装能力的组件类型：Vue2 插件形态要求 .install + name */
export interface LhInstallableComponent extends VueConstructor {
  name: string
  install: (Vue: VueConstructor) => void
}

/**
 * 把 SFC 包装为带 install 的 Vue2 插件组件。
 * 注册名与组件 name、registry 清单三者必须一致（registry 测试断言）。
 */
export function withInstall(name: string, sfc: unknown): LhInstallableComponent {
  const component = sfc as LhInstallableComponent
  component.name = name
  component.install = (Vue: VueConstructor) => {
    Vue.component(name, component)
  }
  return component
}

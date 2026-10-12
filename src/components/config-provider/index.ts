import type { VueConstructor } from 'vue'
import LhConfigProviderSfc from './src/index.vue'

export { useLhConfigProvider, useLhConfigContext } from './src/index'
export type { LhConfigContextRef } from './src/index'
export { LH_CONFIG_PROVIDER_KEY } from './src/types'
export type { LhConfigContext, LhConfigProviderProps, LhThemeableComponent } from './src/types'

/** 带安装能力的组件类型：Vue2 插件形态要求 .install + name */
export interface LhInstallableComponent extends VueConstructor {
  name: string
  install: (Vue: VueConstructor) => void
}

const LhConfigProvider = LhConfigProviderSfc as unknown as LhInstallableComponent

LhConfigProvider.install = (Vue: VueConstructor) => {
  Vue.component('LhConfigProvider', LhConfigProvider)
}

export default LhConfigProvider

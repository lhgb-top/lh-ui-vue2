import type { VueConstructor } from 'vue'
import { LhLoading, showLoading, closeLoading } from './src/service'
import { lhLoading } from './src/directive'
import type { LhRegistryEntry } from '../../install'

/**
 * 加载服务 + 指令入口：
 * - `LhLoading.show({ target?, text?, lock? })` 服务式
 * - `Vue.use(LhLoading)` 注册 `v-loading` 指令
 */
const LhLoadingService = Object.assign(LhLoading, {
  install: (Vue: VueConstructor): void => {
    Vue.directive('loading', lhLoading)
  },
})

Object.defineProperty(LhLoadingService, 'name', { value: 'LhLoading' })

/** registry 条目：服务对象（install 注册 v-loading 指令） */
const entry = LhLoadingService as unknown as LhRegistryEntry & typeof LhLoadingService & { name: string }

export default entry
export { LhLoadingService as LhLoading }
export { showLoading, closeLoading, lhLoading as loadingDirective }
export type { LhLoadingHandle, LhLoadingMaskProps, LhLoadingOptions } from './src/types'

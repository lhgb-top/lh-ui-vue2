/**
 * @lh-ui/vue2 全量入口
 *
 * 全量注册：
 *   import LhUIVue2 from '@lh-ui/vue2'
 *   Vue.use(LhUIVue2)
 * 按需引入（推荐，利于 tree-shaking）：
 *   import { LhConfigProvider } from '@lh-ui/vue2'
 */
import type { VueConstructor } from 'vue'
import LhConfigProvider from './components/config-provider'
import LhButton from './components/button'
import LhIcon from './components/icon'
import LhInput from './components/input'
import LhTag from './components/tag'
import LhSwitch from './components/switch'
import LhCheckbox, { LhCheckboxGroup } from './components/checkbox'
import LhRadio, { LhRadioGroup } from './components/radio'
import LhDialog from './components/dialog'
import LhTooltip from './components/tooltip'

/** 组件注册表（registry 测试断言此清单；新增组件必须登记） */
export const lhComponents = [
  LhConfigProvider,
  LhButton,
  LhIcon,
  LhInput,
  LhTag,
  LhSwitch,
  LhCheckbox,
  LhCheckboxGroup,
  LhRadio,
  LhRadioGroup,
  LhDialog,
  LhTooltip,
]

/** Vue2 插件：全量注册 */
const install = (Vue: VueConstructor): void => {
  for (const component of lhComponents) {
    Vue.component(component.name, component)
  }
}

export default { install }

export { LhConfigProvider }
export { useLhConfigProvider, useLhConfigContext, CONFIG_PROVIDER_KEY } from './components/config-provider'
export type {
  LhConfigContext,
  LhConfigProviderProps,
  LhThemeableComponent,
  LhConfigContextRef,
} from './components/config-provider'

export {
  LhButton,
  LhIcon,
  LhInput,
  LhTag,
  LhSwitch,
  LhCheckbox,
  LhCheckboxGroup,
  LhRadio,
  LhRadioGroup,
  LhDialog,
  LhTooltip,
}

// locale 响应式适配层与 composables 是公共 API（plus 平价）
export * from './locale'
export * from './composables'

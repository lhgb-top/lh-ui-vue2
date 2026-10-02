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
import type { LhRegistryEntry } from './install'
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
import LhSelect from './components/select'
import LhForm, { LhFormItem } from './components/form'
import LhBadge from './components/badge'
import LhAvatar from './components/avatar'
import LhSpinner from './components/spinner'
import LhDivider from './components/divider'
import LhSpace from './components/space'
import LhCard from './components/card'
import LhEmpty from './components/empty'
import LhSkeleton, { LhSkeletonItem } from './components/skeleton'
import LhAlert from './components/alert'
import LhProgress from './components/progress'
import LhStatistic from './components/statistic'
import LhDescriptions from './components/descriptions'
import LhTimeline, { LhTimelineItem } from './components/timeline'
import LhCollapse, { LhCollapseItem } from './components/collapse'
import LhBreadcrumb, { LhBreadcrumbItem } from './components/breadcrumb'
import LhPagination from './components/pagination'
import LhTabs, { LhTabPane } from './components/tabs'
import LhSteps, { LhStep } from './components/steps'
import LhInputNumber from './components/input-number'
import LhRate from './components/rate'
import LhSegmented from './components/segmented'
import LhSlider from './components/slider'
import LhPopover from './components/popover'
import LhPopconfirm from './components/popconfirm'
import LhDrawer from './components/drawer'
import LhDropdown, { LhDropdownItem } from './components/dropdown'
import LhMessage from './components/message'
import LhNotification from './components/notification'
import LhLoading from './components/loading'
import LhLayout, {
  LhLayoutAside,
  LhLayoutFooter,
  LhLayoutHeader,
  LhLayoutMain,
} from './components/layout'
import LhRow, { LhCol } from './components/grid'
import LhAffix from './components/affix'
import LhBackTop from './components/backtop'
import LhAnchor from './components/anchor'
import LhImage, { LhImageViewer } from './components/image'
import LhMenu, { LhMenuItem, LhMenuItemGroup, LhSubMenu } from './components/menu'
import LhVirtualList from './components/virtual-list'

/** 组件注册表（registry 测试断言此清单；新增组件必须登记；服务条目 install 注册 host/指令） */
export const lhComponents: LhRegistryEntry[] = [
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
  LhSelect,
  LhForm,
  LhFormItem,
  LhBadge,
  LhAvatar,
  LhSpinner,
  LhDivider,
  LhSpace,
  LhCard,
  LhEmpty,
  LhSkeleton,
  LhSkeletonItem,
  LhAlert,
  LhProgress,
  LhStatistic,
  LhDescriptions,
  LhTimeline,
  LhTimelineItem,
  LhCollapse,
  LhCollapseItem,
  LhBreadcrumb,
  LhBreadcrumbItem,
  LhPagination,
  LhTabs,
  LhTabPane,
  LhSteps,
  LhStep,
  LhInputNumber,
  LhRate,
  LhSegmented,
  LhSlider,
  LhPopover,
  LhPopconfirm,
  LhDrawer,
  LhDropdown,
  LhDropdownItem,
  LhMessage,
  LhNotification,
  LhLoading,
  LhLayout,
  LhLayoutHeader,
  LhLayoutAside,
  LhLayoutMain,
  LhLayoutFooter,
  LhRow,
  LhCol,
  LhAffix,
  LhBackTop,
  LhAnchor,
  LhImage,
  LhMenu,
  LhMenuItem,
  LhSubMenu,
  LhMenuItemGroup,
  LhVirtualList,
]

/** Vue2 插件：全量注册（服务条目由自身 install 注册 host 组件 / v-loading 指令） */
const install = (Vue: VueConstructor): void => {
  for (const component of lhComponents) {
    if (typeof component.install === 'function') {
      component.install(Vue)
    } else {
      Vue.component(component.name, component as unknown as VueConstructor)
    }
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
  LhSelect,
  LhForm,
  LhFormItem,
  LhBadge,
  LhAvatar,
  LhSpinner,
  LhDivider,
  LhSpace,
  LhCard,
  LhEmpty,
  LhSkeleton,
  LhSkeletonItem,
  LhAlert,
  LhProgress,
  LhStatistic,
  LhDescriptions,
  LhTimeline,
  LhTimelineItem,
  LhCollapse,
  LhCollapseItem,
  LhBreadcrumb,
  LhBreadcrumbItem,
  LhPagination,
  LhTabs,
  LhTabPane,
  LhSteps,
  LhStep,
  LhInputNumber,
  LhRate,
  LhSegmented,
  LhSlider,
  LhPopover,
  LhPopconfirm,
  LhDrawer,
  LhDropdown,
  LhDropdownItem,
  LhMessage,
  LhNotification,
  LhLoading,
  LhLayout,
  LhLayoutHeader,
  LhLayoutAside,
  LhLayoutMain,
  LhLayoutFooter,
  LhRow,
  LhCol,
  LhAffix,
  LhBackTop,
  LhAnchor,
  LhImage,
  // plus 平价：LhImageViewer 仅命名导出（不进 lhComponents 注册表）
  LhImageViewer,
  LhMenu,
  LhMenuItem,
  LhSubMenu,
  LhMenuItemGroup,
  LhVirtualList,
}

// locale 响应式适配层与 composables 是公共 API（plus 平价）
export * from './locale'
export * from './composables'

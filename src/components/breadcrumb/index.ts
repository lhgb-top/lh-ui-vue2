import LhBreadcrumbSfc from './src/index.vue'
import LhBreadcrumbItemSfc from './src/breadcrumb-item.vue'
import { withInstall } from '../../install'

export { useLhBreadcrumb, useLhBreadcrumbItem } from './src/index'
export type {
  LhBreadcrumbProps,
  LhBreadcrumbItemProps,
  LhBreadcrumbContext,
} from './src/types'

const LhBreadcrumb = withInstall('LhBreadcrumb', LhBreadcrumbSfc)
const LhBreadcrumbItem = withInstall('LhBreadcrumbItem', LhBreadcrumbItemSfc)

export default LhBreadcrumb
export { LhBreadcrumbItem }

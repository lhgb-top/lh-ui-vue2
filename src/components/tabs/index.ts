import LhTabsSfc from './src/index.vue'
import LhTabPaneSfc from './src/tab-pane.vue'
import { withInstall } from '../../install'

export { useLhTabs } from './src/index'
export type { LhTabsProps, LhTabPaneProps, LhTabsContext } from './src/types'

const LhTabs = withInstall('LhTabs', LhTabsSfc)
const LhTabPane = withInstall('LhTabPane', LhTabPaneSfc)

export default LhTabs
export { LhTabPane }

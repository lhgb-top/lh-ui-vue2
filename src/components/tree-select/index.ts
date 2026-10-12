import LhTreeSelectSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTreeSelect } from './src/index'
export type { LhTreeSelectProps, LhTreeNode } from './src/types'

const LhTreeSelect = withInstall('LhTreeSelect', LhTreeSelectSfc)

export default LhTreeSelect

import LhTreeSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTree } from './src/index'
export type { LhTreeFlatItem } from './src/index'
export type { LhTreeProps, LhTreeNode, LhTreeCheckState, LhFlatTreeNode } from './src/types'

const LhTree = withInstall('LhTree', LhTreeSfc)

export default LhTree

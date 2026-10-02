import LhAnchorSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhAnchor } from './src/index'
export type { LhAnchorProps, LhAnchorItem, LhFlatAnchorItem } from './src/types'

const LhAnchor = withInstall('LhAnchor', LhAnchorSfc)

export default LhAnchor
export { LhAnchor }

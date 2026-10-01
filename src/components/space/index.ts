import LhSpaceSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhSpace } from './src/index'
export type { LhSpaceProps } from './src/types'

const LhSpace = withInstall('LhSpace', LhSpaceSfc)

export default LhSpace

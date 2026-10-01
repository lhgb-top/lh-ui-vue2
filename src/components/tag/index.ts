import LhTagSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTag } from './src/index'
export type { LhTagProps, LhTagType, LhTagSize } from './src/types'

const LhTag = withInstall('LhTag', LhTagSfc)

export default LhTag

import LhAffixSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhAffix } from './src/index'
export type { LhAffixProps } from './src/types'

const LhAffix = withInstall('LhAffix', LhAffixSfc)

export default LhAffix
export { LhAffix }

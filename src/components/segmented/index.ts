import LhSegmentedSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhSegmented } from './src/index'
export type { LhSegmentedProps, LhSegmentedInput, LhSegmentedValue } from './src/types'

const LhSegmented = withInstall('LhSegmented', LhSegmentedSfc)

export default LhSegmented

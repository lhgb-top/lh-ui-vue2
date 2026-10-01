import LhRateSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhRate } from './src/index'
export type { LhRateProps } from './src/types'

const LhRate = withInstall('LhRate', LhRateSfc)

export default LhRate

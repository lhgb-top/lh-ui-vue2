import LhProgressSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhProgress } from './src/index'
export type { LhProgressProps, LhProgressStatus, LhProgressType } from './src/types'

const LhProgress = withInstall('LhProgress', LhProgressSfc)

export default LhProgress

import LhSpinnerSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhSpinner } from './src/index'
export type { LhSpinnerProps } from './src/types'

const LhSpinner = withInstall('LhSpinner', LhSpinnerSfc)

export default LhSpinner

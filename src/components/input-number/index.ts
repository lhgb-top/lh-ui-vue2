import LhInputNumberSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhInputNumber } from './src/index'
export type { LhInputNumberProps, LhInputNumberSize } from './src/types'

const LhInputNumber = withInstall('LhInputNumber', LhInputNumberSfc)

export default LhInputNumber

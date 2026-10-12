import LhTransferSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTransfer } from './src/index'
export type { LhTransferProps, LhTransferItem } from './src/types'

const LhTransfer = withInstall('LhTransfer', LhTransferSfc)

export default LhTransfer

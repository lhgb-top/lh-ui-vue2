import LhAlertSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhAlert } from './src/index'
export type { LhAlertProps } from './src/types'

const LhAlert = withInstall('LhAlert', LhAlertSfc)

export default LhAlert

import LhDialogSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhDialog } from './src/index'
export type { LhDialogProps, LhDialogEmits } from './src/types'

const LhDialog = withInstall('LhDialog', LhDialogSfc)

export default LhDialog

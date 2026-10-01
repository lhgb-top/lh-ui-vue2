import LhButtonSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhButton } from './src/index'
export { LH_BUTTON_TYPE_CONST, LH_BUTTON_SIZE_CONST } from './src/types'
export type { LhButtonProps, LhButtonType, LhButtonSize } from './src/types'

const LhButton = withInstall('LhButton', LhButtonSfc)

export default LhButton

import LhInputSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhInput } from './src/index'
export { LH_INPUT_TYPE_CONST, LH_INPUT_STATE_CONST } from './src/types'
export type { LhInputProps, LhInputType, LhInputSize, LhInputState } from './src/types'

const LhInput = withInstall('LhInput', LhInputSfc)

export default LhInput

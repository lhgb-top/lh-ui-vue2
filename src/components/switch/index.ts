import LhSwitchSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhSwitch } from './src/index'
export type { LhSwitchProps, LhSwitchSize } from './src/types'

const LhSwitch = withInstall('LhSwitch', LhSwitchSfc)

export default LhSwitch

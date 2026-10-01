import LhRadioSfc from './src/index.vue'
import LhRadioGroupSfc from './src/group.vue'
import { withInstall } from '../../install'

export { LH_RADIO_GROUP_KEY } from './src/types'
export type { LhRadioProps, LhRadioGroupProps, LhRadioGroupContext, LhRadioSize } from './src/types'

const LhRadio = withInstall('LhRadio', LhRadioSfc)
const LhRadioGroup = withInstall('LhRadioGroup', LhRadioGroupSfc)

export default LhRadio
export { LhRadioGroup }

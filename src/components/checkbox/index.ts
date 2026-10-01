import LhCheckboxSfc from './src/index.vue'
import LhCheckboxGroupSfc from './src/group.vue'
import { withInstall } from '../../install'

export { LH_CHECKBOX_GROUP_KEY } from './src/types'
export type { LhCheckboxProps, LhCheckboxGroupProps, LhCheckboxGroupContext, LhCheckboxSize } from './src/types'

const LhCheckbox = withInstall('LhCheckbox', LhCheckboxSfc)
const LhCheckboxGroup = withInstall('LhCheckboxGroup', LhCheckboxGroupSfc)

export default LhCheckbox
export { LhCheckboxGroup }

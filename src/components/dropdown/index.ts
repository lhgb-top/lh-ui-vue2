import LhDropdownSfc from './src/index.vue'
import LhDropdownItemSfc from './src/item.vue'
import { withInstall } from '../../install'

export { useLhDropdown } from './src/index'
export type {
  LhDropdownProps,
  LhDropdownItemProps,
  LhDropdownContext,
  DropdownItemRecord,
  LhDropdownPlacement,
  LhDropdownTrigger,
} from './src/types'

const LhDropdown = withInstall('LhDropdown', LhDropdownSfc)
const LhDropdownItem = withInstall('LhDropdownItem', LhDropdownItemSfc)

export default LhDropdown
export { LhDropdownItem }

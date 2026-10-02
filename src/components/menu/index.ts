import LhMenuSfc from './src/index.vue'
import LhMenuItemSfc from './src/item.vue'
import LhSubMenuSfc from './src/sub-menu.vue'
import LhMenuItemGroupSfc from './src/item-group.vue'
import { withInstall } from '../../install'

export {
  useLhMenu,
  useLhMenuItem,
  useLhSubMenu,
  useLhMenuItemGroup,
} from './src/index'
export { LH_MENU_KEY } from './src/types'
export type {
  LhMenuProps,
  LhMenuItemProps,
  LhSubMenuProps,
  LhMenuItemGroupProps,
  LhMenuContext,
} from './src/types'
export type { LhMenuMode } from '@lh-ui/share/core/menu'

const LhMenu = withInstall('LhMenu', LhMenuSfc)
const LhMenuItem = withInstall('LhMenuItem', LhMenuItemSfc)
const LhSubMenu = withInstall('LhSubMenu', LhSubMenuSfc)
const LhMenuItemGroup = withInstall('LhMenuItemGroup', LhMenuItemGroupSfc)

export default LhMenu
export { LhMenu, LhMenuItem, LhSubMenu, LhMenuItemGroup }

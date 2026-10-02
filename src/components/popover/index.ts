import LhPopoverSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhPopover } from './src/index'
export type { LhPopoverProps, LhPopoverPlacement, LhPopoverTrigger } from './src/types'

const LhPopover = withInstall('LhPopover', LhPopoverSfc)

export default LhPopover

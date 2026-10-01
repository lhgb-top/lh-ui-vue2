import LhTooltipSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTooltip } from './src/index'
export type {
  LhTooltipProps,
  LhTooltipPlacement,
  LhTooltipTrigger,
  LhTooltipEffect,
  LhTooltipType,
} from './src/types'

const LhTooltip = withInstall('LhTooltip', LhTooltipSfc)

export default LhTooltip

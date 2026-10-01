import LhIconSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhIcon } from './src/index'
export { createIconComponent } from './src/create'
export * from './src/components'
export type { LhIconProps, LhIconSize } from './src/types'

const LhIcon = withInstall('LhIcon', LhIconSfc)

export default LhIcon

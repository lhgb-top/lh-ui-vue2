import LhDividerSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhDivider } from './src/index'
export type { LhDividerProps } from './src/types'

const LhDivider = withInstall('LhDivider', LhDividerSfc)

export default LhDivider

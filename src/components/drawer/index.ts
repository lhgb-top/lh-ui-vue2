import LhDrawerSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhDrawer } from './src/index'
export type { LhDrawerProps, LhDrawerDirection } from './src/types'

const LhDrawer = withInstall('LhDrawer', LhDrawerSfc)

export default LhDrawer

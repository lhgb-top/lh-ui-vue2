import LhBackTopSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhBackTop } from './src/index'
export type { LhBackTopProps } from './src/types'

const LhBackTop = withInstall('LhBackTop', LhBackTopSfc)

export default LhBackTop
export { LhBackTop }

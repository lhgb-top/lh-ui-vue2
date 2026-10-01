import LhEmptySfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhEmpty } from './src/index'
export type { LhEmptyProps } from './src/types'

const LhEmpty = withInstall('LhEmpty', LhEmptySfc)

export default LhEmpty

import LhCascaderSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhCascader } from './src/index'
export type { LhCascaderProps, LhCascaderNode, LhCascaderItemConfig } from './src/types'

const LhCascader = withInstall('LhCascader', LhCascaderSfc)

export default LhCascader

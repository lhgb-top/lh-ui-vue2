import LhRowSfc from './src/row.vue'
import LhColSfc from './src/col.vue'
import { withInstall } from '../../install'

export type { LhRowProps, LhRowJustify, LhRowAlign, LhColProps } from './src/types'

// plus 的 grid 目录没有 index.vue（row/col 由根注册表直引）；
// vue2 目录契约要求 index.ts，故在目录级同时注册 LhRow 与 LhCol
const LhRow = withInstall('LhRow', LhRowSfc)
const LhCol = withInstall('LhCol', LhColSfc)

export default LhRow
export { LhRow, LhCol }

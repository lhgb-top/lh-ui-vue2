import LhTableSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTable } from './src/index'
export type { LhTableProps, LhTableColumn, LhTableRow, LhTableSortOrder } from './src/types'

const LhTable = withInstall('LhTable', LhTableSfc)

export default LhTable

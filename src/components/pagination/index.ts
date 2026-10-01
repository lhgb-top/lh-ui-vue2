import LhPaginationSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhPagination } from './src/index'
export type { LhPaginationProps } from './src/types'

const LhPagination = withInstall('LhPagination', LhPaginationSfc)

export default LhPagination

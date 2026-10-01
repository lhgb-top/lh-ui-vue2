import LhSelectSfc from './src/index.vue'
import { withInstall } from '../../install'

export type { LhSelectProps, LhSelectSize, LhSelectOption } from './src/types'

const LhSelect = withInstall('LhSelect', LhSelectSfc)

export default LhSelect

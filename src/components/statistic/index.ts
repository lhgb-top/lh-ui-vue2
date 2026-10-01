import LhStatisticSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhStatistic } from './src/index'
export type { LhStatisticProps } from './src/types'

const LhStatistic = withInstall('LhStatistic', LhStatisticSfc)

export default LhStatistic

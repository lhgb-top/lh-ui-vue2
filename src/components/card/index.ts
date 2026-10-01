import LhCardSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhCard } from './src/index'
export type { LhCardProps } from './src/types'

const LhCard = withInstall('LhCard', LhCardSfc)

export default LhCard

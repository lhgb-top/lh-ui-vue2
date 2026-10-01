import LhDescriptionsSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhDescriptions } from './src/index'
export type { LhDescriptionsProps, LhDescriptionsItem } from './src/types'

const LhDescriptions = withInstall('LhDescriptions', LhDescriptionsSfc)

export default LhDescriptions

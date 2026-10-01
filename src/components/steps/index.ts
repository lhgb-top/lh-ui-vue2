import LhStepsSfc from './src/index.vue'
import LhStepSfc from './src/step.vue'
import { withInstall } from '../../install'

export { useLhSteps, useLhStep } from './src/index'
export type { LhStepsProps, LhStepProps, LhStepsContext } from './src/types'

const LhSteps = withInstall('LhSteps', LhStepsSfc)
const LhStep = withInstall('LhStep', LhStepSfc)

export default LhSteps
export { LhStep }

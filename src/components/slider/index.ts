import LhSliderSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhSlider } from './src/index'
export type { LhSliderProps, LhSliderSize } from './src/types'

const LhSlider = withInstall('LhSlider', LhSliderSfc)

export default LhSlider

import LhTimePickerSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhTimePicker } from './src/index'
export type { LhTimePickerProps } from './src/types'

const LhTimePicker = withInstall('LhTimePicker', LhTimePickerSfc)

export default LhTimePicker

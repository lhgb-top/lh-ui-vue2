import LhDatePickerSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhDatePicker } from './src/index'
export type { LhDatePickerProps } from './src/types'

const LhDatePicker = withInstall('LhDatePicker', LhDatePickerSfc)

export default LhDatePicker

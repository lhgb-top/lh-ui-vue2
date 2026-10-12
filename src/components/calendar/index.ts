import LhCalendarSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhCalendar } from './src/index'
export type { LhCalendarProps, LhCalendarMode, LhCalendarRange, LhCalendarSelection, LhCalendarValue } from './src/types'

const LhCalendar = withInstall('LhCalendar', LhCalendarSfc)

export default LhCalendar

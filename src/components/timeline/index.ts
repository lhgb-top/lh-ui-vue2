import LhTimelineSfc from './src/index.vue'
import LhTimelineItemSfc from './src/item.vue'
import { withInstall } from '../../install'

export { useLhTimeline, useLhTimelineItem } from './src/index'
export type { LhTimelineProps, LhTimelineItemProps, LhTimelineContext } from './src/types'

const LhTimeline = withInstall('LhTimeline', LhTimelineSfc)
const LhTimelineItem = withInstall('LhTimelineItem', LhTimelineItemSfc)

export default LhTimeline
export { LhTimelineItem }

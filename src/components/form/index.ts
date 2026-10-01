import LhFormSfc from './src/index.vue'
import LhFormItemSfc from './src/item.vue'
import { withInstall } from '../../install'

export { LH_FORM_CONTEXT_KEY, LH_FORM_ITEM_CONTEXT_KEY } from './src/types'
export type {
  LhFormProps,
  LhFormItemProps,
  LhFormContext,
  LhFormItemContext,
  LhFormLabelPosition,
} from './src/types'
export type { LhFormRule } from './src/types'

const LhForm = withInstall('LhForm', LhFormSfc)
const LhFormItem = withInstall('LhFormItem', LhFormItemSfc)

export default LhForm
export { LhFormItem }

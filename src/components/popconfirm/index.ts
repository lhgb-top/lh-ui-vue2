import LhPopconfirmSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhPopconfirm } from './src/index'
export type {
  LhPopconfirmProps,
  LhPopconfirmPlacement,
  LhPopconfirmType,
  LhPopconfirmTrigger,
} from './src/types'

const LhPopconfirm = withInstall('LhPopconfirm', LhPopconfirmSfc)

export default LhPopconfirm

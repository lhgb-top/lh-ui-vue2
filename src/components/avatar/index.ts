import LhAvatarSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhAvatar } from './src/index'
export type { LhAvatarProps, LhAvatarSize } from './src/types'

const LhAvatar = withInstall('LhAvatar', LhAvatarSfc)

export default LhAvatar

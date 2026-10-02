import LhImageSfc from './src/index.vue'
import LhImageViewerSfc from './src/viewer.vue'
import { withInstall } from '../../install'

export { useLhImage, useLhImageViewer } from './src/index'
export type { LhImageProps, LhImageViewerProps } from './src/types'

const LhImage = withInstall('LhImage', LhImageSfc)
const LhImageViewer = withInstall('LhImageViewer', LhImageViewerSfc)

export default LhImage
// plus 中 LhImageViewer 仅命名导出（不进 lhComponents 注册表），此处保持平价
export { LhImage, LhImageViewer }

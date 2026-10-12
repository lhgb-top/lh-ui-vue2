import LhUploadSfc from './src/index.vue'
import { withInstall } from '../../install'

export { useLhUpload } from './src/index'
export type { LhUploadProps, LhUploadFile, LhUploadRequest } from './src/types'

const LhUpload = withInstall('LhUpload', LhUploadSfc)

export default LhUpload

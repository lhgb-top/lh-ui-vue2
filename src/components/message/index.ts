import { LhMessage } from './src/index'
import type { LhRegistryEntry } from '../../install'

export { LhMessage } from './src/index'
export type {
  LhMessageOptions,
  LhMessageHandle,
  LhMessageProps,
  LhMessageConfig,
  LhMessageRecord,
  LhMessageType,
} from './src/types'

/** registry 条目：服务对象（install 注册 host 组件） */
const entry = LhMessage as unknown as LhRegistryEntry & typeof LhMessage & { name: string }

export default entry

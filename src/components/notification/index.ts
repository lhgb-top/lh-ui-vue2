import { LhNotification } from './src/index'
import type { LhRegistryEntry } from '../../install'

export { LhNotification } from './src/index'
export type {
  LhNotificationOptions,
  LhNotificationHandle,
  LhNotificationProps,
  LhNotificationConfig,
  LhNotificationRecord,
  LhNotificationType,
  LhNotificationPosition,
} from './src/types'

/** registry 条目：服务对象（install 注册 host 组件） */
const entry = LhNotification as unknown as LhRegistryEntry & typeof LhNotification & { name: string }

export default entry

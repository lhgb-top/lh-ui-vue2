import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

export interface LhTransferProps {
  /** 全量数据 */
  data: LhTransferItem[]
  /** 左侧（源）键列表（v-model；未传时内部兜底为空即全部在右） */
  value?: Array<string | number>
  /** 禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhTransferItem } from '@lh-ui/share/core/transfer'

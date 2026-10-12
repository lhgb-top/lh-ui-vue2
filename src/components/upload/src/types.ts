import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhUploadRequest } from '@lh-ui/share/core/upload'

export interface LhUploadProps {
  /** 多选 */
  multiple?: boolean
  /** 拖拽上传模式 */
  drag?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 接受的文件类型（'.png,.jpg' 或数组） */
  accept?: string | string[]
  /** 单文件大小上限（字节） */
  maxSize?: number
  /** 文件数量上限（0 为不限） */
  maxCount?: number
  /** 上传请求函数（库不内置 HTTP 客户端） */
  request?: LhUploadRequest
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhUploadFile, LhUploadRequest } from '@lh-ui/share/core/upload'

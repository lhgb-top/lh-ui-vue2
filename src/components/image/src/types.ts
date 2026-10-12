import type { LhSxProps } from '@lh-ui/share/core/shared/sx'
import type { LhImageFit } from '@lh-ui/share/core/image'

export interface LhImageProps {
  /** 图片地址 */
  src: string
  /** 替代文本（a11y 强约束，TS 层必填） */
  alt: string
  /** 裁切模式（原生 object-fit） */
  fit?: LhImageFit
  /** 是否可点击预览 */
  preview?: boolean
  /** 预览图列表（未传时退化为 [src]） */
  previewSrcList?: string[]
  /** 原生懒加载（loading="lazy"） */
  lazy?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** 预览器 props（LhImageViewer 独立导出） */
export interface LhImageViewerProps {
  /** 预览图列表 */
  images: string[]
  /** 初始下标 */
  initialIndex?: number
  /** sx 快速布局属性（作用于预览图） */
  sx?: LhSxProps
}

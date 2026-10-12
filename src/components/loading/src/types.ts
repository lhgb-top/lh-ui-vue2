import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

export type { LhLoadingHandle, LhLoadingOptions } from '@lh-ui/share/core/loading'

/** 遮罩组件 props（服务/指令内部渲染） */
export interface LhLoadingMaskProps {
  /** 是否全屏（目标是 body 时为 true） */
  fullscreen?: boolean
  /** 加载提示文案（未传时取语言包 loading.text） */
  text?: string
  /** 遮罩背景色（CSS background 值） */
  background?: string
  /** 层级 */
  zIndex?: number
  /** 是否显示旋转图标（默认 true） */
  spinner?: boolean
  sx?: LhSxProps
}

/**
 * 创建独立图标组件的工厂函数
 * 每个图标可单独导入使用，支持 tree-shaking
 *
 * Vue2 render 函数注意：原生 SVG 属性必须写进 data.attrs（Vue3 可平铺，Vue2 不行）
 */
import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { LH_ICON_SVGS_CONST, getIconSize } from '@lh-ui/share/core/icon'
import type { LhIconName } from '@lh-ui/share/core/icon'

export function createIconComponent(name: LhIconName) {
  const path = LH_ICON_SVGS_CONST[name]
  // 转换名称：star → LhIconStar, arrow-up → LhIconArrowUp
  const componentName = `LhIcon${name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())}`
  const isSpin = name === 'loading'

  return defineComponent({
    name: componentName,
    props: {
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      color: { type: String, default: undefined },
    },
    setup(props) {
      return () => {
        const sizeNum = getIconSize(props.size)
        const style: Record<string, string> = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${sizeNum}px`,
          height: `${sizeNum}px`,
          color: props.color || 'currentColor',
        }
        const classes = ['lh-icon', isSpin ? 'lh-icon--loading' : ''].filter(Boolean).join(' ')

        return h(
          'span',
          { class: classes, style },
          [
            h(
              'svg',
              { attrs: { viewBox: '0 0 24 24', width: sizeNum, height: sizeNum, fill: 'currentColor' } },
              [h('path', { attrs: { d: path } })],
            ),
          ],
        )
      }
    },
  })
}

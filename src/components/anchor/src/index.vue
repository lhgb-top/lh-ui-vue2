<template>
  <nav
    :class="anchorClasses"
    :style="anchorStyle"
    :aria-label="ariaLabel"
  >
    <ul class="lh-anchor__list">
      <li
        v-for="item in flatItems"
        :key="item.id"
        class="lh-anchor__item"
      >
        <a
          :href="`#${item.id}`"
          :class="linkClasses(item.id, item.level)"
          :aria-current="activeId === item.id ? 'location' : undefined"
          @click.prevent="scrollToAnchor(item.id)"
        >{{ item.title }}</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhAnchor' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhAnchor } from './index'
import type { LhAnchorItem } from '@lh-ui/share/core/anchor'
import type { LhAnchorProps } from './types'
import { isValidElementOrSelector } from '../../../utils/element-prop'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  items: { type: Array as PropType<LhAnchorItem[]>, required: true },
  target: { validator: isValidElementOrSelector, default: undefined } as PropType<string | HTMLElement>,
  offset: { type: Number, default: 0 },
  direction: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
  smooth: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhAnchorProps['sx']>, default: undefined },
})

const emit = defineEmits(['change', 'click'])

const {
  flatItems,
  activeId,
  linkClasses,
  anchorClasses,
  anchorStyle,
  ariaLabel,
  scrollToAnchor,
} = useLhAnchor(props, emit)
</script>

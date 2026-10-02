<template>
  <div
    ref="rootRef"
    :class="listClasses"
    :style="listStyle"
    @scroll="onScroll"
  >
    <div
      class="lh-virtual-list__phantom"
      :style="{ height: `${totalHeight}px` }"
    >
      <div
        class="lh-virtual-list__window"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="index in visibleIndexes"
          :key="index"
          class="lh-virtual-list__item"
          :style="itemStyle(index)"
        >
          <slot
            :item="props.data[index]"
            :index="index"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhVirtualList' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhVirtualList } from './index'
import type { LhVirtualListProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  data: { type: Array as PropType<any[]>, required: true },
  height: { type: [Number, String] as PropType<number | string>, required: true },
  itemHeight: { type: Number, default: undefined },
  itemSize: { type: Function as PropType<(index: number) => number>, default: undefined },
  overscan: { type: Number, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhVirtualListProps['sx']>, default: undefined },
})

const { rootRef, totalHeight, offsetY, visibleIndexes, itemStyle, onScroll, listClasses, listStyle } =
  useLhVirtualList(props)
</script>

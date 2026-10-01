<template>
  <div
    :class="descriptionsClasses"
    :style="sxStyle"
  >
    <div
      v-if="props.title || $slots.title"
      class="lh-descriptions__header"
    >
      <slot name="title">{{ props.title }}</slot>
    </div>
    <div class="lh-descriptions__body">
      <dl
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="lh-descriptions__row"
        :style="{ display: 'flex' }"
      >
        <!-- 2.7 v-for 的 key 必须落在真实子元素上（Vue3 才允许 template 挂 key） -->
        <template v-for="(cell, cellIndex) in row.cells">
          <dt
            :key="`label-${rowIndex}-${cellIndex}`"
            class="lh-descriptions__label"
            :style="{ flex: `0 0 ${labelBasis()}%` }"
          >
            {{ cell.item.label }}
          </dt>
          <dd
            :key="`content-${rowIndex}-${cellIndex}`"
            class="lh-descriptions__content"
            :style="{ flex: `0 0 ${contentBasis(cell.span)}%` }"
          >
            <slot
              :item="cell.item"
              :name="`item-${cellIndex}`"
            >
              {{ cell.item.value }}
            </slot>
          </dd>
        </template>
        <div
          v-if="row.filler > 0"
          class="lh-descriptions__filler"
          :style="{ flex: `0 0 ${contentBasis(row.filler)}%` }"
          aria-hidden="true"
        ></div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhDescriptions' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhDescriptions } from './index'
import type { LhDescriptionsProps, LhDescriptionsItem } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  title: { type: String, default: undefined },
  column: { type: Number, default: 3 },
  border: { type: Boolean, default: false },
  items: { type: Array as PropType<LhDescriptionsItem[]>, default: () => [] },
  sx: { type: [Object, Array, String] as PropType<LhDescriptionsProps['sx']>, default: undefined },
})

const { sxStyle, rows, descriptionsClasses, labelBasis, contentBasis } = useLhDescriptions(props)
</script>

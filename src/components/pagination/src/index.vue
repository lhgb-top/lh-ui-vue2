<template>
  <nav
    class="lh-pagination"
    :class="[
      `lh-pagination--${simple ? 'simple' : 'full'}`,
      { 'lh-pagination--disabled': disabled },
    ]"
    :style="rootStyle"
    aria-label="pagination"
  >
    <span
      v-if="showTotal"
      class="lh-pagination__total"
    >{{ totalText }}</span>

    <button
      type="button"
      class="lh-pagination__btn lh-pagination__btn--prev"
      :disabled="disabled || innerCurrent <= 1"
      :aria-label="prevLabel"
      @click="go(innerCurrent - 1)"
    >
      <span aria-hidden="true">‹</span>
    </button>

    <template v-if="!simple">
      <ul class="lh-pagination__pages">
        <li
          v-for="(item, index) in range"
          :key="index"
          class="lh-pagination__cell"
        >
          <button
            v-if="item.type === 'page'"
            type="button"
            class="lh-pagination__btn lh-pagination__page"
            :class="{ 'lh-pagination__page--active': item.page === innerCurrent }"
            :disabled="disabled"
            :aria-label="pageLabel(item.page)"
            :aria-current="item.page === innerCurrent ? 'page' : undefined"
            @click="go(item.page)"
          >{{ item.page }}</button>
          <span
            v-else
            class="lh-pagination__ellipsis"
            aria-hidden="true"
          >•••</span>
        </li>
      </ul>
    </template>

    <span
      v-else
      class="lh-pagination__simple-text"
    >{{ innerCurrent }} / {{ pageCount }}</span>

    <button
      type="button"
      class="lh-pagination__btn lh-pagination__btn--next"
      :disabled="disabled || innerCurrent >= pageCount"
      :aria-label="nextLabel"
      @click="go(innerCurrent + 1)"
    >
      <span aria-hidden="true">›</span>
    </button>

    <label
      v-if="showSizeChanger"
      class="lh-pagination__size"
    >
      <span class="lh-pagination__size-label">{{ sizeChangerLabel }}</span>
      <select
        v-model.number="innerPageSize"
        class="lh-pagination__size-select"
        :disabled="disabled"
        :aria-label="sizeChangerLabel"
        @change="handleSizeChange"
      >
        <option
          v-for="size in pageSizes"
          :key="size"
          :value="size"
        >{{ sizeText(size) }}</option>
      </select>
    </label>

    <span
      v-if="showJumper"
      class="lh-pagination__jumper"
    >
      <label
        class="lh-pagination__jumper-label"
        :for="jumperId"
      >{{ gotoLabel }}</label>
      <input
        :id="jumperId"
        v-model.number="jumpPage"
        type="number"
        min="1"
        :max="pageCount"
        class="lh-pagination__jumper-input"
        :disabled="disabled"
        @keydown.enter="handleJump"
        @blur="handleJump"
      >
      <span
        v-if="pageSuffixText"
        class="lh-pagination__jumper-suffix"
      >{{ pageSuffixText }}</span>
    </span>
  </nav>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhPagination' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhPagination } from './index'
import type { LhPaginationProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
  current: { type: Number, default: undefined },
  pageSizes: { type: Array as PropType<number[]>, default: () => [10, 20, 30, 40] },
  showTotal: { type: Boolean, default: false },
  showSizeChanger: { type: Boolean, default: false },
  showJumper: { type: Boolean, default: false },
  simple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhPaginationProps['sx']>, default: undefined },
})

const emit = defineEmits(['update:current', 'update:pageSize', 'change', 'size-change'])

const {
  innerCurrent,
  innerPageSize,
  pageCount,
  range,
  go,
  handleSizeChange,
  jumpPage,
  jumperId,
  handleJump,
  totalText,
  prevLabel,
  nextLabel,
  gotoLabel,
  pageSuffixText,
  sizeChangerLabel,
  pageLabel,
  sizeText,
  rootStyle,
} = useLhPagination(props, emit)
</script>

<template>
  <div
    :class="emptyClasses"
    :style="emptyStyle"
    role="status"
  >
    <!-- 视觉区：自定义图片 > 默认内联插画 -->
    <div
      v-if="props.image || $slots.default"
      class="lh-empty__image lh-empty__image--custom"
    >
      <slot>
        <img
          :src="props.image"
          alt=""
        />
      </slot>
    </div>
    <div
      v-else
      class="lh-empty__image"
      aria-hidden="true"
    >
      <!-- 默认插画：留白构图，主题变量着色 -->
      <svg
        class="lh-empty__illustration"
        viewBox="0 0 96 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          class="lh-empty__ink-wash"
          cx="48"
          cy="58"
          rx="30"
          ry="6"
        />
        <rect
          x="24"
          y="22"
          width="48"
          height="32"
          rx="4"
          class="lh-empty__ink-frame"
        />
        <path
          d="M38 44 L48 30 L58 44"
          class="lh-empty__ink-mountain"
        />
        <circle
          cx="62"
          cy="30"
          r="4"
          class="lh-empty__ink-seal"
        />
      </svg>
    </div>

    <!-- 描述文案：插槽 > props > 语言包 -->
    <p class="lh-empty__description">
      <slot name="description">{{ description }}</slot>
    </p>

    <!-- 动作区 -->
    <div
      v-if="$slots.actions"
      class="lh-empty__actions"
    >
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhEmpty' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhEmpty } from './index'
import type { LhEmptyProps } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  description: { type: String, default: undefined },
  image: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhEmptyProps['sx']>, default: undefined },
})

const { emptyClasses, emptyStyle, description } = useLhEmpty(props)
</script>

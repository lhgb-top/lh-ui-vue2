<template>
  <!--
    Vue2 单根约束（红线 #2）：transition 作根在隐藏时退化为注释节点，
    包一层中性容器保证根元素稳定；按钮为 fixed 定位不受容器影响
  -->
  <div class="lh-backtop-host">
    <transition name="lh-backtop-fade">
      <button
        v-if="visible"
        type="button"
        :class="backTopClasses"
        :style="backTopStyle"
        :aria-label="ariaLabel"
        @click="handleClick"
      >
        <slot>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12 5l7 7-1.4 1.4L13 8.8V19h-2V8.8l-4.6 4.6L5 12z"
            />
          </svg>
        </slot>
      </button>
    </transition>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhBackTop' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhBackTop } from './index'
import type { LhBackTopProps } from './types'
import { isValidElementOrSelector } from '../../../utils/element-prop'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（红线 #2）
 */
const props = defineProps({
  target: { validator: isValidElementOrSelector, default: undefined } as PropType<string | HTMLElement>,
  // 与 core 的 LH_BACKTOP_VISIBILITY_HEIGHT_DEFAULT 保持一致
  visibilityHeight: { type: Number, default: 200 },
  right: { type: Number, default: 40 },
  bottom: { type: Number, default: 40 },
  smooth: { type: Boolean, default: true },
  sx: { type: [Object, Array, String] as PropType<LhBackTopProps['sx']>, default: undefined },
})

const emit = defineEmits(['click', 'scrollend'])

const { visible, handleClick, backTopClasses, backTopStyle, ariaLabel } = useLhBackTop(props, emit)
</script>

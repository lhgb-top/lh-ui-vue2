<template>
  <li
    v-if="ownIndex >= 0"
    :data-lh-step-item="uid"
    :class="itemClasses"
    :aria-current="status === 'process' ? 'step' : undefined"
  >
    <component
      :is="isButton ? 'button' : 'span'"
      class="lh-steps__head"
      v-bind="headBind"
      v-on="headOn"
    >
      <span
        class="lh-steps__icon"
        aria-hidden="true"
      >
        <i
          v-if="icon"
          :class="icon"
        ></i>
        <span v-else>{{ iconChar }}</span>
      </span>
    </component>
    <div class="lh-steps__main">
      <div class="lh-steps__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        v-if="description || $slots.description"
        class="lh-steps__description"
      >
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhStep' }
</script>

<script lang="ts" setup>
import { useLhStep } from './index'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
})

const { ownIndex, uid, status, isButton, itemClasses, iconChar, headBind, headOn } = useLhStep(props)
</script>

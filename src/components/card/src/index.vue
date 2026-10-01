<template>
  <div
    :class="cardClasses"
    :style="cardStyle"
    :role="interactivity === 'interactive' ? 'button' : undefined"
    :tabindex="interactivity === 'interactive' ? 0 : undefined"
    :aria-busy="props.loading ? true : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 封面 -->
    <div
      v-if="$slots.cover"
      class="lh-card__cover"
    >
      <slot name="cover"></slot>
    </div>

    <!-- 头部 -->
    <div
      v-if="$slots.header || props.title"
      class="lh-card__header"
    >
      <slot name="header">
        <span class="lh-card__title">{{ props.title }}</span>
      </slot>
      <span
        v-if="$slots.extra"
        class="lh-card__extra"
      >
        <slot name="extra"></slot>
      </span>
    </div>

    <!-- 主体 -->
    <div class="lh-card__body">
      <slot v-if="!props.loading"></slot>
      <div
        v-else
        class="lh-card__loading"
        aria-hidden="true"
      >
        <div class="lh-card__loading-line lh-card__loading-line--wide"></div>
        <div class="lh-card__loading-line"></div>
        <div class="lh-card__loading-line lh-card__loading-line--narrow"></div>
      </div>
    </div>

    <!-- 底部 -->
    <div
      v-if="$slots.footer"
      class="lh-card__footer"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhCard' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhCard } from './index'
import type { LhCardProps, LhCardShadow } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  title: { type: String, default: undefined },
  shadow: { type: String as PropType<LhCardShadow>, default: 'always' },
  clickable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhCardProps['sx']>, default: undefined },
})

const emit = defineEmits(['click'])

const { cardClasses, cardStyle, interactivity, onCardKeydown } = useLhCard(props)

function handleClick(e: MouseEvent) {
  if (interactivity.value !== 'interactive') return
  emit('click', e)
}

function handleKeydown(e: KeyboardEvent) {
  onCardKeydown(e, emit)
}
</script>

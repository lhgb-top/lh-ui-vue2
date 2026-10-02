<template>
  <!-- 2.7 无 Teleport：host 根元素在 mounted 时挂到 body。v-if 放在内容层，host 始终存在 -->
  <div
    ref="rootRef"
    class="lh-drawer__host"
  >
    <transition name="lh-drawer-fade">
      <div
        v-if="isVisible"
        :id="drawerId"
        :class="drawerClass"
        :style="rootStyle"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="hasTitle ? titleId : undefined"
        :aria-label="hasTitle ? undefined : defaultTitle"
      >
        <div
          class="lh-drawer__mask"
          aria-hidden="true"
          @click="handleMaskClick"
        ></div>
        <div
          ref="panelRef"
          :class="panelClass"
          :style="panelStyle"
        >
          <div
            v-if="hasHeader"
            class="lh-drawer__header"
          >
            <div
              :id="titleId"
              class="lh-drawer__title"
            >
              <slot name="header">{{ title }}</slot>
            </div>
            <button
              v-if="showClose"
              type="button"
              class="lh-drawer__close"
              :aria-label="closeLabel"
              @click="close"
            >
              <LhIcon
                name="close"
                aria-hidden="true"
              />
            </button>
          </div>
          <div class="lh-drawer__body">
            <slot></slot>
          </div>
          <div
            v-if="$slots.footer"
            class="lh-drawer__footer"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
// v-model 走 modelValue prop / input 事件
export default {
  name: 'LhDrawer',
  model: { prop: 'modelValue', event: 'input' },
}
</script>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import type { PropType } from 'vue'
import { useLhDrawer } from './index'
import LhIcon from '../../icon'
import type { LhDrawerProps, LhDrawerDirection } from './types'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：运行时声明 + PropType（AGENTS.md 红线 #2）
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: undefined },
  direction: { type: String as PropType<LhDrawerDirection>, default: 'right' },
  size: { type: [String, Number] as PropType<LhDrawerProps['size']>, default: '30%' },
  maskClosable: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  teleportTarget: {
    type: [String, Object] as PropType<LhDrawerProps['teleportTarget']>,
    default: 'body',
  },
  lockScroll: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true },
  themeVars: { type: Object as PropType<Record<string, string>>, default: undefined },
  bgPattern: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhDrawerProps['sx']>, default: undefined },
})

const emit = defineEmits(['input', 'open', 'close'])

const slots = useSlots()
const hasHeader = computed(() => !!slots.header || !!props.title || props.showClose)
const hasTitle = computed(() => !!slots.header || !!props.title)

const {
  drawerId,
  titleId,
  panelRef,
  isVisible,
  drawerClass,
  panelStyle,
  rootStyle,
  closeLabel,
  defaultTitle,
  open,
  close,
  handleMaskClick,
} = useLhDrawer(props, emit)

const panelClass = computed(() => [
  'lh-drawer__panel',
  `lh-drawer__panel--${props.direction ?? 'right'}`,
])

// 2.7 无 Teleport：host 根元素在 mounted 时挂到 teleportTarget，卸载前由 Vue 正常销毁
const rootRef = ref<HTMLElement | null>(null)
onMounted(() => {
  const target =
    typeof props.teleportTarget === 'string'
      ? (document.querySelector(props.teleportTarget) as HTMLElement | null) ?? document.body
      : (props.teleportTarget ?? document.body)
  if (rootRef.value && rootRef.value.parentElement !== target) {
    target.appendChild(rootRef.value)
  }
})
onBeforeUnmount(() => {
  rootRef.value?.remove()
})

defineExpose({ isVisible, open, close })
</script>

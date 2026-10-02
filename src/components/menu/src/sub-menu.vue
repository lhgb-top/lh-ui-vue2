<template>
  <li
    :class="subMenuClasses"
    :style="subMenuStyle"
  >
    <!-- 标题（触发器） -->
    <div
      ref="titleRef"
      class="lh-sub-menu__title"
      role="menuitem"
      :aria-expanded="opened ? 'true' : 'false'"
      aria-haspopup="true"
      :aria-controls="panelId"
      :aria-disabled="props.disabled || undefined"
      :tabindex="props.disabled ? -1 : 0"
      @click="handleTitleClick"
      @mouseenter="handleTitleMouseenter"
      @mouseleave="handleTitleMouseleave"
      @keydown="handleTitleKeydown($event, focusFirstPanelItem)"
    >
      <slot name="title">{{ props.title }}</slot>
      <span
        class="lh-sub-menu__arrow"
        aria-hidden="true"
      >▾</span>
    </div>

    <!-- 内联展开（垂直非折叠模式） -->
    <div
      v-if="!isPopper"
      :id="panelId"
      key="inline"
      class="lh-sub-menu__inline"
      role="menu"
      :aria-hidden="opened ? 'false' : 'true'"
    >
      <div class="lh-sub-menu__inline-content">
        <slot></slot>
      </div>
    </div>

    <!--
      飞出面板（水平 / 折叠模式）。Vue2 无 Teleport（红线 #4）：host 在 mounted 移到
      body；始终渲染并以 key 定位，避免被补丁移位后锚点失效
    -->
    <div
      ref="popperHostRef"
      key="popper-host"
      class="lh-sub-menu__popper-host"
    >
      <transition name="lh-sub-menu-fade">
        <ul
          v-if="isPopper && opened"
          :id="panelId"
          ref="popperRef"
          class="lh-sub-menu__popper"
          role="menu"
          :style="panelStyle"
          @mouseenter="handlePanelMouseenter"
          @mouseleave="handlePanelMouseleave"
        >
          <slot></slot>
        </ul>
      </transition>
    </div>
  </li>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhSubMenu' }
</script>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { useLhSubMenu } from './index'
import { useLhPopper } from '../../../composables/overlay'
import { useLhZIndex } from '../../../composables'
import type { LhSubMenuProps } from './types'

const props = defineProps({
  index: { type: String, required: true },
  title: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  sx: { type: [Object, Array, String] as PropType<LhSubMenuProps['sx']>, default: undefined },
})

const emit = defineEmits(['select'])

const titleRef = ref<HTMLElement | null>(null)
const popperHostRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)

const {
  panelId,
  isPopper,
  opened,
  depth,
  handleTitleClick,
  handleTitleMouseenter,
  handleTitleMouseleave,
  handlePanelMouseenter,
  handlePanelMouseleave,
  handleTitleKeydown,
  subMenuClasses,
  subMenuStyle,
} = useLhSubMenu(props, emit)

const { zIndex } = useLhZIndex()
const { popperStyle } = useLhPopper({
  triggerRef: titleRef,
  popperRef,
  visible: opened,
  // 顶层子菜单从触发器下方展开；嵌套层级从右侧展开
  placement: computed(() => (depth() > 0 ? 'right-start' : 'bottom-start')),
})

/** 飞出面板定位样式（fixed）+ z-index */
const panelStyle = computed(() => ({
  ...popperStyle.value,
  zIndex: String(zIndex.value),
}))

/**
 * Vue2 无 Teleport（红线 #4）：mounted 时把飞出面板 host 移到 body，
 * 组件保持完整的响应式连接；销毁时主动移除防泄漏
 */
onMounted(() => {
  const host = popperHostRef.value
  if (host && host.parentElement !== document.body) {
    document.body.appendChild(host)
  }
})

onBeforeUnmount(() => {
  popperHostRef.value?.remove()
})

/** 展开键触发后聚焦面板首项（DOM 查询须在拿到模板 ref 的 SFC 内做） */
function focusFirstPanelItem(): void {
  const panel = isPopper.value ? popperRef.value : titleRef.value?.parentElement
  if (!panel) return
  const items = panel.querySelectorAll<HTMLElement>('[role="menuitem"]')
  const first = Array.from(items).find((el) => el.tabIndex !== -1)
  first?.focus()
}
</script>

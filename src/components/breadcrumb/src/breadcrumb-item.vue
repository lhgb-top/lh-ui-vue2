<template>
  <!-- 2.7 单根限制：plus 的 template v-if 双 li 根改为 display:contents 中性容器包裹
       （breadcrumb 样式无 > 子代选择器依赖，布局不受影响） -->
  <span
    v-if="ownIndex >= 0 && !isHidden"
    style="display: contents"
  >
    <li
      v-if="showEllipsisBefore"
      class="lh-breadcrumb__ellipsis"
    >
      <button
        type="button"
        class="lh-breadcrumb__ellipsis-btn"
        :aria-label="moreLabel"
        @click="expand"
      >
        <span
          aria-hidden="true"
        >•••</span>
      </button>
    </li>
    <li :class="itemClasses">
      <a
        v-if="isLink"
        :href="to"
        class="lh-breadcrumb__link"
        @click="handleClick"
      >
        <slot></slot>
      </a>
      <span
        v-else
        class="lh-breadcrumb__text"
        :aria-current="isLast ? 'page' : undefined"
      >
        <slot></slot>
      </span>
      <span
        v-if="!isLast"
        class="lh-breadcrumb__separator"
        aria-hidden="true"
      >
        <slot name="separator">{{ separatorText }}</slot>
      </span>
    </li>
  </span>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhBreadcrumbItem' }
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue'
import { useLhBreadcrumbItem } from './index'
import { t } from '../../../locale'

/**
 * 2.7 type-only defineProps 不支持跨文件 interface：本组件 Props 就地声明
 */
const props = defineProps({
  to: { type: String, default: undefined },
  replace: { type: Boolean, default: false },
})

const { ownIndex, isLast, isHidden, showEllipsisBefore, isLink, itemClasses, separatorText, expand } =
  useLhBreadcrumbItem(props)

const moreLabel = computed(() => t('breadcrumb.more', '更多'))

const instance = getCurrentInstance()

/**
 * 跳转：检测到 vue-router 时走路由（支持 replace），否则保持原生 <a> 导航
 */
function handleClick(event: MouseEvent) {
  if (!props.to) return
  const vm = instance?.proxy as unknown as
    | { $router?: { push?: (to: string) => void; replace?: (to: string) => void } }
    | undefined
  const router = vm?.$router
  if (router && typeof router.push === 'function') {
    event.preventDefault()
    if (props.replace && typeof router.replace === 'function') {
      router.replace(props.to)
    } else {
      router.push(props.to)
    }
  }
}
</script>

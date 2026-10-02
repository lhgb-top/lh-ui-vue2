<template>
  <li
    class="lh-menu-item-group"
    :style="groupStyle"
    role="presentation"
  >
    <div class="lh-menu-item-group__title">
      <slot name="title">{{ props.title }}</slot>
    </div>
    <ul
      class="lh-menu-item-group__list"
      role="group"
    >
      <slot></slot>
    </ul>
  </li>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名（registry 测试依赖 name 一致）
export default { name: 'LhMenuItemGroup' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhMenuItemGroup } from './index'
import type { LhMenuItemGroupProps } from './types'

const props = defineProps({
  title: { type: String, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhMenuItemGroupProps['sx']>, default: undefined },
})

const { groupStyle } = useLhMenuItemGroup(props)
</script>

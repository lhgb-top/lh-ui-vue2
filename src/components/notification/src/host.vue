<template>
  <!-- 2.7 单根限制：plus 的多根 v-for 包一层中性容器（position 区域自身为 fixed 定位，不受影响） -->
  <div class="lh-notification-root">
    <div
      v-for="(group, position) in groups"
      :key="position"
      :class="['lh-notification', `lh-notification--${position}`]"
      :style="{
        marginTop: `${isTopPosition(position) ? config.offset : 0}px`,
        marginBottom: `${!isTopPosition(position) ? config.offset : 0}px`,
      }"
      role="region"
      aria-live="polite"
      :aria-label="position"
    >
      <transition-group name="lh-notification-slide">
        <LhNotificationItem
          v-for="record in group"
          :key="record.id"
          :type="record.type"
          :title="record.title"
          :content="record.content"
          :show-close="record.showClose"
          :sx="record.sx"
          :on-click="record.onClick"
          @close="close(record.id)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名
export default { name: 'LhNotificationHost' }
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { groupNotificationsByPosition, isTopPosition } from '@lh-ui/share/core/notification'
import LhNotificationItem from './index.vue'
import {
  closeNotification as close,
  notificationConfig as config,
  notificationRecords,
} from './store'

const groups = computed(() => groupNotificationsByPosition(notificationRecords.value))
</script>

<template>
  <div
    class="lh-message"
    :style="{ paddingTop: `${config.offset}px` }"
  >
    <!-- tag 缺省时 Vue2 渲染 <span> 包裹层，会把 fixed 容器内的纵向堆叠打乱 -->
    <transition-group name="lh-message-zoom" tag="div">
      <LhMessageItem
        v-for="record in records"
        :key="record.id"
        :type="record.type"
        :content="record.content"
        :show-close="record.showClose"
        :sx="record.sx"
        @close="close(record.id)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
// 2.7 无 defineOptions：并列普通 <script> 声明组件名
export default { name: 'LhMessageHost' }
</script>

<script lang="ts" setup>
import LhMessageItem from './index.vue'
import { closeMessage as close, messageConfig as config, messageRecords as records } from './store'
</script>

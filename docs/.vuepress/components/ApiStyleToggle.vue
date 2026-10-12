<script>
/**
 * API 风格切换：Vue 2.7 同时支持 <script setup>（Composition）与 Options API，
 * 文档双围栏机制沿 plus。双兼容 Options API 写法（Vue 2.7 / Vue 3 均可运行）。
 * 用法：
 *   <ApiStyleToggle>
 *     <template #setup>...</template>
 *     <template #options>...</template>
 *   </ApiStyleToggle>
 */
export default {
  name: 'ApiStyleToggle',
  data() {
    return { active: 'setup' }
  },
}
</script>

<template>
  <div>
    <div class="api-toggle-bar">
      <button
        :data-active="active === 'setup'"
        @click="active = 'setup'"
      >
        script setup
      </button>
      <button
        :data-active="active === 'options'"
        @click="active = 'options'"
      >
        Options API
      </button>
    </div>
    <div v-show="active === 'setup'">
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <slot name="setup" />
    </div>
    <div v-show="active === 'options'">
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <slot name="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * API 风格切换：Vue 2.7 同时支持 <script setup>（Composition）与 Options API，
 * 文档双围栏机制沿 plus。用法：
 *   <ApiStyleToggle>
 *     <template #setup>...</template>
 *     <template #options>...</template>
 *   </ApiStyleToggle>
 */
const active = ref<'setup' | 'options'>('setup')
</script>

<template>
  <div>
    <div class="api-toggle-bar">
      <button :data-active="active === 'setup'" @click="active = 'setup'">script setup</button>
      <button :data-active="active === 'options'" @click="active = 'options'">Options API</button>
    </div>
    <div v-show="active === 'setup'"><slot name="setup" /></div>
    <div v-show="active === 'options'"><slot name="options" /></div>
  </div>
</template>

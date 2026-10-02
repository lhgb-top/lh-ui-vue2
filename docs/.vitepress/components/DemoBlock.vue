<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase, useData } from 'vitepress'

/**
 * Vue2 版 DemoBlock：VitePress（Vue3）内无法直接渲染 Vue2 SFC，
 * live demo 通过 iframe 加载 dev 沙箱的多页构建产物（docs/.vitepress/public/demos/<name>.html）。
 */
const props = defineProps<{
  /** 对应 dev/<name>.html（构建产物归位到 docs/public/demos/<name>.html） */
  name: string
  title?: string
  /** iframe 高度，默认 220 */
  height?: number
}>()

const showCode = ref(false)

// iframe 是独立文档，不继承站点明暗状态；通过查询参数把主题带进沙箱，
// demo-main.ts 据此设 data-theme。src 变化时 iframe 自动重载，无需 postMessage。
const { isDark } = useData()

const iframeSrc = computed(() => {
  const base = withBase(`/demos/${props.name}.html`)
  return isDark.value ? `${base}?theme=dark` : base
})
const iframeHeight = computed(() => `${props.height ?? 220}px`)
</script>

<template>
  <div class="demo-block">
    <div v-if="title || name" class="demo-block__header">
      <span class="demo-block__title">{{ title || name }}</span>
      <button class="demo-block__toggle" @click="showCode = !showCode">
        {{ showCode ? '隐藏代码' : '查看代码' }}
      </button>
    </div>
    <iframe
      class="demo-iframe"
      :src="iframeSrc"
      :style="{ height: iframeHeight }"
      loading="lazy"
      title="live demo"
    ></iframe>
    <div v-if="showCode" class="demo-block__code">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.demo-block {
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.demo-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  border-bottom: 1px solid var(--vp-c-border, #e2e8f0);
}

.demo-block__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1, #1a1a1a);
}

.demo-block__toggle {
  cursor: pointer;
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 6px;
  background: transparent;
  padding: 2px 10px;
  font-size: 12px;
  color: var(--vp-c-text-2, #555);
}

.demo-block__code {
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-border, #e2e8f0);
}

.demo-block__code :deep(pre) {
  margin: 0;
}
</style>

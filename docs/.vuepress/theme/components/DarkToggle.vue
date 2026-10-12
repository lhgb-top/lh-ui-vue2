<script lang="ts">
import Vue from 'vue'

/**
 * 暗色切换器（VuePress 1.x 默认主题无暗色能力，这里补齐）：
 * 浮动按钮切换 documentElement 的 data-theme，localStorage 记忆（键 lh-docs-dark）；
 * 首屏防闪烁由 config.ts head 里的 DARK_FOUC_SCRIPT 负责（同键读写）。
 * demo 区在同一 document，令牌经 [data-theme='dark'] 级联自动跟随，无需任何同步逻辑。
 */
export default Vue.extend({
  name: 'DarkToggle',
  data() {
    return { dark: false }
  },
  mounted() {
    this.dark = document.documentElement.dataset.theme === 'dark'
  },
  methods: {
    toggle(): void {
      this.dark = !this.dark
      document.documentElement.dataset.theme = this.dark ? 'dark' : 'light'
      try {
        localStorage.setItem('lh-docs-dark', this.dark ? '1' : '0')
      } catch {
        /* localStorage 不可用时静默失败 */
      }
    },
  },
})
</script>

<template>
  <button
    class="lh-dark-toggle"
    :aria-label="dark ? '切换到亮色' : '切换到暗色'"
    :title="dark ? '切换到亮色' : '切换到暗色'"
    @click="toggle"
  >
    {{ dark ? '☀️' : '🌙' }}
  </button>
</template>

<style>
.lh-dark-toggle {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 30; /* v1 navbar z-index 20，需压过导航栏 */
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--lh-border-color-light, #e5e0d8);
  background: var(--lh-bg-color, #faf6f0);
  box-shadow: 0 4px 16px rgba(42, 38, 34, 0.14);
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow 0.3s ease;
}

.lh-dark-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(42, 38, 34, 0.2);
}
</style>

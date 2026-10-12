<script lang="ts">
import Vue from 'vue'
import { DEMOS, LhDemoDefinition } from '../../../dev/demos'

/**
 * Vue2 版 DemoBlock：docs 站本身就是 Vue 2.7（VuePress 1.x 迁移后），
 * live demo 直接活渲染 DEMOS 注册表条目，iframe 沙箱整体退役。
 *
 * 体验要点（样式在 styles/index.styl §7）：
 * - 注册表唯一真源：本组件只做「取条目 → 包一层 lh-demo-root → 运行时编译渲染」，
 *   与 dev 沙箱（dev/demo-main.ts）完全同源；改注册表在 docs:dev 下 HMR 即时生效
 * - 明暗切换：demo 与站点同 document，令牌经 [data-theme='dark'] 级联自动跟随，
 *   无 iframe 重载、无闪烁、无同步逻辑
 * - client-only 包裹：SSR 阶段不渲染 demo（部分 demo 在 mounted 里操作 DOM/依赖
 *   window 命令式服务，水合边界一致比 SSR 输出更重要）
 * - 运行时模板编译依赖 vue 完整构建（config.ts chainWebpack 里 vue$ → vue/dist/vue.esm.js）
 */
export default Vue.extend({
  name: 'DemoBlock',
  props: {
    /** dev/demos/index.ts 注册表的 key */
    name: { type: String, required: true },
    title: { type: String, default: '' },
    /** 兼容保留：原 iframe 测高前的兜底高度，现作为渲染区 min-height（0 表示不限制） */
    height: { type: Number, default: 0 },
  },
  data() {
    return { showCode: false }
  },
  computed: {
    /** v1 的 $localePath 按站点 locale 自动切换，中英文案据此分流 */
    isEn(): boolean {
      return this.$localePath === '/en/'
    },
    toggleText(): string {
      return this.showCode ? (this.isEn ? 'Hide Code' : '隐藏代码') : this.isEn ? 'View Code' : '查看代码'
    },
    /** 注册表条目 → 运行时编译组件选项（包一层 lh-demo-root 与沙箱行为一致） */
    liveDemo():
      | (Omit<LhDemoDefinition, 'template'> & { template: string })
      | null {
      const demo = DEMOS[this.name]
      if (!demo) return null
      return {
        template: `<div class="lh-demo-root">${demo.template}</div>`,
        data: demo.data,
        methods: demo.methods,
        mounted: demo.mounted,
      }
    },
    demoStyle(): Record<string, string> | undefined {
      return this.height ? { minHeight: `${this.height}px` } : undefined
    },
  },
})
</script>

<template>
  <div class="demo-block">
    <div
      v-if="title || name"
      class="demo-block__header"
    >
      <span class="demo-block__title">{{ title || name }}</span>
      <button
        class="demo-block__toggle"
        @click="showCode = !showCode"
      >
        {{ toggleText }}
      </button>
    </div>
    <div
      class="demo-block__demo"
      :style="demoStyle"
    >
      <!-- client-only 是 VuePress 1.x 全局注册组件 -->
      <client-only>
        <component
          :is="liveDemo"
          v-if="liveDemo"
        />
        <p
          v-else
          class="demo-block__missing"
        >
          {{ isEn ? 'Unknown demo: ' : '未知 demo：' }}{{ name }}{{ isEn ? '' : '（dev/demos/index.ts 注册表缺失该 key）' }}
        </p>
      </client-only>
    </div>
    <div
      class="demo-block__code-wrap"
      :class="{ 'demo-block__code-wrap--open': showCode }"
    >
      <div class="demo-block__code">
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -- slot 内容为 markdown 代码块 -->
        <slot />
      </div>
    </div>
  </div>
</template>

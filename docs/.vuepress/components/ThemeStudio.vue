<script lang="ts">
import { defineComponent } from 'vue'
import { LH_THEME_PRESETS, buildPresetStyleText, buildPresetDarkVars } from '@lh-ui/share/theme'
import type { LhThemePresetName } from '@lh-ui/share/theme'

/**
 * 主题定制台（docs 站交互组件）
 *
 * 预设选择 → 颜色面板逐令牌编辑 → 预览区实时生效（含明/暗切换）→ 导出一份 scss：
 *   @use '@lh-ui/share/styles/index.scss'; + :root 令牌块 + 暗色适配块。
 *
 * 预览采用「局部 CSS 变量注入」（与 ConfigProvider 同机制），不写 documentElement
 * 内联 style，避免压过 var-dark.scss 的暗色变量；导出文本由 buildPresetStyleText 生成，
 * 暗色块与 share 预设机制完全一致。
 *
 * 仅依赖 vue + @lh-ui/share/theme 与全站样式（lh-* BEM 类名），便于其它端的 docs 站
 * 原样复用（vue2 docs 直接引入同一文件）。
 *
 * 双兼容约定（本文件在 lh-ui-plus（VitePress/Vue3）与 lh-ui-vue2（VuePress/Vue 2.7）
 * 两仓逐字节同步，由 verify:docs-sync 守护）：
 * - Options API + defineComponent：Vue 2.7 与 Vue 3 均可运行（Vue 2.7 的 vue-loader 15
 *   不支持 <script setup>；Vue 3.5 已移除 Vue.extend，只能用 defineComponent）
 * - 不 import vitepress：语言检测用 $lang（VuePress 1.x 原生）+ pathname 前缀兜底
 *   （VitePress 侧），不用 useData
 * - 模板只用两代编译器共有语法：无 TS 断言（as）、无 v-model 参数、无 .prop 修饰符
 * - 样式里 --vp-c-* 均带 fallback，VitePress 之外的环境走 fallback 色
 */

interface TokenField {
  key: string
  label: string
  labelEn: string
  /** 空值表示跟随默认链路（如 selected-color → primary-color-active） */
  optional?: boolean
}

interface TokenGroup {
  title: string
  titleEn: string
  tokens: TokenField[]
}

/** 令牌默认值（styles/theme/common/var.scss 的青花瓷明色基线） */
const DEFAULTS: Record<string, string> = {
  '--lh-primary-color': '#2B4C7C',
  '--lh-primary-color-hover': '#3D649E',
  '--lh-primary-color-active': '#1F3A5F',
  '--lh-primary-color-bg': '#E8EDF3',
  '--lh-primary-color-border': '#D4DCE8',
  '--lh-color-on-primary': '#FFFFFF',
  '--lh-selected-color': '',
  '--lh-success-color': '#5B8C5A',
  '--lh-warning-color': '#C4A35A',
  '--lh-danger-color': '#B23A3A',
  '--lh-info-color': '#7A7A7A',
  '--lh-text-primary': '#2C2C2C',
  '--lh-text-regular': '#5A5A5A',
  '--lh-text-secondary': '#8A8A8A',
  '--lh-bg-color': '#FAF6F0',
  '--lh-bg-color-page': '#F5F0EB',
  '--lh-border-color-base': '#D8D3CC',
  '--lh-border-color-light': '#E5E0D8',
}

const GROUPS: TokenGroup[] = [
  {
    title: '主色',
    titleEn: 'Primary',
    tokens: [
      { key: '--lh-primary-color', label: '主色', labelEn: 'Primary' },
      { key: '--lh-primary-color-hover', label: '悬停', labelEn: 'Hover' },
      { key: '--lh-primary-color-active', label: '按压', labelEn: 'Active' },
      { key: '--lh-primary-color-bg', label: '主色底', labelEn: 'Primary bg' },
      { key: '--lh-primary-color-border', label: '主色边框', labelEn: 'Primary border' },
    ],
  },
  {
    title: '主色衍生',
    titleEn: 'Primary-derived',
    tokens: [
      { key: '--lh-color-on-primary', label: '主色底文字', labelEn: 'Text on primary' },
      {
        key: '--lh-selected-color',
        label: '选中态文字',
        labelEn: 'Selected text',
        optional: true,
      },
    ],
  },
  {
    title: '功能色',
    titleEn: 'Functional',
    tokens: [
      { key: '--lh-success-color', label: '成功', labelEn: 'Success' },
      { key: '--lh-warning-color', label: '警告', labelEn: 'Warning' },
      { key: '--lh-danger-color', label: '危险', labelEn: 'Danger' },
      { key: '--lh-info-color', label: '信息', labelEn: 'Info' },
    ],
  },
  {
    title: '文本',
    titleEn: 'Text',
    tokens: [
      { key: '--lh-text-primary', label: '主要文字', labelEn: 'Primary text' },
      { key: '--lh-text-regular', label: '常规文字', labelEn: 'Regular text' },
      { key: '--lh-text-secondary', label: '次要文字', labelEn: 'Secondary text' },
    ],
  },
  {
    title: '背景',
    titleEn: 'Background',
    tokens: [
      { key: '--lh-bg-color', label: '容器背景', labelEn: 'Container bg' },
      { key: '--lh-bg-color-page', label: '页面背景', labelEn: 'Page bg' },
    ],
  },
  {
    title: '边框',
    titleEn: 'Border',
    tokens: [
      { key: '--lh-border-color-base', label: '基础边框', labelEn: 'Base border' },
      { key: '--lh-border-color-light', label: '浅边框', labelEn: 'Light border' },
    ],
  },
]

const ALL_TOKENS = GROUPS.flatMap((g) => g.tokens.map((t) => t.key))

export default defineComponent({
  name: 'ThemeStudio',
  data() {
    return {
      /** 逐令牌当前值（键全部预声明，Vue2/Vue3 响应式一致） */
      vars: { ...DEFAULTS } as Record<string, string>,
      selectedPreset: 'cerblue' as LhThemePresetName | 'custom',
      isDark: false,
      copied: false,
    }
  },
  computed: {
    isEn(): boolean {
      // VuePress 1.x 原生 $lang（SSR 正确）；VitePress 无 $lang，退回 pathname 前缀
      const lang = (this as unknown as { $lang?: string }).$lang
      if (lang) return lang === 'en-US'
      return typeof location !== 'undefined' && location.pathname.includes('/en/')
    },
    /** Options API 下模板只能访问实例成员，模块常量须经 computed 暴露 */
    presets() {
      return LH_THEME_PRESETS
    },
    groups() {
      return GROUPS
    },
    /** 导出用的非空令牌集 */
    exportVars(): Record<string, string> {
      const out: Record<string, string> = {}
      for (const [key, value] of Object.entries(this.vars)) {
        if (value.trim()) out[key] = value.trim()
      }
      return out
    },
    /** 预览容器的局部令牌注入；暗色块与导出文本同源（都走 buildPresetDarkVars），
     *  保证「预览区看到的」和「导出文件里的」完全一致 */
    previewStyle(): Record<string, string> {
      const style: Record<string, string> = { ...this.exportVars }
      if (this.isDark) Object.assign(style, buildPresetDarkVars(this.exportVars))
      return style
    },
    scssText(): string {
      const date = new Date().toISOString().slice(0, 10)
      return `/* lh-ui 自定义主题 —— 由主题定制台生成（${date}）
 * 令牌定义见 @lh-ui/share/styles/theme/common/var.scss；暗色块与预设机制同源
 *（浅主色下 --lh-color-on-primary / --lh-selected-color 需显式声明，否则白字不达 AA） */
@use '@lh-ui/share/styles/index.scss';

${buildPresetStyleText(this.exportVars)}
`
    },
    t(): Record<string, string> {
      return this.isEn
        ? {
            preset: 'Preset',
            custom: 'Custom',
            preview: 'Live preview',
            light: 'Light',
            dark: 'Dark',
            export: 'Export SCSS',
            copy: 'Copy',
            copied: 'Copied',
            download: 'Download .scss',
            reset: 'Reset',
            hint: 'Tokens you edit apply to the preview area only (same mechanism as ConfigProvider). The exported file also works in dark mode.',
            followDefault: 'follows default chain',
          }
        : {
            preset: '预设',
            custom: '自定义',
            preview: '实时预览',
            light: '明色',
            dark: '暗色',
            export: '导出 SCSS',
            copy: '复制',
            copied: '已复制',
            download: '下载 .scss',
            reset: '重置',
            hint: '编辑的令牌只作用于预览区（与 ConfigProvider 同机制）；导出的文件已包含暗色适配。',
            followDefault: '跟随默认链路',
          }
    },
  },
  /** 挂载时用站点当前生效值初始化（站点可能已切到别的预设） */
  mounted() {
    for (const token of ALL_TOKENS) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
      // 只采纳 hex：getComputedStyle 返回的是 var() 已代换的计算值，暗色下
      // --lh-primary-color-bg / --lh-selected-color 会是 color-mix(...) 文本，
      // 原样写进 <input type="color"> 会被浏览器拒绝并报 "does not conform to the
      // required format"（空串同理）。非 hex 的留给预览自身的暗色块处理。
      if (/^#[0-9a-fA-F]{6}$/.test(value)) this.vars[token] = value
    }
    // 令牌采集后反查命中的预设，下拉框才和站点当前预设同步（否则恒显默认项）。
    // 站点暗色下 buildPresetStyleText 的暗色块会把部分令牌覆盖成 color-mix(...)
    // （深主色预设连主色本身都被提亮），这些令牌采集不进 vars，也没有可比的 hex 文本，
    // 所以期望值要走一遍同样的暗色适配，且只比较两边都能以 hex 观测到的令牌。
    const siteDark =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark'
    const isHex = (v: unknown): boolean => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)
    const matched = LH_THEME_PRESETS.find((preset) => {
      const expected = siteDark ? { ...preset.vars, ...buildPresetDarkVars(preset.vars) } : preset.vars
      return Object.entries(preset.vars).every(([key]) => {
        const current = this.vars[key]
        const want = expected[key]
        // 非 hex 的派生令牌（暗色覆盖的 color-mix）无法观测，跳过；能观测的必须一致
        if (!isHex(current) || !isHex(want)) return true
        return current.toLowerCase() === want.toLowerCase()
      })
    })
    this.selectedPreset = matched ? matched.name : 'custom'
  },
  methods: {
    /** select 的 change 转发：模板表达式不写 TS 断言（as），类型收窄在脚本内完成 */
    onPresetChange(e: Event) {
      this.applyPreset((e.target as HTMLSelectElement).value as LhThemePresetName)
    },
    applyPreset(name: LhThemePresetName) {
      this.selectedPreset = name
      const preset = LH_THEME_PRESETS.find((p) => p.name === name)
      if (!preset) return
      // 预设只覆盖它声明的令牌，其余保持站点当前值
      for (const [key, value] of Object.entries(preset.vars)) this.vars[key] = value
    },
    onTokenInput(_key: string) {
      this.selectedPreset = 'custom'
    },
    /**
     * 颜色输入框的取值：只接受 hex（#rrggbb）。
     * 空串（可选令牌跟随默认链路）或在 hex 文本框里键入的 color-mix() 等文本，
     * 直接写进 <input type="color"> 会被浏览器拒绝并刷 "does not conform to the
     * required format" 警告，故统一回退到一个中性占位色；真实值仍由 vars 保存与导出。
     */
    colorInputValue(v: string | undefined): string {
      return /^#[0-9a-fA-F]{6}$/.test(v ?? '') ? (v as string) : '#cccccc'
    },
    onColorInput(key: string, e: Event) {
      this.vars[key] = (e.target as HTMLInputElement).value
      this.onTokenInput(key)
    },
    resetAll() {
      Object.assign(this.vars, DEFAULTS)
      this.selectedPreset = 'cerblue'
    },
    tField(t: TokenField) {
      return this.isEn ? t.labelEn : t.label
    },
    tGroup(g: TokenGroup) {
      return this.isEn ? g.titleEn : g.title
    },
    async copyExport() {
      try {
        await navigator.clipboard.writeText(this.scssText)
        this.copied = true
        setTimeout(() => (this.copied = false), 1500)
      } catch {
        // 回退：选中文本域内容
        const ta = document.querySelector<HTMLTextAreaElement>('.theme-studio__export-code')
        ta?.select()
        document.execCommand('copy')
      }
    },
    downloadExport() {
      const blob = new Blob([this.scssText], { type: 'text/scss;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'lh-theme.scss'
      a.click()
      URL.revokeObjectURL(url)
    },
  },
})
</script>

<template>
  <div class="theme-studio">
    <div class="theme-studio__toolbar">
      <label class="theme-studio__field">
        <span>{{ t.preset }}</span>
        <select
          v-model="selectedPreset"
          class="theme-studio__select"
          @change="onPresetChange($event)"
        >
          <option
            v-for="p in presets"
            :key="p.name"
            :value="p.name"
          >
            {{ isEn ? p.labelEn : p.label }}（{{ p.name }}）
          </option>
          <option value="custom">{{ t.custom }}</option>
        </select>
      </label>
      <button
        class="theme-studio__btn"
        @click="resetAll"
      >
        {{ t.reset }}
      </button>
    </div>

    <div class="theme-studio__panel">
      <div
        v-for="g in groups"
        :key="g.title"
        class="theme-studio__group"
      >
        <div class="theme-studio__group-title">{{ tGroup(g) }}</div>
        <div
          v-for="token in g.tokens"
          :key="token.key"
          class="theme-studio__token"
        >
          <input
            class="theme-studio__color"
            type="color"
            :value="colorInputValue(vars[token.key])"
            :disabled="!vars[token.key]"
            :aria-label="token.key"
            @input="onColorInput(token.key, $event)"
          >
          <input
            v-model="vars[token.key]"
            class="theme-studio__hex"
            :placeholder="token.optional ? t.followDefault : token.key"
            @input="onTokenInput(token.key)"
          >
          <span class="theme-studio__token-name">{{ token.key }}</span>
        </div>
      </div>
    </div>

    <div class="theme-studio__preview-head">
      <span>{{ t.preview }}</span>
      <button
        class="theme-studio__btn theme-studio__btn--toggle"
        :class="{ 'is-dark': isDark }"
        @click="isDark = !isDark"
      >
        {{ isDark ? '🌙 ' + t.dark : '☀️ ' + t.light }}
      </button>
    </div>
    <div
      class="theme-studio__preview"
      :data-theme="isDark ? 'dark' : undefined"
      :style="previewStyle"
    >
      <button class="lh-button lh-button--primary">主要按钮</button>
      <button class="lh-button lh-button--default">默认按钮</button>
      <button class="lh-button lh-button--success">成功</button>
      <button class="lh-button lh-button--warning">警告</button>
      <button class="lh-button lh-button--danger">危险</button>
      <span class="lh-tag lh-tag--primary">标签</span>
      <span class="lh-tag lh-tag--success">标签</span>
      <span class="lh-tag lh-tag--danger">标签</span>
      <p class="theme-studio__sample-text">
        <strong>主要文字</strong>·常规文字·<span class="theme-studio__secondary">次要文字</span>
      </p>
    </div>
    <p class="theme-studio__hint">{{ t.hint }}</p>

    <div class="theme-studio__export-head">{{ t.export }}</div>
    <div class="theme-studio__export">
      <div class="theme-studio__export-actions">
        <button
          class="theme-studio__btn theme-studio__btn--primary"
          @click="copyExport"
        >
          {{ copied ? t.copied : t.copy }}
        </button>
        <button
          class="theme-studio__btn"
          @click="downloadExport"
        >
          {{ t.download }}
        </button>
      </div>
      <textarea
        class="theme-studio__export-code"
        :value="scssText"
        readonly
        rows="10"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<style scoped>
.theme-studio {
  border: 1px solid var(--vp-c-border, #e2e8f0);
  border-radius: 12px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft, #fafafa);
}

.theme-studio__toolbar,
.theme-studio__preview-head,
.theme-studio__export-head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-weight: 600;
  margin-bottom: 12px;
}

.theme-studio__field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-studio__select,
.theme-studio__hex,
.theme-studio__export-code {
  border: 1px solid var(--vp-c-border, #d0d7de);
  border-radius: 8px;
  padding: 6px 10px;
  background-color: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #333);
  font-size: 13px;
}

.theme-studio__btn {
  border: 1px solid var(--vp-c-border, #d0d7de);
  border-radius: 8px;
  padding: 6px 14px;
  background-color: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #333);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.theme-studio__btn:hover {
  border-color: var(--lh-primary-color);
  color: var(--lh-primary-color);
}

.theme-studio__btn--primary {
  background-color: var(--lh-primary-color);
  border-color: var(--lh-primary-color);
  color: var(--lh-color-on-primary, #fff);
}

.theme-studio__btn--primary:hover {
  background-color: var(--lh-primary-color-hover);
  border-color: var(--lh-primary-color-hover);
  color: var(--lh-color-on-primary, #fff);
}

.theme-studio__btn--toggle.is-dark {
  background-color: #1e1a16;
  border-color: #1e1a16;
  color: #e8e0d8;
}

.theme-studio__panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.theme-studio__group-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2, #666);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.theme-studio__token {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.theme-studio__color {
  width: 30px;
  height: 30px;
  flex: none;
  padding: 0;
  border: 1px solid var(--vp-c-border, #d0d7de);
  border-radius: 6px;
  background: none;
  cursor: pointer;
}

.theme-studio__hex {
  width: 92px;
  flex: none;
  font-family: var(--vp-font-family-mono, monospace);
}

.theme-studio__token-name {
  font-size: 11px;
  font-family: var(--vp-font-family-mono, monospace);
  color: var(--vp-c-text-3, #999);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theme-studio__preview {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  border: 1px dashed var(--lh-border-color-base, #d8d3cc);
  border-radius: 10px;
  padding: 16px;
  background-color: var(--lh-bg-color, #faf6f0);
  color: var(--lh-text-primary, #2c2c2c);
}

.theme-studio__sample-text {
  margin: 0;
  width: 100%;
  color: var(--lh-text-regular, #5a5a5a);
  font-size: 13px;
}

.theme-studio__secondary {
  color: var(--lh-text-secondary, #8a8a8a);
}

.theme-studio__hint {
  margin: 8px 0 20px;
  font-size: 12px;
  color: var(--vp-c-text-2, #666);
}

.theme-studio__export-code {
  width: 100%;
  margin-top: 10px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 12px;
  line-height: 1.6;
  resize: vertical;
}
</style>

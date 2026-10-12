/**
 * docs 跨仓同步检查（家族布局专用）
 *
 * 检查项：
 * 1. **共享 docs 组件逐字节一致**：docs 站点配置目录下 components 里由两仓共同维护的组件
 *    （如 ThemeStudio.vue）必须与兄弟仓的同名文件完全相同，避免两端各自漂移。
 *    改动在 lh-ui-plus 侧完成后整体同步到兄弟仓，勿单端手改（见各仓 AGENTS.md）。
 *    注：两仓 docs 框架不同——本仓 VuePress 1.x（`.vuepress`），plus 为 VitePress（`.vitepress`），
 *    目录名差异由下方 ownDocsDir / siblingDocsDir 抹平。
 * 2. **展示围栏 specifier 规范**：docs md 里展示给用户的代码围栏（```vue / ```js / ```ts …）
 *    只能用 npm 包名（本仓 package.json 的 name、@lh-ui/share），不能用 `~/`、`@/` 等
 *    库内部 alias——否则用户拷贝出去无法解析。页面级 `<script setup>` 块是站点自身运行的
 *    代码，走家族本地 alias，不受此限制。
 *
 * 守卫：兄弟仓不存在（CI 单仓 clone、独立下载）时第 1 项跳过，第 2 项仍执行。
 *
 * 用法：node scripts/verify-docs-sync.mjs     # 有缺口时非零退出
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'
import { createRequire } from 'node:module'

const root = resolve(import.meta.dirname, '..')
const require = createRequire(import.meta.url)
const ownName = require(join(root, 'package.json')).name

// 与本仓 docs 组件需要保持一致的兄弟仓（家族布局下为同父目录的另一 UI 库）
const isPlus = basename(root) === 'lh-ui-plus'
const sibling = isPlus ? resolve(root, '..', 'lh-ui-vue2') : resolve(root, '..', 'lh-ui-plus')

// 两仓 docs 框架不同：plus 为 VitePress（.vitepress），vue2 为 VuePress 1.x（.vuepress）
const ownDocsDir = isPlus ? '.vitepress' : '.vuepress'
const siblingDocsDir = isPlus ? '.vuepress' : '.vitepress'

/** 需要两仓逐字节一致的 docs 组件；新增共享组件时两仓脚本同步追加 */
const SHARED_COMPONENTS = ['ThemeStudio.vue']

let failures = 0

// ---------- 检查 1：共享 docs 组件同步 ----------
if (existsSync(join(sibling, 'docs', siblingDocsDir, 'components'))) {
  for (const name of SHARED_COMPONENTS) {
    const mine = readFileSync(join(root, 'docs', ownDocsDir, 'components', name), 'utf8')
    const theirs = readFileSync(join(sibling, 'docs', siblingDocsDir, 'components', name), 'utf8')
    if (mine !== theirs) {
      failures++
      console.error(
        `✖ docs 组件不同步：${name}\n` +
          `  本仓与 ${basename(sibling)} 的副本内容不一致。请在 lh-ui-plus 侧改完，\n` +
          `  再把文件整体覆盖到 ${basename(sibling)}（diff 见 git 或本地比对工具）。`,
      )
    }
  }
} else {
  console.log(`ℹ 兄弟仓 ${basename(sibling)} 不存在，跳过共享组件同步检查。`)
}

// ---------- 检查 2：展示围栏 specifier 规范 ----------
function walk(dir) {
  return readdirSync(dir)
    .filter((entry) => entry !== 'node_modules')
    .flatMap((entry) => {
      const full = join(dir, entry)
      return statSync(full).isDirectory() ? walk(full) : [full]
    })
}

const mdFiles = walk(join(root, 'docs')).filter((f) => f.endsWith('.md'))
// ```lang 开头的围栏（围栏内内容即为展示给用户的示例代码）
const FENCE_RE = /^(```[a-zA-Z][^\n]*)\n([\s\S]*?)^```$/gm
const IMPORT_RE = /import\s+[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/g
const dirName = basename(root)

for (const file of mdFiles) {
  const src = readFileSync(file, 'utf8')
  const rel = file.replace(root + '/', '')
  for (const fence of src.matchAll(FENCE_RE)) {
    const body = fence[2]
    const line = src.slice(0, fence.index).split('\n').length
    for (const imp of body.matchAll(IMPORT_RE)) {
      const spec = imp[1]
      // 库内部 alias：用户项目里没有这些 alias，拷贝即坏
      if (spec.startsWith('~') || spec.startsWith('@/')) {
        failures++
        console.error(`✖ ${rel}:${line} 围栏内 import '${spec}' 是库内部 alias，应改用 npm 包名（${ownName} / @lh-ui/share）。`)
      }
      // 仓库名不是包名：lh-ui-plus / lh-ui-vue2 是目录名，npm 上不存在
      if (spec === dirName || spec.startsWith(`${dirName}/`)) {
        failures++
        console.error(`✖ ${rel}:${line} 围栏内 import '${spec}' 用了仓库名，实际包名是 '${ownName}'。`)
      }
    }
  }
}

if (failures > 0) {
  console.error(`\nverify-docs-sync：${failures} 处缺口。`)
  process.exit(1)
}
console.log('verify-docs-sync：通过（共享组件同步 + 展示围栏 specifier 规范）。')

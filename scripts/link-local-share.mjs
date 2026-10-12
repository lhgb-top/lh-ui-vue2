/**
 * 本地构建联动 —— 把 node_modules/@lh-ui/share 指向同级 share 仓的**已构建产物**
 *
 * 构建链（vite build esm/cjs/umd、build-styles、tsc -p tsconfig.build.json）按红线保持
 * @lh-ui/share 的 bare 引用与 external，不配路径别名，解析全走 node_modules。家族布局下
 * npm 上的 share 包会滞后于同级仓的本地改动（share 未发版时 es/lib 里还没有新导出），
 * `pnpm build` 就会报 "X is not exported by @lh-ui/share/core/Y"，dts 也会缺新类型。
 * 本脚本把 node_modules/@lh-ui/share 改挂到兄弟仓目录：解析路径不变（仍是 bare
 * `@lh-ui/share/**`，external 照常生效），读的是兄弟仓刚构建好的 es/ + lib/ + styles/，
 * 本地构建不再依赖 npm 发版。
 *
 * 与 local-share-alias.mjs / gen-dev-tsconfig.mjs 的分工（与 lh-ui-plus 同构）：
 *   - dev / test / docs：alias 到兄弟仓**源码**（改 share 即时热更新，无需构建）
 *   - typecheck        ：tsconfig.dev.json 映射到兄弟仓源码
 *   - build            ：本脚本指向兄弟仓**已构建产物**（构建链只吃产物，与发布语义一致）
 *
 * 守卫：兄弟仓不存在（CI 单仓 clone、独立下载）或尚未构建（es/lib 缺失）时
 * 一律跳过、不改 node_modules，回退 npm 包，与本次改动前行为完全一致。
 *
 * 用法：
 *   node scripts/link-local-share.mjs           # 建立联动（幂等，已联动则跳过）
 *   node scripts/link-local-share.mjs --restore # 还原回 npm 包
 *   pnpm build:local                            # 联动后直接构建
 *
 * 联动是 node_modules 内的状态，`pnpm install` 会自动还原回 npm 包；还原后需重跑本脚本。
 *
 * 与 lh-ui-plus/scripts/link-local-share.mjs 同源，改动需两端同步。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const shareRoot = path.resolve(root, '..', 'lh-ui-share')
const linkPath = path.resolve(root, 'node_modules', '@lh-ui', 'share')
const memoPath = path.resolve(root, 'node_modules', '.lh-share-npm-target')

/** 兄弟仓必须存在且已构建，缺件说明 share 仓还没 build，指向过去只会读到空洞 */
const REQUIRED_ARTIFACTS = ['es/index.js', 'lib/index.js', 'styles/theme/common/var.scss']

function readLinkTarget(p) {
  try {
    return fs.readlinkSync(p)
  } catch {
    // 不是符号链接/junction：可能是真实目录（手装的 node_modules），不能动
    return null
  }
}

function linkTo(target) {
  // Windows 下目录用 junction：不需要开发者模式/管理员权限，pnpm 自己也用 junction
  fs.symlinkSync(target, linkPath, 'junction')
}

function restore() {
  const current = readLinkTarget(linkPath)
  if (!current) {
    console.log('[link-local-share] node_modules/@lh-ui/share 不是链接，无需还原')
    return
  }
  if (!fs.existsSync(memoPath)) {
    console.log('[link-local-share] 没有记录 npm 原目标，改用 `pnpm install` 还原')
    return
  }
  const npmTarget = fs.readFileSync(memoPath, 'utf8').trim()
  if (path.resolve(current) === path.resolve(npmTarget)) {
    console.log('[link-local-share] 当前就是 npm 包目标，无需还原')
    return
  }
  fs.unlinkSync(linkPath)
  linkTo(npmTarget)
  fs.unlinkSync(memoPath)
  console.log(`[link-local-share] 已还原到 npm 包：${path.relative(root, npmTarget)}`)
}

function link() {
  if (!fs.existsSync(path.resolve(shareRoot, 'package.json'))) {
    console.log('[link-local-share] 兄弟仓不存在（../lh-ui-share），跳过，构建链读 npm 包')
    return
  }

  const missing = REQUIRED_ARTIFACTS.filter((f) => !fs.existsSync(path.resolve(shareRoot, f)))
  if (missing.length > 0) {
    console.warn(
      `[link-local-share] 兄弟仓未构建（缺 ${missing.join('、')}），跳过；请先在 lh-ui-share 仓执行 \`pnpm build\`，否则构建链继续读 npm 包`,
    )
    return
  }

  const current = readLinkTarget(linkPath)
  if (current && path.resolve(current) === shareRoot) {
    console.log('[link-local-share] 已联动 ../lh-ui-share，构建链读兄弟仓已构建产物')
    return
  }

  // 记下 npm 原目标，--restore 时按原样拼回（pnpm install 也会自动还原）
  if (current && !fs.existsSync(memoPath)) {
    fs.writeFileSync(memoPath, path.resolve(current), 'utf8')
  }
  if (current) fs.unlinkSync(linkPath)
  linkTo(shareRoot)
  console.log(
    `[link-local-share] 已联动 ../lh-ui-share（原 npm 目标记于 ${path.relative(root, memoPath)}，--restore 或 \`pnpm install\` 可还原）`,
  )
}

if (process.argv.includes('--restore')) {
  restore()
} else {
  link()
}

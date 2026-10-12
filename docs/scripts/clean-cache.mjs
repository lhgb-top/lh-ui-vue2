/**
 * 清 VuePress 1.x 的 webpack 缓存。
 *
 * 缓存目录在 `@vuepress/core/node_modules/.cache/vuepress`（pnpm 下是 .pnpm 里的某层），
 * **不是** `docs/.vuepress/cache`。cacheIdentifier 只含 config.ts 的 markdown / chainWebpack /
 * configureWebpack，**不含主题插件与 theme/ 目录**——所以改 theme/ 后直接 `pnpm docs:build`
 * 会静默出旧 HTML（毫无报错，极易误判为「主题覆盖没生效」）。
 *
 * 何时跑：改了 `theme/`、`styles/` 或任何 markdown 相关配置后，构建前跑一次。
 * 代价是下次构建重新编译（不做增量），所以只在需要时跑，不要进 build 流水线。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const nodeModules = path.resolve(dirname, '..', 'node_modules')

/** 读目录条目，不可读（目录不存在等）时返回 null */
function readDirs(root) {
  try {
    return fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory())
  } catch {
    return null
  }
}

/** 在 node_modules 里递归找 vuepress 的 webpack 缓存目录（pnpm 层级不固定） */
function findCacheDirs(root) {
  const found = []
  const entries = readDirs(root)
  if (!entries) return found
  for (const entry of entries) {
    const abs = path.join(root, entry.name)
    // 命中：.../@vuepress/core/node_modules/.cache/vuepress
    if (entry.name === '.cache') {
      const vp = path.join(abs, 'vuepress')
      if (fs.existsSync(vp)) found.push(vp)
      continue // .cache 下不再深挖
    }
    // 限制下潜深度，避免扫穿整个 node_modules（pnpm 的 .pnpm 层级有界）
    if (root.split(path.sep).filter((s) => s === 'node_modules').length < 3) {
      found.push(...findCacheDirs(abs))
    }
  }
  return found
}

const dirs = findCacheDirs(nodeModules)
if (!dirs.length) {
  console.log('[clean:cache] 未找到 VuePress webpack 缓存目录（可能已被清理）')
  process.exit(0)
}
for (const dir of dirs) {
  fs.rmSync(dir, { recursive: true, force: true })
  console.log(`[clean:cache] 已清理 ${path.relative(nodeModules, dir)}`)
}

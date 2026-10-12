/**
 * 本地联动 alias 的 webpack 4 适配（docs 站 VuePress 1.x 专用）
 *
 * 与 scripts/local-share-alias.mjs（vite 版，正则 alias）同源同守卫，但 webpack 4 的
 * resolve.alias 只支持字符串键（vite/webpack5 支持正则），故逐条枚举：
 *   - `@lh-ui/share$` 精确匹配（$ 后缀是 webpack 的精确匹配语法）→ share/src/index.ts
 *   - core/utils/constants/theme/locales/types 前缀匹配 → share/src/<name>
 *   - styles：58 个组件名逐一枚举 → styles/<name>/index.scss（对齐 share package.json
 *     exports 的 "./styles/*" 通配映射到 "<name>/index.scss" 的语义）+ theme 具名/前缀
 * 守卫：兄弟仓不存在（CI 单仓 clone）时返回空对象，回退 npm 包。
 *
 * 以 ESM 提供：VuePress 1.x 经 bundle-require（esbuild）把 config.ts 连同本模块
 * 一并内联成 .mjs 再执行，node: 内置模块必须用静态 import，否则内联后 require
 * 会变成 ESM 里的动态 require 而报 "Dynamic require of ... is not supported"。
 *
 * @param {string} repoRoot 本仓库根目录
 * @returns {Record<string, string>} webpack resolve.alias 对象
 */
import { resolve } from 'node:path'
import { existsSync, readdirSync, statSync } from 'node:fs'

export function createLocalShareAliasesWebpack(repoRoot) {
  const shareRoot = resolve(repoRoot, '..', 'lh-ui-share')
  if (!existsSync(resolve(shareRoot, 'src'))) return {}

  const alias = {
    // 精确匹配：裸导入 @lh-ui/share → share 源码入口
    '@lh-ui/share$': resolve(shareRoot, 'src/index.ts'),
    // 顶层模块前缀匹配：@lh-ui/share/core/tree → share/src/core/tree
    '@lh-ui/share/core': resolve(shareRoot, 'src/core'),
    '@lh-ui/share/utils': resolve(shareRoot, 'src/utils'),
    '@lh-ui/share/constants': resolve(shareRoot, 'src/constants'),
    '@lh-ui/share/theme': resolve(shareRoot, 'src/theme'),
    '@lh-ui/share/locales': resolve(shareRoot, 'src/locales'),
    '@lh-ui/share/types': resolve(shareRoot, 'src/types'),
    // 样式：具名文件 + theme 前缀（theme/index.scss、theme/common/var.scss 等）
    '@lh-ui/share/styles/index.scss': resolve(shareRoot, 'styles/index.scss'),
    '@lh-ui/share/styles/theme': resolve(shareRoot, 'styles/theme'),
  }
  // 组件样式逐一枚举（webpack4 无正则 alias，只能穷举；组件清单变化时需同步）
  const stylesDir = resolve(shareRoot, 'styles')
  for (const name of readdirSync(stylesDir)) {
    if (name === 'theme') continue
    if (!statSync(resolve(stylesDir, name)).isDirectory()) continue
    alias[`@lh-ui/share/styles/${name}`] = resolve(stylesDir, name, 'index.scss')
  }
  return alias
}

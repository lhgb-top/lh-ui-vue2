/**
 * 从 @lh-ui/share 的样式唯一源编译组件 css 与主题 css（本库不持有任何样式副本）
 *
 * 产物：
 *   es/<name>/style/index.css + lib/<name>/style/index.css   （share 存有样式源的组件）
 *   dist/theme/index.css       明色 :root 变量（patterns + var + var-dark 聚合）
 *   dist/theme/index-dark.css  暗色 [data-theme='dark'] / .dark 变量（var-dark 独立编译）
 *   es/package.json / lib/package.json  模块类型标记（供 Node 正确解析 CJS/ESM）
 *
 * share 样式源内部全部为相对 @use（如 '../theme/common/index.scss'），
 * dart-sass 按文件绝对路径编译即可自足解析，无需 loadPaths / NodePackageImporter
 * （M0b 已验证：styles/ 目录内不存在裸包名导入）。
 */
import { existsSync, readdirSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
// 刻意走 node_modules 解析（不读兄弟仓源码路径）：构建链统一由 node_modules 消费 share 的
// 发布态产物，与 plus 同构。家族布局下要让本地构建反映兄弟仓的未发版改动，跑
// `pnpm build:local`（scripts/link-local-share.mjs）把 node_modules/@lh-ui/share 改挂到
// 兄弟仓已构建产物——本脚本随之读到兄弟仓的 styles/，无需改这里。
const shareRoot = resolve(root, 'node_modules/@lh-ui/share')
const componentsDir = join(root, 'src/components')

async function writeWithDir(file, content) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
}

async function main() {
  // 1. 组件样式：仅编译 share 存有样式源的组件（config-provider 等 renderless 组件自动跳过）
  const names = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
  let compiled = 0
  const skipped = []
  for (const name of names) {
    const source = join(shareRoot, 'styles', name, 'index.scss')
    if (!existsSync(source)) {
      skipped.push(name)
      continue
    }
    const { css } = sass.compile(source)
    // 落位与 JS 产物同构（preserveModules 镜像 src）：es/components/<name>/style/index.css
    await writeWithDir(join(root, 'es', 'components', name, 'style', 'index.css'), css)
    await writeWithDir(join(root, 'lib', 'components', name, 'style', 'index.css'), css)
    compiled += 1
  }

  // 2. 主题 css（明 + 暗）
  const themeDir = join(root, 'dist/theme')
  await mkdir(themeDir, { recursive: true })
  const theme = sass.compile(join(shareRoot, 'styles/theme/index.scss'))
  await writeFile(join(themeDir, 'index.css'), theme.css)
  const dark = sass.compile(join(shareRoot, 'styles/theme/common/var-dark.scss'))
  await writeFile(join(themeDir, 'index-dark.css'), dark.css)

  // 3. es/lib 模块类型标记（lib 为 CJS 产物，需 type: commonjs 覆盖根 package.json 的 module）
  await writeWithDir(join(root, 'es/package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n')
  await writeWithDir(join(root, 'lib/package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n')

  const skipNote = skipped.length ? `，跳过（无样式源）：${skipped.join('、')}` : ''
  console.log(`styles built: ${compiled} 组件 + theme(light+dark) -> es/, lib/, dist/theme${skipNote}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

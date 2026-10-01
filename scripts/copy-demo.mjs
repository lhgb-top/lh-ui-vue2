/**
 * 把 dev 沙箱多页构建产物归位到 docs/.vitepress/public/demos：
 * - 递归收集 dev-dist 中的 *.html 平铺到 demos/ 根（vite root 设置不影响结果）
 * - html 内指向 assets 的相对路径统一重写为 ./assets/（与归位后的 assets 目录同级）
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const src = resolve(root, 'dev-dist')
const dest = resolve(root, 'docs/public/demos')

if (!statSync(src, { throwIfNoEntry: false })) {
  console.error('[copy-demo] dev-dist 不存在，请先运行 pnpm build:demo')
  process.exit(1)
}

function collectHtmls(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) collectHtmls(full, out)
    else if (name.endsWith('.html')) out.push(full)
  }
  return out
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })

const htmls = collectHtmls(src).filter((h) => !h.endsWith('index.html'))
for (const html of htmls) {
  let content = readFileSync(html, 'utf8')
  // 归位后 html 与 assets 同级：任意 ../ 前缀的 assets 引用统一改为 ./assets/
  // （demo html 文件名全局唯一，直接按文件名平铺，与 vite 的 root 设置无关）
  content = content.replace(/(\.\.\/)+assets\//g, './assets/')
  writeFileSync(join(dest, html.split(/[\\/]/).pop()), content)
}
// assets 目录原样拷贝（含共享 chunk 与 vue 运行时）
for (const name of readdirSync(src)) {
  const full = join(src, name)
  if (statSync(full).isDirectory() && name === 'assets') {
    cpSync(full, join(dest, 'assets'), { recursive: true })
  }
}

console.log(`[copy-demo] ${htmls.length} 个 demo 页 + assets -> ${relative(root, dest)}`)

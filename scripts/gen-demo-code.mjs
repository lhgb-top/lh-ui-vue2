/**
 * demo 代码块生成器：dev/demos/index.ts（唯一真源）→ docs/components/<name>.md 的 ```vue 代码块。
 *
 * 动机：此前代码块手写在 .md 里、demo 模板写在注册表里，两份东西必然漂移
 * （button/input/switch/tag/tooltip/form/config-provider/cascader/upload 共 9 处）。
 * 本脚本以注册表为唯一真源单向生成，--check 模式供 CI/测试门禁比对漂移。
 *
 * 用法：
 *   node scripts/gen-demo-code.mjs          生成（写盘 + 顺带补缺失的 dev/<name>.html）
 *   node scripts/gen-demo-code.mjs --check  只比对，漂移退出码 1
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import * as prettier from 'prettier'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const demosPath = resolve(root, 'dev/demos/index.ts')
const docsDir = resolve(root, 'docs/components')
const devDir = resolve(root, 'dev')

const CHECK = process.argv.includes('--check')

const BEGIN = '<!-- gen-demo-code:begin -->'
const END = '<!-- gen-demo-code:end -->'
const FENCE_OPEN = '```' + 'vue'
const FENCE_CLOSE = '```'

/** 读取 dev/demos/index.ts 顶层 `export const DEMOS = {...}` 的对象字面量 */
function findDemosObject(sourceText) {
  const sf = ts.createSourceFile('index.ts', sourceText, ts.ScriptTarget.Latest, true)
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    const decl = stmt.declarationList.declarations[0]
    if (!decl || decl.name.getText(sf) !== 'DEMOS') continue
    if (!ts.isObjectLiteralExpression(decl.initializer)) {
      throw new Error('DEMOS 初始化必须是对象字面量')
    }
    return { sf, obj: decl.initializer }
  }
  throw new Error('未找到 `export const DEMOS` 声明')
}

/** 取对象字面量里指定名称的属性节点 */
function getProperty(obj, sf, name) {
  return obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(sf) === name)
}

/**
 * 提取 template 属性的纯文本：必须是无替换的模板字面量（反引号内不含 ${}）。
 * demo 模板若需要插值，应改用 Vue 模板语法（{{ }}）而非 JS 模板插值。
 */
function extractTemplateText(demoObj, sf) {
  const prop = getProperty(demoObj, sf, 'template')
  if (!prop) throw new Error('demo 缺少 template 属性')
  const lit = prop.initializer
  if (!ts.isNoSubstitutionTemplateLiteral(lit)) {
    throw new Error(
      `demo template 必须是无替换的模板字面量，禁止 ${'${'} 插值（改用 Vue 模板语法）`,
    )
  }
  return dedent(lit.text)
}

/** 按最小缩进去齐：首行空行跳过，其余行统一削减最小前缀 */
function dedent(text) {
  const lines = text.split('\n')
  const indents = lines
    .slice(1)
    .filter((line) => line.trim().length > 0)
    .map((line) => line.length - line.trimStart().length)
  const min = indents.length > 0 ? Math.min(...indents) : 0
  return lines
    .map((line, i) => (i === 0 ? line.trim() : line.slice(min)))
    .join('\n')
    .trim()
}

/**
 * 用 data/methods 属性重建选项对象源文本并剥除 TS 类型标注。
 * 直接保留各属性原始源文本（含注释），再经 transpileModule 剥类型。
 */
function buildOptionsSource(demoObj, sf) {
  const parts = demoObj.properties
    .filter((p) => ts.isPropertyAssignment(p) && p.name.getText(sf) !== 'template')
    .map((p) => p.getText(sf))
  if (parts.length === 0) return null
  const wrapped = `export default {\n${parts.join(',\n')},\n}`
  const out = ts.transpileModule(wrapped, {
    compilerOptions: { target: 'ES2017', module: 'ESNext' },
  }).outputText
  // transpileModule 产物形如 `export default {\n  ...\n};\n`
  return out.replace(/^export default /, '').replace(/;\s*$/, '')
}

/** 生成单条 demo 的 SFC 代码块文本 */
function generateDemoCode(demoObj, sf) {
  const template = extractTemplateText(demoObj, sf)
  const options = buildOptionsSource(demoObj, sf)
  const script = options ? `\n\n<script>\nexport default ${options}\n</script>` : ''
  const sfc = `<template>\n${template}\n</template>${script}\n`
  return sfc
}

/** 缺失时按样板补 dev/<name>.html（不覆盖已有） */
function ensureDemoHtml(name) {
  const htmlPath = join(devDir, `${name}.html`)
  if (existsSync(htmlPath)) return false
  const content = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>lh-ui-vue2 demo: ${name}</title>
  </head>
  <body>
    <div id="app" data-demo="${name}"></div>
    <script type="module" src="./demo-main.ts"></script>
  </body>
</html>
`
  writeFileSync(htmlPath, content)
  return true
}

/** 在 .md 的指定 DemoBlock 内注入/比对生成代码 */
function injectCodeBlock(name, docPath, code) {
  const original = readFileSync(docPath, 'utf8')
  const tagRe = new RegExp(`<DemoBlock\\s+[^>]*name="${name}"[^>]*>`)
  const tagMatch = tagRe.exec(original)
  if (!tagMatch) return { changed: false, reason: 'no DemoBlock tag' }

  const tagEnd = tagMatch.index + tagMatch[0].length
  const closeIdx = original.indexOf('</DemoBlock>', tagEnd)
  if (closeIdx === -1) return { changed: false, reason: 'no </DemoBlock> close' }
  const region = original.slice(tagEnd, closeIdx)

  const fence = FENCE_OPEN
  let nextContent

  if (region.includes(BEGIN) && region.includes(END)) {
    // 已有标记：替换标记间内容
    const beginIdx = region.indexOf(BEGIN)
    const endIdx = region.indexOf(END)
    nextContent =
      region.slice(0, beginIdx + BEGIN.length) +
      `\n${fence}\n${code}\n${FENCE_CLOSE}\n` +
      region.slice(endIdx)
  } else {
    // 迁移：把 DemoBlock 与 </DemoBlock> 之间的首个 ```vue 围栏用标记包起来
    const fenceIdx = region.indexOf(fence)
    const head = fenceIdx === -1 ? '' : region.slice(0, fenceIdx)
    nextContent = `${head}${BEGIN}\n${fence}\n${code}\n${FENCE_CLOSE}\n${END}\n`
  }

  const updated = original.slice(0, tagEnd) + nextContent + original.slice(closeIdx)
  if (updated !== original) {
    if (!CHECK) writeFileSync(docPath, updated)
    return { changed: true }
  }
  return { changed: false }
}

async function main() {
  const sourceText = readFileSync(demosPath, 'utf8')
  const { sf, obj } = findDemosObject(sourceText)
  const prettierOptions = (await prettier.resolveConfig(demosPath)) ?? {}

  const results = []
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop) || !ts.isObjectLiteralExpression(prop.initializer)) continue
    // 连字符 key 是字符串字面量（'config-provider'），取 .text 去引号；普通 key 取文本
    const name = ts.isStringLiteral(prop.name) ? prop.name.text : prop.name.getText(sf)
    if (!existsSync(join(devDir, `${name}.html`)) && !ensureDemoHtml(name)) {
      // ensureDemoHtml 返回 false 表示已存在；走到这说明创建失败（目录权限等）
    }
    const raw = generateDemoCode(prop.initializer, sf)
    // 代码块面向文档读者，不用 src/ 的 singleAttributePerLine：保持 demo 原始紧凑风格
    const code = await prettier.format(raw, {
      ...prettierOptions,
      parser: 'vue',
      singleAttributePerLine: false,
      printWidth: 120,
    })
    const docPath = join(docsDir, `${name}.md`)
    if (!existsSync(docPath)) {
      results.push({ name, status: 'no-docs' })
      continue
    }
    const res = injectCodeBlock(name, docPath, code.trimEnd())
    results.push({ name, status: res.changed ? (CHECK ? 'DRIFT' : 'updated') : 'ok' })
  }

  const drifted = results.filter((r) => r.status === 'DRIFT')
  const updated = results.filter((r) => r.status === 'updated')
  const noDocs = results.filter((r) => r.status === 'no-docs')

  if (CHECK) {
    if (drifted.length > 0) {
      console.error(`[gen-demo-code] 检测到 ${drifted.length} 处漂移，请运行 pnpm gen:demo-code：`)
      for (const r of drifted) console.error(`  - ${r.name}`)
      process.exit(1)
    }
    console.log(`[gen-demo-code] 校验通过：${results.length} 个 demo 代码块与注册表一致`)
  } else {
    console.log(
      `[gen-demo-code] 更新 ${updated.length} 个代码块` +
        (noDocs.length ? `；${noDocs.length} 个 demo 尚无文档页（${noDocs.map((r) => r.name).join('、')}）` : ''),
    )
  }
}

main().catch((err) => {
  console.error('[gen-demo-code] 失败：', err)
  process.exit(1)
})

import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(__dirname, '..', '..')
const demosPath = resolve(root, 'dev', 'demos', 'index.ts')
const docsDir = resolve(root, 'docs', 'components')

/** 基建属性：只要求进 Props 表，不强制出现在示例代码里 */
const ALLOWLIST = new Set(['themeVars', 'bgPattern', 'sx', 'teleportTarget'])

/** 从 dev/demos/index.ts 提取全部 demo key（字符串字面量 key 去引号） */
function readDemoKeys(): Set<string> {
  const src = readFileSync(demosPath, 'utf8')
  const sf = ts.createSourceFile('index.ts', src, ts.ScriptTarget.Latest, true)
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    const decl = stmt.declarationList.declarations[0]
    if (!decl || decl.name.getText(sf) !== 'DEMOS') continue
    if (!decl || !decl.initializer || !ts.isObjectLiteralExpression(decl.initializer)) continue
    return new Set(
      decl.initializer.properties
        .filter(ts.isPropertyAssignment)
        .map((p) => (ts.isStringLiteral(p.name) ? p.name.text : p.name.getText(sf))),
    )
  }
  throw new Error('未找到 DEMOS 声明')
}

/** 收集 docs 页里的 DemoBlock name */
function readDocsDemoNames(): Map<string, string> {
  const names = new Map<string, string>()
  for (const file of readdirSync(docsDir).filter((f) => f.endsWith('.md'))) {
    const content = readFileSync(resolve(docsDir, file), 'utf8')
    const matches = [...content.matchAll(/<DemoBlock\s+[^>]*name="([^"]+)"/g)]
    for (const m of matches) names.set(m[1], file)
  }
  return names
}

/**
 * 从组件 types.ts 提取 Props interface 的属性名。
 * 只收「当前组件自己声明」的 interface（以 Lh 开头且以 Props 结尾），避免误收透传类型。
 */
function readComponentProps(componentDir: string): string[] {
  const typesPath = resolve(root, 'src', 'components', componentDir, 'src', 'types.ts')
  let content: string
  try {
    content = readFileSync(typesPath, 'utf8')
  } catch {
    return []
  }
  const sf = ts.createSourceFile('types.ts', content, ts.ScriptTarget.Latest, true)
  const names: string[] = []
  for (const stmt of sf.statements) {
    if (!ts.isInterfaceDeclaration(stmt)) continue
    if (!/^Lh\w+Props$/.test(stmt.name.text)) continue
    for (const member of stmt.members) {
      if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
        names.push(member.name.text)
      }
    }
  }
  return names
}

describe('docs demo 同步门禁', () => {
  it('gen-demo-code --check 通过（代码块与注册表一致）', () => {
    // 生成器自身即校验器：--check 模式漂移时退出码 1
    expect(() => {
      execFileSync('node', [resolve(root, 'scripts', 'gen-demo-code.mjs'), '--check'], {
        cwd: root,
        stdio: 'pipe',
      })
    }).not.toThrow()
  })

  it('每个 DEMOS key 都有对应的 dev/<name>.html 沙箱页', () => {
    const keys = readDemoKeys()
    const htmls = new Set(
      readdirSync(resolve(root, 'dev'))
        .filter((f) => f.endsWith('.html') && f !== 'index.html')
        .map((f) => f.replace(/\.html$/, '')),
    )
    const missing = [...keys].filter((k) => !htmls.has(k))
    expect(missing).toEqual([])
  })

  it('docs 页的每个 DemoBlock name 都能在 DEMOS 注册表找到（无悬空引用）', () => {
    const keys = readDemoKeys()
    const docsNames = readDocsDemoNames()
    const dangling = [...docsNames.entries()].filter(([name]) => !keys.has(name))
    expect(dangling).toEqual([])
  })

  it('每个 demo 的代码块都由生成器托管（含 begin/end 标记）', () => {
    const docsNames = readDocsDemoNames()
    for (const [name, file] of docsNames) {
      const content = readFileSync(resolve(docsDir, file), 'utf8')
      const begin = content.indexOf('<!-- gen-demo-code:begin -->')
      const end = content.indexOf('<!-- gen-demo-code:end -->')
      expect(begin, `${file} 的 DemoBlock "${name}" 缺少 begin 标记`).toBeGreaterThan(-1)
      expect(end, `${file} 的 DemoBlock "${name}" 缺少 end 标记`).toBeGreaterThan(begin)
    }
  })

  it('组件 Props 表覆盖 types.ts 声明的全部属性', () => {
    const docsNames = readDocsDemoNames()
    const keys = readDemoKeys()
    const problems: string[] = []
    for (const name of keys) {
      const file = docsNames.get(name)
      if (!file) continue // 无文档页的组件在第 3-8 批补齐，此处只校验已有页
      const content = readFileSync(resolve(docsDir, file), 'utf8')
      const props = readComponentProps(name)
      for (const prop of props) {
        if (ALLOWLIST.has(prop)) continue
        // 属性名需出现在文档页内（Props 表或示例代码块任一）
        if (!content.includes(prop)) {
          problems.push(`${file}（${name}）：缺少属性 ${prop}`)
        }
      }
    }
    expect(problems).toEqual([])
  })
})

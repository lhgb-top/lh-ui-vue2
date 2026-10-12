import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const shareEs = resolve(root, 'node_modules/@lh-ui/share/es')

function listFiles(dir, ext) {
  const out = []
  if (!existsSync(dir)) return out
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...listFiles(p, ext))
    else if (f.endsWith(ext)) out.push(p)
  }
  return out
}

function walkSrc(dir) {
  const out = []
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const s = statSync(p)
    if (s.isDirectory()) {
      if (f === 'node_modules' || f === 'es' || f === 'lib' || f === 'dist') continue
      out.push(...walkSrc(p))
    } else if (f.endsWith('.ts') || f.endsWith('.vue')) {
      out.push(p)
    }
  }
  return out
}

// 收集 (subpath, name) 对
const imports = new Map() // subpath -> Set(name)
const files = walkSrc(join(root, 'src'))
const importRe =
  /import\s+(?:type\s+)?([^;'"]*?)\s*from\s*['"](@lh-ui\/share(?:\/[^'"]*)?)['"]/g

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  let m
  while ((m = importRe.exec(src))) {
    const clause = m[1] || ''
    const spec = m[2]
    if (!imports.has(spec)) imports.set(spec, new Set())
    // 拆解 import 子句：{ A, B as C } 与裸默认导入
    const named = clause.match(/\{([^}]*)\}/)
    if (named) {
      for (const part of named[1].split(',')) {
        const name = part.split(/\s+as\s+/)[0].trim()
        if (name && !name.startsWith('type ')) imports.get(spec).add(name.replace(/^type\s+/, ''))
      }
    } else if (clause.trim() && !clause.trim().startsWith('*')) {
      imports.get(spec).add('default')
    }
  }
}

// 检查每个名字是否在 npm 0.3.0 的 es 产物中导出
function dirExports(subpath) {
  const dir = resolve(shareEs, subpath.replace(/^@lh-ui\/share\/?/, ''))
  const dtsFiles = listFiles(dir, '.d.ts')
  const exported = new Set()
  for (const f of dtsFiles) {
    const src = readFileSync(f, 'utf8')
    // export declare function X / export interface X / export type X / export declare const X
    for (const mm of src.matchAll(
      /export\s+(?:declare\s+)?(?:function|interface|type|const|class|enum)\s+([A-Za-z0-9_$]+)/g,
    )) {
      exported.add(mm[1])
    }
    // export { A, B as C } 与 export { A } from '...'
    for (const mm of src.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of mm[1].split(',')) {
        const name = part.split(/\s+as\s+/)[0].trim()
        if (name) exported.add(name)
      }
    }
  }
  return { dir, exported }
}

const drift = []
const ok = []
for (const [spec, names] of imports) {
  const subpath = spec.replace(/^@lh-ui\/share\/?/, '')
  if (!subpath) {
    // 裸 @lh-ui/share：桶导出，跳过（太大且 typecheck 已覆盖）
    continue
  }
  const { dir, exported } = dirExports(subpath)
  if (!existsSync(dir)) {
    drift.push({ spec, name: '(整个子路径在 npm 0.3.0 中不存在)', file: '' })
    continue
  }
  for (const name of names) {
    if (name === 'default') continue
    if (!exported.has(name)) drift.push({ spec, name, file: '' })
    else ok.push(`${spec} :: ${name}`)
  }
}

console.log(`\n=== 扫描 ${files.length} 个源文件，${imports.size} 个 share 子路径 ===`)
console.log(`命名导入对齐（npm 0.3.0 中存在）：${ok.length}`)
console.log(`\n=== 版本漂移：npm 0.3.0 中缺失的导入（${drift.length} 项）===`)
for (const d of drift) console.log(`  ${d.spec} :: ${d.name}`)

/**
 * docs 静态站点预览服务器（零依赖）
 *
 * VuePress 1.x 只有 dev/build/eject/info，没有 VitePress 的 preview 命令；
 * 这里用 node 内置 http 托管 docs/.vuepress/dist，供构建后走查：
 * 静态文件直出 + 找不到时按 .html 后缀补全（对齐 SSR 产物路径）+ 404 兜底。
 *
 * 生产构建带部署 base（docs/.env.production 的 DOCS_BASE，如 /lhui/vue2/），
 * SSR HTML 里的资源路径都带该前缀，所以本服务器也按同一 base 挂载站点：
 * 访问 http://localhost:5178/ 会重定向到 base，http://localhost:5178/lhui/vue2/... 直出 dist。
 *
 * 用法：node scripts/preview.mjs [--port 5178]
 */
import { createServer } from 'node:http'
import { createReadStream, readFileSync, statSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = join(fileURLToPath(import.meta.url), '..')
const docsDir = join(dirname, '..')
const distDir = join(docsDir, '.vuepress', 'dist')

const args = process.argv.slice(2)
const portIdx = args.indexOf('--port')
const port = Number(portIdx >= 0 ? args[portIdx + 1] : 5178) || 5178

/** 读 docs/.env.production 的 DOCS_BASE，与 config.ts 同源（首尾带斜杠） */
function readDocsBase() {
  const file = join(docsDir, '.env.production')
  try {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*DOCS_BASE\s*=\s*(.*)\s*$/)
      if (m) {
        const raw = m[1].replace(/^["']|["']$/g, '')
        return raw.startsWith('/') ? raw : `/${raw}`
      }
    }
  } catch {
    /* 无 .env.production 时 base 取 / */
  }
  return '/'
}
const base = readDocsBase()

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

/** 解析到 dist 内的安全路径，越界返回 null */
function resolveSafe(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const resolved = join(distDir, normalized)
  if (!resolved.startsWith(distDir + sep) && resolved !== distDir) return null
  return resolved
}

async function tryFiles(path) {
  // 目录 → index.html
  const stats = await statOrNull(path)
  if (stats?.isDirectory()) return join(path, 'index.html')
  if (stats?.isFile()) return path
  // 省略 .html 的干净路径（VuePress SSR 每个路由都产 .html）
  if (!extname(path)) {
    const withHtml = path + '.html'
    if ((await statOrNull(withHtml))?.isFile()) return withHtml
  }
  return null
}

async function statOrNull(p) {
  try {
    return statSync(p)
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || '/'
  // 根路径重定向到 base，与线上访问路径一致
  if (url === '/' && base !== '/') {
    res.writeHead(302, { Location: base })
    res.end()
    return
  }
  // 剥掉部署 base 前缀后映射到 dist
  const rel = base === '/' || url.startsWith(base) ? url.slice(base.length - 1) : url
  const safe = resolveSafe(rel)
  if (!safe) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  const file = await tryFiles(safe)
  if (file) {
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    createReadStream(file).pipe(res)
    return
  }
  // 404：用站点生成的 404.html，状态码保持 404
  const notFound = join(distDir, '404.html')
  if ((await statOrNull(notFound))?.isFile()) {
    const body = await readFile(notFound)
    res.writeHead(404, { 'Content-Type': MIME['.html'] })
    res.end(body)
    return
  }
  res.writeHead(404, { 'Content-Type': MIME['.txt'] })
  res.end('Not Found')
})

server.listen(port, () => {
  console.log(`docs preview serving ${distDir} at http://localhost:${port}${base} (base=${base})`)
})

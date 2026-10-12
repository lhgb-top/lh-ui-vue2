/**
 * local-share-alias.mjs 的类型声明（D-08 收口）
 *
 * dev/vite.config.ts、docs/.vitepress/config.ts 等以 ESM 导入该脚本，
 * 无声明时 tsc 报 TS7016，typecheck / CI 转红。签名与 mjs 实现保持同步：
 * 入参为仓库根目录，返回 vite alias 数组（兄弟仓不存在时为空数组，回退 npm 包）。
 * 改动 mjs 的入参/返回结构时，本文件需同步修改（与 plus 侧同源约定）。
 */

export interface LhLocalShareAlias {
  /** vite alias 匹配规则（本脚本内全部为正则） */
  find: RegExp
  /** 解析目标（share 仓源码的绝对路径，$1/$2 为正则捕获组回填） */
  replacement: string
}

export function createLocalShareAliases(repoRoot: string): LhLocalShareAlias[]

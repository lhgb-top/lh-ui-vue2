import type { LhAriaAttrs } from '@lh-ui/share/core/shared/a11y'

/**
 * 把 share a11y 纯函数产出的属性包转成 Vue2 模板可安全 v-bind 的形态。
 *
 * Vue2 会**移除**值为 false 的属性（实测：attrs 里 `aria-expanded: false`
 * 渲染不出任何属性节点），而 share 内核按 ARIA 语义返回三值布尔
 * （true / false / undefined）。这里把布尔显式转成 'true' / 'false' 字符串，
 * 与 Vue3 的渲染结果对齐；undefined 保留（表示「不输出该属性」）。
 *
 * @param attrs share 内核产出的 ARIA 属性包（可能含布尔 / undefined）
 * @returns 全部值为字符串的对象，undefined 的键被剔除
 */
export function resolveAriaAttrs(attrs: LhAriaAttrs): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of Object.keys(attrs)) {
    const value = attrs[key]
    if (value === undefined || value === null) continue
    out[key] = value === true ? 'true' : value === false ? 'false' : String(value)
  }
  return out
}

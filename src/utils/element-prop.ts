/**
 * Vue2「元素或选择器」类 prop 的运行时校验。
 *
 * Vue2 对 `type: [String, Object]` 的 Object 分支用的是 isPlainObject，
 * DOM 元素（HTMLDivElement 等）不是 plain object，会触发 dev 警告
 * 「Expected String, Object, got HTMLDivElement」。这类 prop 的类型契约
 * 一律是 `string | HTMLElement`（无对象形态），改用 validator 同时收下
 * 选择器字符串与真实元素；typeof HTMLElement 保护 SSR（Node 下无该全局）。
 */
export function isValidElementOrSelector(value: unknown): boolean {
  return (
    value == null ||
    typeof value === 'string' ||
    (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement)
  )
}

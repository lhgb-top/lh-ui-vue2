---
'@lh-ui/vue2': minor
---

# 图标修复：date/time-picker 去 emoji 化、input 前后缀改用 LhIcon

全面排查组件样式时发现三处移植期退化（未对齐 plus 参考实现），导致图标渲染不出来或无法保证垂直居中：

- **date-picker / time-picker**：触发器图标此前是 emoji（📅 / 🕐）。emoji 字形在默认行框内按基线排放，不同平台/字体下上下偏移、无法像素级居中，且与全家桶 SVG 图标体系不一致。改为 `<LhIcon name="date" size="small">`（与 plus 逐字对齐）
- **input**：前后缀此前用 `<i :class="prefixIcon">` 字体图标类——share 生态不含任何 iconfont 或 `lh-icon-*` 类，该 `<i>` 永远渲染不出图标，docs/demo 里的 `prefix-icon="lh-icon-search"` 也是无效示例。改为 `<LhIcon :name="prefixIcon">`，与 plus 的 `prefix-icon="search"`（LhIcon 图标名）API 对齐；docs/demo 示例与 props 表描述同步修正

配套的 scss 层修复（cascader 中间层样式、button loading 偏心、switch loading 滑块重叠等）在 `@lh-ui/share` 侧发出，本库依赖需在 share 发版后升级到对应版本。

---
'@lh-ui/vue2': patch
---

`@lh-ui/share` 依赖切换为已发布 npm 包。

- `dependencies` 从发布前过渡形态 `link:../lh-ui-share` 改为 `"@lh-ui/share": "^0.2.0"`，
  `pnpm install` 直接从 registry 解析，克隆本仓即可安装开发，不再依赖同父目录的 share 平级仓库。
- 顺带带上 share 0.2.0 的修复：`getNextListIndex` 不循环模式遇到中间位置禁用项不再误返 -1
  （transfer / cascader 的键盘导航不再被中间禁用项冻结）。

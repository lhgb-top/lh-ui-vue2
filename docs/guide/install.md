# 安装

## 环境要求

- Vue **2.7**（终点版本；不支持 2.6 及以下，不支持 IE11）
- 推荐 Node 20 + pnpm 10

## 包管理器安装

```bash
npm install @lh-ui/vue2
# 或
pnpm add @lh-ui/vue2
```

`@lh-ui/vue2` 的唯一运行时依赖是 `@lh-ui/share`（共享层：core 纯函数 / theme / constants / locales / types / 组件样式源），会自动一并安装。

## 手动引入样式

```ts
// 主题变量（明色 + 暗色）
import '@lh-ui/vue2/theme.css'
// 按需引入单组件样式（可选——全量入口已包含）
import '@lh-ui/vue2/style/button'
```

## 版本策略

- `@lh-ui/share` 升级需遵循「share 先发版 → UI 库升级回归 → 再发版」纪律。
- 当前状态：本地发版完成，npm 统一发布中（见仓库 README）。

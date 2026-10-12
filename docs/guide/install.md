# 安装

## 环境要求

- Vue **2.7**（终点版本；不支持 2.6 及以下，不支持 IE11）
- 推荐 Node 20 + pnpm 10

## 包管理器安装

```bash
npm install @lh-ui/vue2
# 或
pnpm add @lh-ui/vue2
# 或
yarn add @lh-ui/vue2
```

`@lh-ui/vue2` 的唯一运行时依赖是 `@lh-ui/share`（共享层：core 纯函数 / theme / constants / locales / types / 组件样式源），会自动一并安装。

## 私有服务器安装

若包托管在私有服务器而非公共 registry，按以下任一方式安装。

### 方式一：tarball 直链

服务器仅提供静态文件托管即可。把 `npm pack` 产出的 `lh-ui-vue2-x.y.z.tgz` 放到服务器目录，然后：

```bash
npm install https://你的域名/pkg/lh-ui-vue2-1.0.0.tgz
# 或
pnpm add https://你的域名/pkg/lh-ui-vue2-1.0.0.tgz
# 或
yarn add https://你的域名/pkg/lh-ui-vue2-1.0.0.tgz
```

> tarball 直链方式下，`@lh-ui/share` 仍会从当前 registry 解析，需保证该包在公共 registry 或你的私有 registry 上可见。

### 方式二：自建 registry（如 Verdaccio）

自建 registry 支持 semver 拉取与版本管理。在项目根目录的 `.npmrc` 中按 scope 精准路由（不影响其他包的安装源）：

```ini
@lh-ui:registry=https://你的域名/
```

随后照常安装：

```bash
pnpm add @lh-ui/vue2
```

## 手动引入样式

```ts
// 主题变量（明色 + 暗色）
import '@lh-ui/vue2/theme.css'
// 按需引入单组件样式（可选——全量入口已包含）
import '@lh-ui/vue2/style/button'
```

## 版本策略

- `@lh-ui/share` 升级需遵循「share 先发版 → UI 库升级回归 → 再发版」纪律。
- 当前状态：`@lh-ui/vue2` 已发布 1.0.0，`@lh-ui/share` 为 0.1.0。

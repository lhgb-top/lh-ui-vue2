---
"@lh-ui/vue2": patch
---

文档站站点互链与 homepage 统一到家族部署域名 `www.lhgb.top/lhui/{库名}/`：

- `docs/.vuepress/config.ts` 中英文 nav 的「Vue3 版」互链原指向 `lh-ui-plus.lhgb.top`
  （旧规划域名，Nginx 未配置），改为 `https://www.lhgb.top/lhui/plus/`
- 同文件 `hostname` 的默认回退值由旧规划域名 `https://lh-ui.lhgb.top` 改为
  `https://www.lhgb.top`（生产实参由 `docs/.env.production` 提供，此项仅影响回退态）
- `package.json` 的 `homepage` 同步改为 `https://www.lhgb.top/lhui/vue2/`

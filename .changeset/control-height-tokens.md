---
'@lh-ui/vue2': minor
---

# 跟进 share 高度令牌专项（control-height）

share 新增 `--lh-control-height-{mini,small,medium,large,x-large}` 并统一了全部表单控件高度，
本库构建期编译 share 样式进 `dist/`，自动随之更新。本库自身零样式改动（样式唯一源在 share）。

## 破坏性变化（视觉，随 share 0.4.0 生效）

- input 由 padding 派生改为固定高度：mini 28→20、small 32→24、medium 39→32、large 50→40
- cascader 42→32、tree-select 44→32（原 `min-height` 被 padding + 边框顶高，"同高"此前未兑现）
- input-number small 30→24
- date-picker / time-picker 约 35→32
- input 单行分支移除 has-label 的 `padding-top: 16px`（textarea 不变）

## 依赖升级

- `@lh-ui/share` `^0.3.0` → `^0.4.0`，并重解析 lock + 全量回归。**此项在 share 0.4.0
  发上 npm 后执行**：提前改会使单仓 clone 的 `pnpm install` 无法解析（registry 尚无 0.4.0）；
  家族布局下 dev / test / docs / typecheck 四处 alias 直读 share 源码，不受影响。

## 开发体验（不发版，dev/ 不在 files 内）

- dev 沙箱新增 `control-heights` 混排 demo（`dev/control-heights.html` +
  `dev/demos/index.ts` 的 DEMOS 注册表）：small / medium / large 三档同行混排
  input / select / cascader / tree-select / date-picker / time-picker / input-number / button，
  逐档比对顶底边齐平；另有 label + show-word-limit 与 textarea + label 组合，
  验证标签不再因 count 撑高 wrapper 而偏上。

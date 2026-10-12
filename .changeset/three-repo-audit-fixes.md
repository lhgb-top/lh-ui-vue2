---
'@lh-ui/vue2': minor
---

三库审计修复批次（2026-10 审计报告 V2-02 ~ V2-13 / D-08 收尾）：

**修复（P0）**

- **form**：provide 上下文改 plain getter 对象（红线 #6「provide 不得快照」；Vue2.7 的 reactive() 会把 getter 摊平成一次性取值，故不用 reactive 包裹，getter 读 defineProps 的响应式代理，消费方 computed/render 内正常建立依赖）；`model` 去快照；initialValues 随 rules 到达增量补拍（异步 rules 的字段现在可以 reset）
- **collapse**：受控模式补 `watch(modelValue)` 同步（外部更新后 aria-expanded 与面板展开态回显；plus 同源缺陷一并修复）

**修复（P1）**

- **Dialog 关闭链**：watch 补状态守卫（close/input/unlockScroll 不再双发）；Esc 监听补 `isVisible` 与弹层栈守卫（已关闭实例不再解掉别的弹层的滚动锁）；初始 `modelValue=true` 补打开栈登记与滚动锁（对齐 Drawer）；滚动锁加状态跟踪（未锁不解）；拖拽监听补卸载清理
- **Drawer**：接弹层打开顺序栈（Esc 只关栈顶）、滚动锁状态跟踪、初始打开补栈登记
- **slider**：受控值变化回显（表单 reset / 程序赋值跟随，拖拽中跳过）；拖拽监听补卸载清理
- **transfer / tree**：键盘焦点查询限定本实例子树（document 级 querySelector 在多实例时落到别的实例；tree 按「红线 #8」在事件派发内同步捕获 currentTarget）
- **breadcrumb / steps**：子项注册从 Symbol token 改为落 DOM 的 uid（`data-lh-bc-item` / `data-lh-step-item`），父级 `onUpdated` 按 DOM 位序重排（签名比对防死循环，红线 #7）——中段 `v-if` 卸载重挂后序号不再与 DOM 顺序脱钩；breadcrumb 隐藏项从 v-if 改 v-show 保持位序可查
- **steps 折行机制同步**：`getStepClassNames` 的末项类名改结构性 `lineLast`（share 已改，本仓调用点同步）——子项在各自 setup 阶段渲染、后续兄弟尚未注册，靠总数判 isLast 会让首屏（含 SSR）每项都误判为末项；父级 `onMounted` / `onUpdated` / `watch(direction, itemTokens)` / `ResizeObserver` 四时机测各子项 offsetTop，经 `getStepsLineLastIndices` 算出每行末项下发，行末连接线不再指向行尾空白（与 plus 同源实现）
- **typecheck（D-08 收口）**：新增 `scripts/local-share-alias.d.mts` 类型声明；移植 plus 的 `gen-dev-tsconfig` 机制——`pnpm typecheck` 先生成 `tsconfig.dev.json` 把 `@lh-ui/share/*` 映射到兄弟仓源码再 `tsc -p`，share 未发版改动（如 isAffixFixed 加参）不再让 typecheck 与运行时不一致；`pnpm typecheck:npm` 保留作按 npm 包类型的漂移探测入口

**修复（P2）**

- tooltip：彩底文字色写死 `#fff` 换 `var(--lh-color-on-primary, #fff)`
- affix：`offsetWidth ?? 'auto'` 拼出 `"autopx"` 的防御缺陷修正
- layout：Aside 登记改计数制（多 Aside 布局卸载其一不再整体切回 horizontal）
- loading 指令：`componentUpdated` 对对象形式 options 的文案/参数变更生效（关闭重开）
- popover：teleportTarget computed 补 `typeof document` 守卫（与 cascader/date-picker/time-picker 口径一致）
- composables：新增 `useLhOverlayStack` 弹层打开顺序栈（与 plus 同构）
- affix 调用点：适配 share `isAffixFixed` 的新视口高度入参（底部吸附判定修复）

import Vue from 'vue'
import type { ComponentOptions } from 'vue'
import LhUIVue2, { LhMessage, LhNotification, LhLoading } from '../src'
// 样式走 share 源码实时编译（本地联动）：聚合文件含主题令牌 + 全部组件规则，
// 家族布局下 alias 到同级 share 仓 styles/，改 share 样式即时生效；CI 回退 npm 包
import '@lh-ui/share/styles/index.scss'
import './demo.css'
import { DEMOS } from './demos'

// 统一全量注册：demo 模板直接使用全局组件（与文档「全量引入」用户路径一致）
Vue.use(LhUIVue2)

// 命令式服务挂全局：demo 的 methods 直接裸写 LhMessage.success(...) 即可（浏览器全局解析），
// 生成的文档代码块与用户真实用法一致；此处是沙箱专有接线，不进文档代码块
;(window as unknown as Record<string, unknown>).LhMessage = LhMessage
;(window as unknown as Record<string, unknown>).LhNotification = LhNotification
;(window as unknown as Record<string, unknown>).LhLoading = LhLoading

// 跟随 docs 站明暗：DemoBlock 通过 ?theme=dark 带入（聚合 scss 已含 [data-theme=dark] 块）
if (new URLSearchParams(location.search).get('theme') === 'dark') {
  document.documentElement.dataset.theme = 'dark'
}

const app = document.getElementById('app')
const name = app?.dataset.demo ?? ''

const demo = DEMOS[name]
if (!demo) {
  if (app) app.textContent = `未知 demo：${name}`
} else {
  new Vue({
    ...demo,
    // 每个 demo 自带 ConfigProvider 主题壳，展示默认国风变量
    template: `<div class="lh-demo-root">${demo.template}</div>`,
  } as ComponentOptions<Vue>).$mount(app!)
}

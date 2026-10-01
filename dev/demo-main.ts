import Vue from 'vue'
import type { ComponentOptions } from 'vue'
import LhUIVue2 from '../src'
import '@lh-ui/share/theme.css'
import './demo.css'
import { DEMOS } from './demos'

// 统一全量注册：demo 模板直接使用全局组件（与文档「全量引入」用户路径一致）
Vue.use(LhUIVue2)

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

import Vue from 'vue'
import LhUIVue2 from '../src'
// 样式走 share 源码实时编译（本地联动）：家族布局下 alias 到同级 share 仓 styles/，
// 改 share 样式即时生效；CI 单仓 clone 时回退 npm 包的 ./styles/index.scss
import '@lh-ui/share/styles/index.scss'
import './demo.css'
import './demos'

// playground：全量注册冒烟
Vue.use(LhUIVue2)

new Vue({
  data: () => ({ count: 0, text: '', on: true }),
  template: `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
      <h3>lh-ui-vue2 Playground（全量注册冒烟）</h3>
      <LhConfigProvider>
        <LhButton type="primary" @click="count = count + 1">点击 {{ count }}</LhButton>
        <LhInput v-model="text" placeholder="试试输入" clearable />
        <LhSwitch v-model="on" :active-text="'开'" :inactive-text="'关'" />
        <LhTag closable>水墨</LhTag>
      </LhConfigProvider>
      <p>各组件完整演示见 <code>demos/&lt;name&gt;.html</code></p>
    </div>
  `,
}).$mount('#app')

import Vue from 'vue'
import LhUIVue2 from '../src'
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

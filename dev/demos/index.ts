import type Vue from 'vue'

/**
 * demo 注册表：模板字符串由完整构建的 vue（vue/dist/vue.esm.js）编译（红线 #10 别名）。
 * key 与 dev/demos/entries/<name>.html 的 data-demo 对应，也是 docs DemoBlock 的 name。
 */
/**
 * demo 定义：选项式组件 + template 字符串（完整构建编译，红线 #10）。
 * methods 内 this 为 Vue 实例与 data 的合并形态（$refs/result 等可用）
 */
export interface LhDemoDefinition {
  template: string
  data?: () => Record<string, unknown>
  methods?: Record<string, (this: Vue & Record<string, unknown>, ...args: unknown[]) => unknown>
}

export const DEMOS: Record<string, LhDemoDefinition> = {
  button: {
    template: `
      <div class="demo-row">
        <LhButton>默认按钮</LhButton>
        <LhButton type="primary">主要按钮</LhButton>
        <LhButton type="primary" plain>朴素按钮</LhButton>
        <LhButton type="primary" round>圆角按钮</LhButton>
        <LhButton type="primary" loading>加载中</LhButton>
        <LhButton type="primary" disabled>禁用</LhButton>
        <LhButton icon="lh-icon-search">图标按钮</LhButton>
      </div>
    `,
  },
  icon: {
    template: `
      <div class="demo-row">
        <LhIcon name="star" size="24" />
        <LhIcon name="search" size="24" color="var(--lh-primary-color)" />
        <LhIcon name="loading" size="24" />
        <LhIcon name="arrow-down" size="24" />
        <LhIcon name="check" size="24" color="var(--lh-success-color)" />
        <LhIcon name="warning" size="24" color="var(--lh-warning-color)" />
      </div>
    `,
  },
  input: {
    template: `
      <div class="demo-col">
        <LhInput v-model="text" placeholder="请输入内容" clearable />
        <LhInput v-model="text" prefix-icon="lh-icon-search" placeholder="带前缀图标" />
        <LhInput v-model="text" type="textarea" :rows="3" placeholder="多行文本" />
        <LhInput v-model="text" disabled placeholder="禁用状态" />
        <p class="demo-note">当前值：{{ text || '（空）' }}</p>
      </div>
    `,
    data: () => ({ text: '' }),
  },
  select: {
    template: `
      <div class="demo-col">
        <LhSelect v-model="value" :options="options" placeholder="请选择题材" clearable />
        <p class="demo-note">当前值：{{ value || '（未选择）' }}</p>
      </div>
    `,
    data: () => ({
      value: 'ink',
      options: [
        { value: 'ink', label: '水墨' },
        { value: 'paper', label: '宣纸' },
        { value: 'seal', label: '印章' },
        { value: 'blank', label: '留白' },
      ],
    }),
  },
  checkbox: {
    template: `
      <div class="demo-col">
        <LhCheckbox v-model="single" label="单独勾选" />
        <LhCheckboxGroup v-model="picked">
          <LhCheckbox label="山水" value="shan" />
          <LhCheckbox label="花鸟" value="hua" />
          <LhCheckbox label="人物" value="ren" />
        </LhCheckboxGroup>
        <p class="demo-note">组值：{{ JSON.stringify(picked) }}</p>
      </div>
    `,
    data: () => ({ single: true, picked: ['shan'] }),
  },
  radio: {
    template: `
      <div class="demo-col">
        <LhRadioGroup v-model="style">
          <LhRadio label="工笔" value="gongbi" />
          <LhRadio label="写意" value="xieyi" />
          <LhRadio label="泼墨" value="pomo" />
        </LhRadioGroup>
        <p class="demo-note">当前画风：{{ style }}</p>
      </div>
    `,
    data: () => ({ style: 'xieyi' }),
  },
  switch: {
    template: `
      <div class="demo-col">
        <LhSwitch v-model="on" active-text="夜模式" inactive-text="昼模式" />
        <LhSwitch v-model="on2" disabled />
        <p class="demo-note">状态：{{ on ? '开' : '关' }}</p>
      </div>
    `,
    data: () => ({ on: true, on2: false }),
  },
  tag: {
    template: `
      <div class="demo-row">
        <LhTag>默认</LhTag>
        <LhTag type="primary">主要</LhTag>
        <LhTag type="success">成功</LhTag>
        <LhTag type="warning">警告</LhTag>
        <LhTag type="danger">危险</LhTag>
        <LhTag type="primary" closable @close="closed = true">可关闭</LhTag>
        <LhTag v-if="!closed" type="info" round>已关闭后隐藏</LhTag>
      </div>
    `,
    data: () => ({ closed: false }),
  },
  dialog: {
    template: `
      <div>
        <LhButton type="primary" @click="visible = true">打开对话框</LhButton>
        <LhDialog v-model="visible" title="题跋" width="420px">
          <p style="margin: 0;">/dialog 对话框已挂载到 body，遮罩与内容均为 fixed 定位。</p>
          <template #footer>
            <LhButton @click="visible = false">取消</LhButton>
            <LhButton type="primary" @click="visible = false">落款</LhButton>
          </template>
        </LhDialog>
      </div>
    `,
    data: () => ({ visible: false }),
  },
  tooltip: {
    template: `
      <div class="demo-row" style="padding: 24px 0 48px;">
        <LhTooltip content="上方的提示" placement="top">
          <LhButton>上</LhButton>
        </LhTooltip>
        <LhTooltip content="下方的提示" placement="bottom">
          <LhButton>下</LhButton>
        </LhTooltip>
        <LhTooltip content="点击触发" trigger="click">
          <LhButton type="primary">点击</LhButton>
        </LhTooltip>
        <LhTooltip content="主题色提示" type="primary">
          <LhButton>主题色</LhButton>
        </LhTooltip>
      </div>
    `,
  },
  'config-provider': {
    template: `
      <div class="demo-col">
        <LhConfigProvider :theme-vars="{ 'primary-color': '#4a6741', 'bg-color': '#f4f7ee' }">
          <div style="padding: 16px; border: 1px dashed var(--lh-primary-color); display: flex; gap: 12px; flex-wrap: wrap;">
            <LhButton type="primary">竹青主题按钮</LhButton>
            <LhTag type="primary">竹青标签</LhTag>
            <LhInput placeholder="竹青输入框" style="width: 180px;" />
          </div>
        </LhConfigProvider>
        <p class="demo-note">组件级 themeVars 覆盖全局 --lh-* 变量（优先级：组件 > componentTheme > 全局）。</p>
      </div>
    `,
  },
  form: {
    template: `
      <div>
        <LhForm ref="form" :model="form" :rules="rules" label-width="80px">
          <LhFormItem prop="name" label="姓名" required>
            <LhInput v-model="form.name" placeholder="请输入姓名" />
          </LhFormItem>
          <LhFormItem prop="genre" label="题材">
            <LhSelect v-model="form.genre" :options="genres" placeholder="请选择" />
          </LhFormItem>
          <LhFormItem>
            <LhButton type="primary" @click="submit">提交</LhButton>
            <LhButton @click="reset">重置</LhButton>
          </LhFormItem>
        </LhForm>
        <p class="demo-note">提交结果：{{ result }}</p>
      </div>
    `,
    data: () => ({
      form: { name: '', genre: '' },
      rules: { name: [{ required: true, message: '' }] },
      genres: [
        { value: 'shan', label: '山水' },
        { value: 'hua', label: '花鸟' },
      ],
      result: '（未提交）',
    }),
    methods: {
      submit() {
        const form = (this.$refs as unknown as Record<string, { validate: () => Promise<boolean> }>).form
        form.validate().then((ok) => {
          this.result = ok ? '校验通过 ✓' : '校验失败：姓名必填'
        })
      },
      reset() {
        ;(this.$refs as unknown as Record<string, { resetFields: () => void }>).form.resetFields()
        this.result = '（已重置）'
      },
    },
  },
}

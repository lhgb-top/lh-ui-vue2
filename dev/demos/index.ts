import type Vue from 'vue'
import { LhMessage, LhNotification, LhLoading } from '../../src'

/**
 * demo 注册表：模板字符串由完整构建的 vue（vue/dist/vue.esm.js）编译（红线 #10 别名）。
 * 唯一 demo 真源：dev 沙箱（dev/<name>.html 的 data-demo）与 docs 站
 * （DemoBlock 活渲染，VuePress 1.x 迁移后）都从这里取条目。
 */
/**
 * demo 定义：选项式组件 + template 字符串（完整构建编译，红线 #10）。
 * methods 内 this 为 Vue 实例与 data 的合并形态（$refs/result 等可用）；
 * 参数与 this 的 data 成员放宽到 any：模板回调的实参形状由作者按组件契约声明，
 * 沙箱不做静态收窄（no-explicit-any 已在 eslint 关闭，仅限 dev 目录）
 */
export interface LhDemoDefinition {
  template: string
  data?: () => Record<string, unknown>
  methods?: Record<string, (this: Vue & Record<string, any>, ...args: any[]) => unknown>
  mounted?: (this: Vue & Record<string, any>) => void
}

export const DEMOS: Record<string, LhDemoDefinition> = {
  button: {
    template: `
      <div class="demo-col">
        <div class="demo-row">
          <LhButton>默认按钮</LhButton>
          <LhButton type="primary">主要按钮</LhButton>
          <LhButton type="success">成功</LhButton>
          <LhButton type="warning">警告</LhButton>
          <LhButton type="danger">危险</LhButton>
        </div>
        <div class="demo-row">
          <LhButton type="primary" plain>朴素按钮</LhButton>
          <LhButton type="primary" round>圆角按钮</LhButton>
          <LhButton type="primary" circle icon="lh-icon-search" />
          <LhButton type="primary" loading>加载中</LhButton>
          <LhButton type="primary" disabled>禁用</LhButton>
        </div>
        <div class="demo-row">
          <LhButton size="small">小型</LhButton>
          <LhButton size="medium">默认尺寸</LhButton>
          <LhButton size="large">大型</LhButton>
          <LhButton type="primary" block style="max-width: 200px;">块级（block）</LhButton>
        </div>
        <div class="demo-row">
          <LhButton icon="lh-icon-search">图标按钮</LhButton>
          <LhButton native-type="submit" type="primary">原生 type=submit</LhButton>
          <LhButton href="https://lh-ui.lhgb.top" target="_blank">链接按钮（href）</LhButton>
        </div>
      </div>
    `,
  },
  icon: {
    template: `
      <div class="demo-col">
        <div class="demo-row">
          <LhIcon name="star" size="24" />
          <LhIcon name="search" size="24" color="var(--lh-primary-color)" />
          <LhIcon name="loading" size="24" />
          <LhIcon name="arrow-down" size="24" />
          <LhIcon name="check" size="24" color="var(--lh-success-color)" />
          <LhIcon name="warning" size="24" color="var(--lh-warning-color)" />
        </div>
        <div class="demo-row">
          <LhIcon name="star" size="16" />
          <LhIcon name="star" size="20" />
          <LhIcon name="star" size="28" />
          <LhIcon name="star" size="36" color="var(--lh-danger-color)" />
        </div>
      </div>
    `,
  },
  input: {
    template: `
      <div class="demo-col" style="gap: 18px;">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhInput v-model="text" placeholder="请输入内容" clearable name="title" />
          <LhInput v-model="text" prefix-icon="search" suffix-icon="close" placeholder="前后缀图标" />
        </div>
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhInput v-model="secret" type="password" placeholder="密码" autocomplete="new-password" />
          <LhInput v-model="text" readonly placeholder="只读" />
          <LhInput v-model="text" disabled placeholder="禁用状态" />
        </div>
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap; align-items: center;">
          <LhInput v-model="text" size="small" placeholder="small" />
          <LhInput v-model="text" size="medium" placeholder="medium" />
          <LhInput v-model="text" size="large" placeholder="large" />
        </div>
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhInput v-model="poem" type="textarea" :rows="2" placeholder="多行文本（rows=2）" resize="vertical" />
          <LhInput v-model="poem" type="textarea" autosize placeholder="自适应行高" />
        </div>
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhInput v-model="limited" :maxlength="20" show-word-limit placeholder="字数统计" />
          <LhInput v-model="text" label="浮动标签" placeholder="与 placeholder 互斥" />
        </div>
        <p class="demo-note">当前值：{{ text || '（空）' }}</p>
      </div>
    `,
    data: () => ({ text: '', secret: '', poem: '', limited: '' }),
  },
  // —— P2 高度令牌专项：同表单混排验证（同行控件顶/底边齐平 + label 落在输入框垂直中心） ——
  'control-heights': {
    template: `
      <div class="demo-col" style="gap: 18px; max-width: none;">
        <div class="demo-row">
          <span class="demo-note" style="width: 52px;">small</span>
          <LhInput v-model="text" size="small" placeholder="input" />
          <LhSelect v-model="theme" :options="options" size="small" placeholder="select" />
          <LhInputNumber v-model="num" size="small" />
          <LhButton size="small">button</LhButton>
        </div>
        <div class="demo-row">
          <span class="demo-note" style="width: 52px;">medium</span>
          <LhInput v-model="text" size="medium" placeholder="input" />
          <LhSelect v-model="theme" :options="options" size="medium" placeholder="select" />
          <LhCascader v-model="path" :options="cascaderOptions" placeholder="cascader" />
          <LhTreeSelect v-model="treeVal" :data="treeData" placeholder="tree-select" />
          <LhDatePicker v-model="date" placeholder="date" />
          <LhTimePicker v-model="time" placeholder="time" />
          <LhInputNumber v-model="num" size="medium" />
          <LhButton size="medium">button</LhButton>
        </div>
        <div class="demo-row">
          <span class="demo-note" style="width: 52px;">large</span>
          <LhInput v-model="text" size="large" placeholder="input" />
          <LhSelect v-model="theme" :options="options" size="large" placeholder="select" />
          <LhInputNumber v-model="num" size="large" />
          <LhButton size="large">button</LhButton>
        </div>
        <div class="demo-row">
          <span class="demo-note" style="width: 52px;">label</span>
          <LhInput v-model="labeled" label="浮动标签" style="width: 170px;" />
          <LhInput v-model="limited" :maxlength="20" show-word-limit label="字数统计" style="width: 190px;" />
          <LhInput v-model="poem" type="textarea" :rows="2" label="多行标签" style="width: 210px;" />
        </div>
        <p class="demo-note">
          逐档比对同行控件的顶/底边是否齐平（同行 demo-row 已 align-items: center，
          高度一致则顶底同时对齐）。带 label 与字数统计时标签应落在输入框垂直中心，
          不再因 count 撑高 wrapper 而偏上；textarea + label 的行为保持不变。
          cascader / tree-select / date-picker / time-picker 当前只画 medium 一档
          （size 档位不齐属另一专项，见 share 的 tokens 文档「已知的令牌缺口」），
          故只出现在 medium 行。
        </p>
      </div>
    `,
    data: () => ({
      text: '',
      labeled: '',
      limited: '',
      poem: '',
      theme: undefined as string | undefined,
      path: [] as (string | number)[],
      treeVal: '',
      date: '',
      time: '',
      num: 1,
      options: [
        { value: 'ink', label: '水墨' },
        { value: 'paper', label: '宣纸' },
        { value: 'seal', label: '印章' },
      ],
      cascaderOptions: [
        {
          value: 'shan',
          label: '山水',
          children: [
            { value: 'pomo', label: '泼墨' },
            { value: 'qinglu', label: '青绿' },
          ],
        },
        {
          value: 'huaniao',
          label: '花鸟',
          children: [{ value: 'gongbi', label: '工笔' }],
        },
      ],
      treeData: [
        {
          key: 'song',
          label: '宋代',
          children: [
            { key: 'xishan', label: '溪山行旅' },
            { key: 'zaochun', label: '早春图' },
          ],
        },
      ],
    }),
  },

  select: {
    template: `
      <div class="demo-col" style="gap: 18px;">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhSelect v-model="value" :options="options" placeholder="请选择题材" clearable name="theme" />
          <LhSelect v-model="value" :options="options" size="small" />
          <LhSelect v-model="value" :options="options" size="large" />
        </div>
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhSelect v-model="value" :options="options" disabled />
          <LhSelect v-model="empty" :options="[]" aria-label="空数据">
            <template #empty>
              <span class="demo-note">插槽 empty：暂无匹配题材</span>
            </template>
          </LhSelect>
        </div>
        <p class="demo-note">当前值：{{ value || '（未选择）' }}</p>
      </div>
    `,
    data: () => ({
      value: 'ink',
      empty: undefined as string | undefined,
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
      <div class="demo-col" style="gap: 18px;">
        <div class="demo-row" style="gap: 20px; flex-wrap: wrap;">
          <LhCheckbox v-model="single" label="单独勾选" name="agree" />
          <LhCheckbox v-model="indeterminate" label="全选" indeterminate />
          <LhCheckbox v-model="disabledSingle" label="禁用" disabled />
        </div>
        <div>
          <LhCheckboxGroup v-model="picked" name="themes">
            <LhCheckbox label="山水" value="shan" />
            <LhCheckbox label="花鸟" value="hua" />
            <LhCheckbox label="人物" value="ren" disabled />
          </LhCheckboxGroup>
        </div>
        <div>
          <LhCheckboxGroup v-model="picked" disabled>
            <LhCheckbox label="山水" value="shan" />
            <LhCheckbox label="花鸟" value="hua" />
          </LhCheckboxGroup>
          <p class="demo-note">整组 disabled</p>
        </div>
        <div class="demo-row" style="gap: 20px; flex-wrap: wrap; align-items: center;">
          <LhCheckboxGroup v-model="picked" size="small">
            <LhCheckbox label="山水" value="shan" />
          </LhCheckboxGroup>
          <LhCheckboxGroup v-model="picked" size="large">
            <LhCheckbox label="山水" value="shan" />
          </LhCheckboxGroup>
        </div>
        <p class="demo-note">组值：{{ JSON.stringify(picked) }}</p>
      </div>
    `,
    data: () => ({
      single: true,
      indeterminate: true,
      disabledSingle: false,
      picked: ['shan'],
    }),
  },
  radio: {
    template: `
      <div class="demo-col" style="gap: 18px;">
        <div>
          <LhRadioGroup v-model="style" name="painting-style">
            <LhRadio label="工笔" value="gongbi" />
            <LhRadio label="写意" value="xieyi" />
            <LhRadio label="泼墨" value="pomo" disabled />
          </LhRadioGroup>
        </div>
        <div>
          <LhRadioGroup v-model="style" disabled>
            <LhRadio label="工笔" value="gongbi" />
            <LhRadio label="写意" value="xieyi" />
          </LhRadioGroup>
          <p class="demo-note">整组 disabled</p>
        </div>
        <div class="demo-row" style="gap: 20px; flex-wrap: wrap; align-items: center;">
          <LhRadioGroup v-model="style" size="small">
            <LhRadio label="工笔" value="gongbi" />
          </LhRadioGroup>
          <LhRadioGroup v-model="style" size="large">
            <LhRadio label="工笔" value="gongbi" />
          </LhRadioGroup>
        </div>
        <div>
          <LhRadio v-model="standalone" label="独立单选（value 透传）" :value="true" />
          <p class="demo-note">当前画风：{{ style }}；独立值：{{ String(standalone) }}</p>
        </div>
      </div>
    `,
    data: () => ({ style: 'xieyi', standalone: false }),
  },
  switch: {
    template: `
      <div class="demo-col" style="gap: 20px;">
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap;">
          <LhSwitch v-model="on" active-text="夜模式" inactive-text="昼模式" name="theme" />
          <LhSwitch v-model="loading" loading />
          <LhSwitch v-model="on2" disabled />
        </div>
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; align-items: center;">
          <LhSwitch v-model="s" size="small" active-text="小" />
          <LhSwitch v-model="m" size="medium" active-text="中" />
          <LhSwitch v-model="l" size="large" active-text="大" />
        </div>
        <p class="demo-note">loading 态禁点且显示加载圈；name 透传到原生 input。</p>
      </div>
    `,
    data: () => ({ on: true, on2: false, loading: true, s: true, m: true, l: false }),
  },
  'input-number': {
    template: `
      <div class="demo-col" style="gap: 20px;">
        <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center;">
          <LhInputNumber v-model="count" :min="1" :max="99" :step="1" placeholder="数量" name="count" />
          <span class="demo-note">min=1 max=99，受控值：{{ count }}</span>
        </div>
        <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center;">
          <LhInputNumber v-model="price" :step="0.5" :precision="2" :min="0" />
          <span class="demo-note">step=0.5 precision=2：{{ price }}</span>
        </div>
        <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center;">
          <LhInputNumber v-model="strict" :step="10" step-strictly />
          <span class="demo-note">stepStrictly：输入框失焦后归到 10 的倍数</span>
        </div>
        <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center;">
          <LhInputNumber v-model="noControls" :controls="false" placeholder="无步进器" />
          <LhInputNumber v-model="disabledVal" disabled />
        </div>
        <div class="demo-row" style="gap: 16px; flex-wrap: wrap; align-items: center;">
          <LhInputNumber v-model="sized" size="small" />
          <LhInputNumber v-model="sized" size="medium" />
          <LhInputNumber v-model="sized" size="large" />
        </div>
        <p class="demo-note">controls=false 隐藏加减按钮；输入框聚焦时方向键（↑/↓）也可步进。</p>
      </div>
    `,
    data: () => ({
      count: 6,
      price: 12.5,
      strict: 20,
      noControls: undefined as number | undefined,
      disabledVal: 3,
      sized: 8,
    }),
  },
  rate: {
    template: `
      <div class="demo-col" style="gap: 22px;">
        <div>
          <LhRate v-model="score" :max="5" show-score score-template="{n} 星" />
          <p class="demo-note">受控值：{{ score }}（showScore + scoreTemplate="{n} 星"）</p>
        </div>
        <div>
          <LhRate v-model="half" :max="5" allow-half />
          <p class="demo-note">allowHalf 允许半星：{{ half }}</p>
        </div>
        <div>
          <LhRate v-model="custom" :max="5" character="◈" />
          <p class="demo-note">character="◈" 自定义字符</p>
        </div>
        <div>
          <LhRate :model-value="3.5" :max="5" readonly />
          <p class="demo-note">readonly 只读（role="img"，屏读星级文本）</p>
        </div>
        <div>
          <LhRate v-model="score" :max="5" disabled />
          <p class="demo-note">disabled 禁用</p>
        </div>
      </div>
    `,
    data: () => ({ score: 3, half: 2.5, custom: 4 }),
  },
  slider: {
    template: `
      <div class="demo-col" style="max-width: 520px; gap: 26px;">
        <div>
          <LhSlider v-model="single" :min="0" :max="100" :step="5" show-input />
          <p class="demo-note">min=0 max=100 step=5 showInput：{{ single }}</p>
        </div>
        <div>
          <LhSlider v-model="ranged" range :min="10" :max="90" :step="10" />
          <p class="demo-note">range 双滑块：{{ JSON.stringify(ranged) }}</p>
        </div>
        <div>
          <LhSlider v-model="marked" :min="0" :max="100" :marks="marks" />
          <p class="demo-note">marks 刻度标记：{{ marked }}</p>
        </div>
        <div>
          <LhSlider v-model="single" size="small" />
          <LhSlider v-model="single" disabled />
          <p class="demo-note">size="small" 与 disabled</p>
        </div>
      </div>
    `,
    data: () => ({
      single: 35,
      ranged: [20, 60],
      marked: 40,
      marks: { 0: '起笔', 50: '行笔', 100: '收笔' },
    }),
  },
  segmented: {
    template: `
      <div class="demo-col" style="gap: 20px;">
        <LhSegmented v-model="view" :options="['列表', '网格', '图册']" />
        <p class="demo-note">字符串数组快捷写法：{{ view }}</p>
        <LhSegmented v-model="dynasty" :options="options" />
        <p class="demo-note">对象写法（含 disabled 项）：{{ dynasty }}</p>
        <LhSegmented v-model="view" :options="['列表', '网格', '图册']" disabled />
        <LhSegmented v-model="view" :options="['列表', '网格', '图册']" block />
        <p class="demo-note">block 撑满容器宽度</p>
      </div>
    `,
    data: () => ({
      view: '列表',
      dynasty: 'tang',
      options: [
        { value: 'tang', label: '唐' },
        { value: 'song', label: '宋' },
        { value: 'yuan', label: '元' },
        { value: 'ming', label: '明', disabled: true },
      ],
    }),
  },
  tag: {
    template: `
      <div class="demo-col">
        <div class="demo-row">
          <LhTag>默认</LhTag>
          <LhTag type="primary">主要</LhTag>
          <LhTag type="success">成功</LhTag>
          <LhTag type="warning">警告</LhTag>
          <LhTag type="danger">危险</LhTag>
          <LhTag type="info">信息</LhTag>
        </div>
        <div class="demo-row">
          <LhTag size="small">小型</LhTag>
          <LhTag size="medium">默认尺寸</LhTag>
          <LhTag size="large">大型</LhTag>
          <LhTag type="primary" round>圆角</LhTag>
          <LhTag type="primary" hit>描边（hit）</LhTag>
        </div>
        <div class="demo-row">
          <LhTag type="primary" closable @close="closed = true">可关闭</LhTag>
          <LhTag v-if="!closed" type="info" round>已关闭后隐藏</LhTag>
          <LhTag type="warning" disabled>禁用</LhTag>
        </div>
      </div>
    `,
    data: () => ({ closed: false }),
  },
  dialog: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhButton type="primary" @click="basic = true">基础对话框</LhButton>
          <LhButton @click="center = true">position="center" 居中</LhButton>
          <LhButton @click="bottom = true">position="bottom" 底部</LhButton>
          <LhButton @click="full = true">fullscreen 全屏</LhButton>
          <LhButton @click="drag = true">draggable 可拖拽</LhButton>
          <LhButton @click="strict = true">禁止遮罩/Esc 关闭</LhButton>
          <LhButton @click="guard = true">beforeClose 拦截</LhButton>
          <LhButton @click="noClose = true">showClose=false</LhButton>
        </div>
        <LhDialog v-model="basic" title="题跋" width="420px" :top="top" :z-index="2000">
          <p style="margin: 0;">对话框挂载到 body，遮罩与内容均为 fixed 定位。top 控制顶部距离，zIndex 控制层级。</p>
          <template #footer>
            <LhButton @click="basic = false">取消</LhButton>
            <LhButton type="primary" @click="basic = false">落款</LhButton>
          </template>
        </LhDialog>
        <LhDialog v-model="center" title="居中弹窗" position="center" width="360px" center>
          <p style="margin: 0;">position="center" 垂直居中；center 使标题与底部按钮居中排列。</p>
          <template #footer>
            <LhButton type="primary" @click="center = false">知道了</LhButton>
          </template>
        </LhDialog>
        <LhDialog v-model="bottom" title="底部弹窗" position="bottom" width="480px">
          <p style="margin: 0;">position="bottom" 贴底展示，适合移动端操作面板。</p>
        </LhDialog>
        <LhDialog v-model="full" title="全屏浏览" fullscreen>
          <p style="margin: 0;">fullscreen 占满整个视口，内容区自适应剩余高度。</p>
          <template #footer>
            <LhButton type="primary" @click="full = false">关闭</LhButton>
          </template>
        </LhDialog>
        <LhDialog v-model="drag" title="按住标题栏拖动" draggable width="420px">
          <p style="margin: 0;">draggable 开启后，按住标题栏即可拖动弹窗。</p>
        </LhDialog>
        <LhDialog
          v-model="strict"
          title="严格模式"
          width="400px"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :lock-scroll="true"
        >
          <p style="margin: 0;">closeOnClickModal / closeOnPressEscape 均关闭，lockScroll 锁定页面滚动，只能点按钮关闭。</p>
          <template #footer>
            <LhButton type="primary" @click="strict = false">仅此出口</LhButton>
          </template>
        </LhDialog>
        <LhDialog v-model="guard" title="关闭前拦截" width="400px" :before-close="beforeClose">
          <p style="margin: 0;">beforeClose 拦截关闭动作，done() 才真正关闭（此处演示二次确认）。</p>
        </LhDialog>
        <LhDialog v-model="noClose" title="无关闭按钮" width="360px" :show-close="false">
          <p style="margin: 0;">showClose=false 隐藏右上角关闭按钮。</p>
          <template #footer>
            <LhButton type="primary" @click="noClose = false">关闭</LhButton>
          </template>
        </LhDialog>
      </div>
    `,
    data: () => ({
      basic: false,
      center: false,
      bottom: false,
      full: false,
      drag: false,
      strict: false,
      guard: false,
      noClose: false,
      top: '15vh',
    }),
    methods: {
      beforeClose(done: () => void) {
        if (window.confirm('确认关闭该对话框？')) done()
      },
    },
  },
  tooltip: {
    template: `
      <div class="demo-row" style="justify-content: center; padding: 56px 0 72px;">
        <LhTooltip content="上方的提示" placement="top">
          <LhButton>上</LhButton>
        </LhTooltip>
        <LhTooltip content="下方的提示" placement="bottom">
          <LhButton>下</LhButton>
        </LhTooltip>
        <LhTooltip content="左侧的提示" placement="left">
          <LhButton>左</LhButton>
        </LhTooltip>
        <LhTooltip content="右侧的提示" placement="right">
          <LhButton>右</LhButton>
        </LhTooltip>
        <LhTooltip content="点击触发" trigger="click">
          <LhButton type="primary">点击</LhButton>
        </LhTooltip>
        <LhTooltip content="严格按 top 定位，不翻转" placement="top" :flip="false">
          <LhButton>严格 top</LhButton>
        </LhTooltip>
        <LhTooltip content="主题色提示" type="primary">
          <LhButton>主题色</LhButton>
        </LhTooltip>
      </div>
    `,
  },
  'config-provider': {
    template: `
      <div class="demo-col" style="gap: 20px;">
        <LhConfigProvider
          :theme-vars="{
            'primary-color': '#4a6741',
            'bg-color': '#f4f7ee',
            'text-primary': '#2c2a26',
            'text-regular': '#5a5a5a',
          }"
          :pattern-components="['button', 'tag']"
        >
          <div style="padding: 16px; background: var(--lh-bg-color); border: 1px dashed var(--lh-primary-color); display: flex; gap: 12px; flex-wrap: wrap;">
            <LhButton type="primary">竹青主题按钮</LhButton>
            <LhTag type="primary">竹青标签</LhTag>
            <LhInput placeholder="竹青输入框" style="width: 180px;" />
          </div>
        </LhConfigProvider>
        <p class="demo-note">themeVars 覆盖全局 --lh-* 变量；patternComponents 白名单内的组件才应用 bg-pattern。</p>
        <LhConfigProvider
          :theme-vars="{ 'primary-color': '#8b5a2b' }"
          :component-theme="{ button: { 'primary-color': '#2f6f5e' }, tag: { 'primary-color': '#2f6f5e' } }"
        >
          <div style="padding: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
            <LhButton type="primary">松绿按钮（componentTheme 单独覆盖）</LhButton>
            <LhTag type="primary">松绿标签</LhTag>
          </div>
        </LhConfigProvider>
        <p class="demo-note">componentTheme 按组件单独覆盖（优先级高于全局 themeVars）。</p>
        <LhConfigProvider size="large" locale="en-US">
          <div style="padding: 16px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
            <LhInput placeholder="size=large" style="width: 180px;" />
            <LhPagination :total="50" :page-size="10" />
          </div>
        </LhConfigProvider>
        <p class="demo-note">size 全局尺寸 + locale 切换语言包（分页器文案变为英文）。</p>
      </div>
    `,
  },
  form: {
    template: `
      <div style="max-width: 640px;">
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
        <p class="demo-note" style="margin-top: 16px;">label-position="top"：</p>
        <LhForm :model="form2" label-position="top">
          <LhFormItem prop="name" label="姓名">
            <LhInput v-model="form2.name" placeholder="标签在上方" />
          </LhFormItem>
        </LhForm>
        <p class="demo-note" style="margin-top: 16px;">inline 行内表单：</p>
        <LhForm :model="form3" inline>
          <LhFormItem prop="name" label="姓名">
            <LhInput v-model="form3.name" placeholder="行内" />
          </LhFormItem>
          <LhFormItem prop="genre" label="题材">
            <LhSelect v-model="form3.genre" :options="genres" placeholder="行内" />
          </LhFormItem>
        </LhForm>
      </div>
    `,
    data: () => ({
      form: { name: '', genre: '' },
      form2: { name: '' },
      form3: { name: '', genre: '' },
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
  calendar: {
    template: `
      <div class="demo-col" style="max-width: none;">
        <div class="demo-row" style="align-items: flex-start; flex-wrap: nowrap;">
          <LhCalendar v-model="single" selection="single" />
          <LhCalendar v-model="span" selection="range" mode="input" placeholder="选择一段时间" />
        </div>
        <p class="demo-note">单选：{{ fmt(single) }}｜时间段：{{ fmtArr(span) }}</p>
        <div class="demo-row" style="align-items: flex-start; flex-wrap: nowrap; margin-top: 16px;">
          <LhCalendar v-model="multi" selection="multiple" :panels="2" :close-on-select="false" />
          <LhCalendar v-model="strict" selection="range" mode="panel" />
        </div>
        <p class="demo-note">多选（panels=2 双联面板，closeOnSelect=false 不自动收起）：{{ fmtArr(multi) }}</p>
        <p class="demo-note">面板模式 range（mode="panel"）：{{ fmtArr(strict) }}</p>
        <div class="demo-row" style="align-items: flex-start; flex-wrap: nowrap; margin-top: 16px;">
          <LhCalendar v-model="clamped" selection="single" :range="bounds" />
        </div>
        <p class="demo-note">range 限制可选区间（仅 2026-10-01 ~ 2026-10-15 可选）：{{ fmt(clamped) }}</p>
      </div>
    `,
    data: () => ({
      single: new Date(2026, 9, 3),
      span: [] as Date[],
      multi: [] as Date[],
      strict: [] as Date[],
      clamped: new Date(2026, 9, 5),
      bounds: [new Date(2026, 9, 1), new Date(2026, 9, 15)] as [Date, Date],
    }),
    methods: {
      fmt(v: unknown) {
        return v instanceof Date ? v.toLocaleDateString('zh-CN') : '（未选择）'
      },
      fmtArr(v: unknown) {
        if (!Array.isArray(v) || v.length === 0) return '（未选择）'
        return v.map((d) => (d as Date).toLocaleDateString('zh-CN')).join(' ~ ')
      },
    },
  },
  cascader: {
    template: `
      <div class="demo-col" style="gap: 16px;">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhCascader v-model="path" :options="options" placeholder="请选择画科" clearable separator=">" />
          <LhCascader v-model="path" :options="options" size="small" disabled />
          <LhCascader v-model="path" :options="options" size="large" readonly />
        </div>
        <p class="demo-note">完整路径（separator=">"）：{{ path.length ? path.join(' &gt; ') : '（未选择）' }}</p>
        <LhCascader
          v-model="leaf"
          :options="options"
          :emit-path="false"
          :show-all-levels="false"
          check-strictly
          placeholder="父子不关联，可选任意层级"
        />
        <p class="demo-note">仅末级值：{{ leaf.length ? leaf.join('，') : '（未选择）' }}</p>
        <LhCascader
          v-model="multi"
          :options="options"
          multiple
          collapse-tags
          filterable
          placeholder="多选 + 折叠标签 + 搜索"
        />
        <p class="demo-note">多选值：{{ multi.length ? multi.map((m) => m.join('/')).join('，') : '（未选择）' }}</p>
        <LhCascader
          v-model="custom"
          :options="customOptions"
          :item-config="{ value: 'id', label: 'name', children: 'sub' }"
          placeholder="自定义字段映射（id/name/sub）"
          clearable
        />
        <p class="demo-note">自定义键：{{ custom.length ? custom.join(' / ') : '（未选择）' }}</p>
        <p class="demo-note">cascading（默认）悬停即展开下级；可级联数据见上方各示例。</p>
      </div>
    `,
    data: () => ({
      path: ['shan', 'pomo', 'dapo'],
      leaf: [] as (string | number)[],
      multi: [] as (string | number)[][],
      custom: [] as (string | number)[],
      options: [
        {
          value: 'shan',
          label: '山水',
          children: [
            {
              value: 'pomo',
              label: '泼墨山水',
              children: [
                { value: 'xiaopo', label: '小泼墨' },
                { value: 'dapo', label: '大泼墨' },
              ],
            },
            { value: 'qianjiang', label: '浅绛山水' },
          ],
        },
        {
          value: 'hua',
          label: '花鸟',
          children: [
            { value: 'gongbi', label: '工笔花鸟' },
            { value: 'xieyi', label: '写意花鸟' },
          ],
        },
      ],
      customOptions: [
        {
          id: 'hua',
          name: '花鸟',
          sub: [
            { id: 'gongbi', name: '工笔花鸟' },
            { id: 'xieyi', name: '写意花鸟' },
          ],
        },
        {
          id: 'shu',
          name: '书法',
          sub: [{ id: 'kaishu', name: '楷书' }],
        },
      ],
    }),
  },
  'date-picker': {
    template: `
      <div class="demo-col" style="gap: 16px;">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhDatePicker v-model="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" clearable />
          <LhDatePicker v-model="month" mode="month" placeholder="选择月份" size="small" />
          <LhDatePicker v-model="year" mode="year" placeholder="选择年份" size="large" />
          <LhDatePicker v-model="datetime" mode="datetime" placeholder="选择日期时间" disabled />
          <LhDatePicker v-model="date" placeholder="只读" readonly />
        </div>
        <LhDatePicker
          v-model="range"
          mode="range"
          range-separator="至"
          placeholder="选择日期段（两次点击）"
          :cell-class-name="cellClass"
          popper-class="demo-popper"
        />
        <p class="demo-note">日期：{{ fmt(date) }}｜月份：{{ fmt(month) }}｜年份：{{ fmt(year) }}｜日期时间：{{ fmt(datetime) }}</p>
        <p class="demo-note">日期段（rangeSeparator="至"，周末标红）：{{ fmtRange(range) }}</p>
      </div>
    `,
    data: () => ({
      date: new Date(2026, 9, 3),
      month: new Date(2026, 9, 1),
      year: new Date(2026, 0, 1),
      datetime: null as Date | null,
      range: null as [Date, Date] | null,
    }),
    methods: {
      fmt(v: unknown) {
        return v instanceof Date ? v.toLocaleString('zh-CN', { hour12: false }) : '（未选择）'
      },
      fmtRange(v: unknown) {
        if (!Array.isArray(v) || v.length !== 2) return '（未选择）'
        const [a, b] = v as [Date, Date]
        const s = (d: Date) =>
          d instanceof Date ? d.toLocaleString('zh-CN', { hour12: false }) : '（未选择）'
        return `${s(a)} ~ ${s(b)}`
      },
      cellClass(date: Date) {
        return date.getDay() === 0 || date.getDay() === 6 ? 'demo-cell-weekend' : ''
      },
    },
  },
  'time-picker': {
    template: `
      <div class="demo-col" style="gap: 16px;">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhTimePicker v-model="t1" format="HH:mm:ss" placeholder="选择时间" clearable />
          <LhTimePicker v-model="t2" format="HH:mm" placeholder="时分（无秒列）" size="small" />
          <LhTimePicker v-model="t3" format="HH:mm:ss" arrow-control placeholder="箭头控制" size="large" />
          <LhTimePicker v-model="t1" format="HH:mm:ss" disabled placeholder="禁用" />
          <LhTimePicker v-model="t1" format="HH:mm:ss" readonly placeholder="只读" />
        </div>
        <LhTimePicker
          v-model="t4"
          format="HH:mm:ss"
          :step-hour="2"
          :step-minute="15"
          :step-second="30"
          placeholder="步进：时 2 / 分 15 / 秒 30"
        />
        <p class="demo-note">时分秒：{{ fmt(t1) }}｜时分：{{ fmt(t2) }}｜箭头：{{ fmt(t3) }}｜步进：{{ fmt(t4) }}</p>
      </div>
    `,
    data: () => ({
      t1: new Date(2026, 9, 3, 14, 30, 0),
      t2: null as Date | null,
      t3: null as Date | null,
      t4: null as Date | null,
    }),
    methods: {
      fmt(v: unknown) {
        if (!(v instanceof Date)) return '（未选择）'
        const p = (n: number) => String(n).padStart(2, '0')
        return p(v.getHours()) + ':' + p(v.getMinutes()) + ':' + p(v.getSeconds())
      },
    },
  },
  table: {
    template: `
      <div style="max-width: 760px;">
        <p class="demo-note">size="small" + maxHeight + 默认排序（defaultSortProp/defaultSortOrder）+ 筛选</p>
        <LhTable
          :data="rows"
          :columns="columns"
          size="small"
          stripe
          border
          :max-height="200"
          row-key="name"
          default-sort-prop="dynasty"
          default-sort-order="asc"
          :default-filtered-values="{ dynasty: ['宋'] }"
        >
          <template #price="{ value }">
            <span style="color: var(--lh-primary-color); font-weight: 600;">{{ value }}</span>
          </template>
        </LhTable>
        <p class="demo-note">「朝代」列默认升序且预筛「宋」；表头筛选按钮可改条件。</p>
        <p class="demo-note" style="margin-top: 16px;">嵌套表头（children）+ resizable 拖宽 + formatter + 自定义 sorter</p>
        <LhTable
          :data="rows2"
          :columns="groupColumns"
          border
          :height="180"
          :row-height="40"
          :sorter="dynastySorter"
        >
          <template #price="{ value }">
            <span style="color: var(--lh-primary-color); font-weight: 600;">{{ value }}</span>
          </template>
        </LhTable>
        <p class="demo-note">「流传」列用 formatter 格式化为「宫藏/民间」；「估价」列可拖宽（resizable）。</p>
      </div>
    `,
    data: () => ({
      rows: [
        { name: '溪山行旅图', dynasty: '宋', price: 1800 },
        { name: '富春山居图', dynasty: '元', price: 2600 },
        { name: '千里江山图', dynasty: '宋', price: 3200 },
        { name: '清明上河图', dynasty: '宋', price: 1500 },
        { name: '韩熙载夜宴图', dynasty: '五代', price: 2100 },
      ],
      rows2: [
        { name: '溪山行旅图', dynasty: '宋', provenance: '宫藏', price: 1800 },
        { name: '富春山居图', dynasty: '元', provenance: '宫藏', price: 2600 },
        { name: '清明上河图', dynasty: '宋', provenance: '宫藏', price: 1500 },
        { name: '照夜白图', dynasty: '唐', provenance: '民间', price: 980 },
      ],
      columns: [
        { prop: 'name', label: '画作', width: 160 },
        {
          prop: 'dynasty',
          label: '朝代',
          width: 120,
          sortable: true,
          filters: [
            { text: '宋', value: '宋' },
            { text: '元', value: '元' },
            { text: '五代', value: '五代' },
          ],
        },
        { prop: 'price', label: '估价（万）', width: 140, align: 'right', slot: 'price' },
      ],
      groupColumns: [
        {
          label: '藏品信息',
          children: [
            { prop: 'name', label: '画作', width: 150 },
            { prop: 'provenance', label: '流传', width: 100, formatter: (r: Record<string, unknown>) => (r.provenance === '宫藏' ? '宫藏' : '民间') },
          ],
        },
        {
          label: '估值',
          children: [
            { prop: 'dynasty', label: '朝代', width: 90, sortable: true },
            { prop: 'price', label: '估价（万）', width: 130, align: 'right', resizable: true, slot: 'price' },
          ],
        },
      ],
    }),
    methods: {
      dynastySorter(a: Record<string, unknown>, b: Record<string, unknown>) {
        const order = ['唐', '五代', '宋', '元']
        return order.indexOf(String(a.dynasty)) - order.indexOf(String(b.dynasty))
      },
    },
  },
  tree: {
    template: `
      <div class="demo-col" style="max-width: 320px;">
        <p class="demo-note">复选 + checkStrictly（父子不关联）+ 默认展开/选中/勾选键</p>
        <LhTree
          :data="data"
          show-checkbox
          check-strictly
          :default-expanded-keys="['song']"
          :default-selected-keys="['xishan']"
          :default-checked-keys="['libai']"
          :expand-on-click-node="false"
          @select="onSelect"
          @check="onCheck"
        />
        <p class="demo-note">点击选中：{{ selected }}；勾选键：{{ checked.join('、') || '（无）' }}</p>
        <p class="demo-note">multiple 多选 + disabled 禁用整棵</p>
        <LhTree
          :data="data"
          multiple
          disabled
          :default-expanded-keys="['tang']"
          @select="onSelectMulti"
        />
        <p class="demo-note">多选结果：{{ multi.join('、') || '（无）' }}</p>
        <p class="demo-note">受控键：expandedKeys / selectedKeys / checkedKeys</p>
        <LhTree
          :data="data"
          show-checkbox
          :expanded-keys="['song']"
          :selected-keys="['guo']"
          :checked-keys="['xishan']"
          @select="onSelect"
        />
        <p class="demo-note">lazy 懒加载（点击展开时调 load 拉子节点）</p>
        <LhTree :data="lazyData" lazy :load="onLoad" :default-expanded-keys="['root']" />
      </div>
    `,
    data: () => ({
      selected: '（无）',
      checked: [] as string[],
      multi: [] as string[],
      data: [
        {
          key: 'tang',
          label: '唐代',
          children: [
            { key: 'wangwei', label: '王维' },
            { key: 'libai', label: '李白' },
          ],
        },
        {
          key: 'song',
          label: '宋代',
          children: [
            {
              key: 'fan',
              label: '范宽',
              children: [{ key: 'xishan', label: '溪山行旅图' }],
            },
            { key: 'guo', label: '郭熙' },
          ],
        },
      ],
      lazyData: [{ key: 'root', label: '画科（点击展开懒加载）' }],
    }),
    methods: {
      onSelect(key: unknown) {
        this.selected = String(key)
      },
      onCheck(keys: unknown) {
        this.checked = Array.isArray(keys) ? (keys as string[]) : []
      },
      onSelectMulti(keys: unknown) {
        this.multi = Array.isArray(keys) ? (keys as string[]) : [String(keys)]
      },
      onLoad(node: { key?: string }, resolve: (children: { key: string; label: string }[]) => void) {
        setTimeout(() => {
          resolve([
            { key: `${String(node.key ?? '')}-a`, label: '山水' },
            { key: `${String(node.key ?? '')}-b`, label: '花鸟' },
          ])
        }, 400)
      },
    },
  },
  'tree-select': {
    template: `
      <div class="demo-col" style="gap: 16px;">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhTreeSelect v-model="single" :data="data" placeholder="单选（点父节点展开，点叶子选中）" />
          <LhTreeSelect v-model="single" :data="data" disabled placeholder="禁用" />
          <LhTreeSelect v-model="multi" :data="data" multiple placeholder="多选（勾选框）" />
        </div>
        <LhTreeSelect v-model="embedded" :data="data" :teleported="false" placeholder="teleported=false 面板内嵌" />
        <p class="demo-note">单选：{{ single || '（未选择）' }}；多选：{{ multi.join('、') || '（未选择）' }}；内嵌：{{ embedded || '（未选择）' }}</p>
      </div>
    `,
    data: () => ({
      single: 'xishan',
      multi: [] as string[],
      embedded: '' as string,
      data: [
        {
          key: 'song',
          label: '宋代',
          children: [
            { key: 'fan', label: '范宽' },
            { key: 'xishan', label: '溪山行旅图' },
          ],
        },
        { key: 'yuan', label: '元代', children: [{ key: 'huang', label: '黄公望' }] },
      ],
    }),
  },
  transfer: {
    template: `
      <div style="max-width: 640px;">
        <LhTransfer v-model="sourceKeys" :data="data" />
        <p class="demo-note">v-model 为左侧（源）键：{{ sourceKeys.join('、') || '（空）' }}</p>
        <LhTransfer v-model="sourceKeys" :data="data" disabled />
        <p class="demo-note">disabled 整组禁用（按钮与勾选框均不可点）</p>
      </div>
    `,
    data: () => ({
      sourceKeys: ['ink', 'paper'],
      data: [
        { key: 'ink', label: '水墨' },
        { key: 'paper', label: '宣纸' },
        { key: 'brush', label: '狼毫' },
        { key: 'seal', label: '印章', disabled: true },
      ],
    }),
  },
  upload: {
    template: `
      <div class="demo-col">
        <LhUpload
          multiple
          :max-count="3"
          :max-size="2097152"
          accept="image/*"
          :request="fakeRequest"
          @change="onChange"
          @success="onSuccess"
          @error="onError"
        >
          <LhButton type="primary">选择文件（最多 3 个，单个 ≤ 2MB）</LhButton>
        </LhUpload>
        <LhUpload drag :request="fakeRequest">
          <div style="padding: 20px 0;">
            <p class="demo-note" style="font-size: 14px;">将文件拖到此处，或点击上传</p>
            <p class="demo-note">支持拖拽（drag 模式）</p>
          </div>
        </LhUpload>
        <LhUpload
          multiple
          :max-count="5"
          accept=".png,.jpg"
          :request="fakeRequest"
          disabled
        >
          <LhButton disabled>禁用态（accept 数组形式 .png/.jpg）</LhButton>
        </LhUpload>
        <p class="demo-note">状态：{{ status }}</p>
      </div>
    `,
    data: () => ({
      status: '（未上传）',
    }),
    methods: {
      fakeRequest(opts: unknown) {
        const { file, onProgress } = opts as {
          file: File
          onProgress: (percent: number) => void
        }
        return new Promise<{ url?: string }>((resolve) => {
          let percent = 0
          const timer = setInterval(() => {
            percent += 25
            if (percent >= 100) {
              clearInterval(timer)
              onProgress(100)
              resolve({ url: `/assets/${file.name}` })
            } else {
              onProgress(percent)
            }
          }, 200)
        })
      },
      onChange(files: unknown) {
        this.status = `列表共 ${(files as { length: number }).length} 个文件`
      },
      onSuccess(file: unknown) {
        this.status = `上传成功：${(file as { name?: string }).name ?? ''}`
      },
      onError(file: unknown, reason: unknown) {
        this.status = `上传失败：${(file as { name?: string }).name ?? ''}（${String(reason)}）`
      },
    },
  },
  divider: {
    template: `
      <div class="demo-col" style="max-width: 420px;">
        <p class="demo-note">水平分割线</p>
        <LhDivider />
        <p class="demo-note">带文案（默认居中）</p>
        <LhDivider>水墨</LhDivider>
        <LhDivider label-position="left">左对齐文案</LhDivider>
        <LhDivider label-position="right">右对齐文案</LhDivider>
        <p class="demo-note">虚线 / 自定义边框</p>
        <LhDivider dashed />
        <LhDivider border-style="dotted">点线</LhDivider>
        <p class="demo-note">垂直分割线</p>
        <div class="demo-row">
          <span>山水</span>
          <LhDivider direction="vertical" />
          <span>花鸟</span>
          <LhDivider direction="vertical" />
          <span>人物</span>
        </div>
      </div>
    `,
  },
  space: {
    template: `
      <div class="demo-col">
        <p class="demo-note">水平方向 + 预设间距</p>
        <LhSpace>
          <LhButton>水墨</LhButton>
          <LhButton>花鸟</LhButton>
          <LhButton>人物</LhButton>
        </LhSpace>
        <p class="demo-note">垂直方向</p>
        <LhSpace direction="vertical">
          <LhButton>水墨</LhButton>
          <LhButton>花鸟</LhButton>
        </LhSpace>
        <p class="demo-note">自定义间距 + 换行</p>
        <LhSpace :size="24" wrap>
          <LhTag v-for="item in items" :key="item">{{ item }}</LhTag>
        </LhSpace>
        <p class="demo-note">对齐方式 alignment=start</p>
        <LhSpace alignment="start">
          <LhButton>短</LhButton>
          <div style="height: 48px; padding: 12px; border: 1px dashed var(--lh-border-color);">高块</div>
        </LhSpace>
      </div>
    `,
    data: () => ({ items: ['水墨', '花鸟', '人物', '工笔', '写意', '没骨'] }),
  },
  card: {
    template: `
      <div class="demo-row" style="align-items: flex-start;">
        <LhCard title="溪山行旅图" style="width: 240px;">
          <p class="demo-note">范宽·北宋。雨点皴写山石，气势雄壮。</p>
          <template #actions>
            <LhButton size="small">赏析</LhButton>
            <LhButton size="small" type="primary">收藏</LhButton>
          </template>
        </LhCard>
        <LhCard title="加载态" loading style="width: 240px;">
          <p class="demo-note">内容区以骨架占位。</p>
        </LhCard>
        <LhCard title="可点击卡片" clickable shadow="hover" style="width: 240px;">
          <p class="demo-note">shadow=hover 悬停浮起，clickable 承担 button 语义。</p>
        </LhCard>
        <LhCard style="width: 240px;">
          <template #header>
            <span style="font-weight: 600;">header 插槽标题</span>
          </template>
          <p class="demo-note">title 与 header 插槽二选一。</p>
        </LhCard>
      </div>
    `,
  },
  grid: {
    template: `
      <div>
        <p class="demo-note">基础栅格（24 列）+ gutter 间距</p>
        <LhRow :gutter="16">
          <LhCol :span="8"><div class="grid-cell">span=8</div></LhCol>
          <LhCol :span="8"><div class="grid-cell">span=8</div></LhCol>
          <LhCol :span="8"><div class="grid-cell">span=8</div></LhCol>
        </LhRow>
        <p class="demo-note">offset / push / pull</p>
        <LhRow :gutter="12">
          <LhCol :span="6" :offset="6"><div class="grid-cell">offset=6</div></LhCol>
          <LhCol :span="6" :push="6"><div class="grid-cell">push=6</div></LhCol>
        </LhRow>
        <p class="demo-note">对齐：justify / align</p>
        <LhRow justify="center" align="middle" style="height: 60px; background: var(--lh-bg-color-page, #f6f1ea); border-radius: 6px;">
          <LhCol :span="6"><div class="grid-cell">居中</div></LhCol>
        </LhRow>
        <p class="demo-note">响应式断点：:sizes=&#123; xs: 24, sm: 12, md: 8 &#125;</p>
        <LhRow :gutter="12">
          <LhCol v-for="i in 6" :key="i" :sizes="{ xs: 24, sm: 12, md: 8 }">
            <div class="grid-cell">响应列 {{ i }}</div>
          </LhCol>
        </LhRow>
      </div>
    `,
  },
  layout: {
    template: `
      <div style="height: 200px; border: 1px solid var(--lh-border-color); border-radius: 6px; overflow: hidden;">
        <LhLayout>
          <LhLayoutHeader style="background: var(--lh-primary-color); color: #fff; padding: 0 16px; line-height: 56px;">
            Header
          </LhLayoutHeader>
          <LhLayout direction="horizontal">
            <LhLayoutAside :width="160" aria-label="侧栏导航" style="background: var(--lh-fill-color, #f0ebe2); padding: 16px;">
              Aside
            </LhLayoutAside>
            <LhLayoutMain style="background: var(--lh-bg-color); padding: 16px;">
              Main
            </LhLayoutMain>
          </LhLayout>
          <LhLayoutFooter style="background: var(--lh-fill-color, #f0ebe2); padding: 0 16px; line-height: 48px;">
            Footer
          </LhLayoutFooter>
        </LhLayout>
      </div>
    `,
  },
  collapse: {
    template: `
      <div class="demo-col" style="max-width: 420px;">
        <p class="demo-note">可同时展开多个</p>
        <LhCollapse v-model="actives">
          <LhCollapseItem name="song" title="宋代">
            <p class="demo-note">范宽《溪山行旅图》、郭熙《早春图》。</p>
          </LhCollapseItem>
          <LhCollapseItem name="yuan" title="元代">
            <p class="demo-note">黄公望《富春山居图》。</p>
          </LhCollapseItem>
          <LhCollapseItem name="ming" title="明代" disabled>
            <p class="demo-note">禁用面板。</p>
          </LhCollapseItem>
        </LhCollapse>
        <p class="demo-note">手风琴模式（同时只展开一个）</p>
        <LhCollapse v-model="active" accordion>
          <LhCollapseItem name="gongbi" title="工笔">
            <p class="demo-note">精细勾勒，层层渲染。</p>
          </LhCollapseItem>
          <LhCollapseItem name="xieyi" title="写意">
            <p class="demo-note">笔墨放纵，不求形似。</p>
          </LhCollapseItem>
        </LhCollapse>
        <p class="demo-note">当前展开：{{ Array.isArray(actives) ? actives.join('、') : actives }}</p>
      </div>
    `,
    data: () => ({ actives: ['song'], active: 'gongbi' }),
  },
  descriptions: {
    template: `
      <div class="demo-col">
        <LhDescriptions title="溪山行旅图 · 著录信息" :column="2" border :items="items" />
        <LhDescriptions title="溪山行旅图 · 无边框" :column="3" :items="itemsPlain" />
      </div>
    `,
    data: () => ({
      items: [
        { label: '作者', value: '范宽' },
        { label: '年代', value: '北宋' },
        { label: '材质', value: '绢本水墨' },
        { label: '收藏', value: '台北故宫博物院', span: 2 },
      ],
      itemsPlain: [
        { label: '作者', value: '范宽' },
        { label: '年代', value: '北宋' },
        { label: '材质', value: '绢本水墨' },
      ],
    }),
  },

  statistic: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 48px; flex-wrap: wrap;">
          <LhStatistic title="馆藏画作" :value="1280" :separator="separator" suffix=" 幅" />
          <LhStatistic title="今日访客" :value="visitors" />
          <LhStatistic title="均价（万）" :value="price" :precision="2" prefix="¥" />
          <LhStatistic title="超大数" value="9007199254740993" />
        </div>
        <p class="demo-note">separator 传空串可关闭千分位分组</p>
        <div class="demo-row" style="gap: 48px; flex-wrap: wrap; margin-top: 16px;">
          <LhStatistic title="无千分位" :value="visitors" separator="" />
          <LhStatistic :value="2026" suffix=" 年" />
        </div>
      </div>
    `,
    data: () => ({
      separator: ',',
      visitors: 38651,
      price: 182.5,
    }),
  },

  timeline: {
    template: `
      <div class="demo-col">
        <p class="demo-note">mode="left"（默认）</p>
        <LhTimeline>
          <LhTimelineItem timestamp="2026-09-01" type="primary">启动「宋画全集」数字化</LhTimelineItem>
          <LhTimelineItem timestamp="2026-09-10" type="success">完成 120 幅高清采集</LhTimelineItem>
          <LhTimelineItem timestamp="2026-09-20" type="warning" hollow>校色复核发现 3 处偏差</LhTimelineItem>
          <LhTimelineItem timestamp="2026-10-01" type="danger">复核完成，重新发布</LhTimelineItem>
        </LhTimeline>
        <p class="demo-note">mode="alternate"（左右交替）</p>
        <LhTimeline mode="alternate">
          <LhTimelineItem timestamp="北宋" type="primary">范宽《溪山行旅图》</LhTimelineItem>
          <LhTimelineItem timestamp="北宋" hollow>郭熙《早春图》</LhTimelineItem>
          <LhTimelineItem timestamp="元代" type="success">黄公望《富春山居图》</LhTimelineItem>
        </LhTimeline>
      </div>
    `,
  },

  empty: {
    template: `
      <div class="demo-col">
        <LhEmpty description="暂无画作记录" />
        <LhEmpty>
          <template #default>
            <LhButton type="primary" @click="reload">重新加载</LhButton>
          </template>
        </LhEmpty>
        <p class="demo-note">未传 description 时取语言包默认文案；下方为自定义图片示例。</p>
        <LhEmpty description="自定义图片地址" image="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='120'%3E%3Crect%20width='160'%20height='120'%20fill='%23e8e2d5'/%3E%3Cpath%20d='M0%2086%20Q40%2060%2080%2086%20T160%2086%20V120%20H0%20Z'%20fill='%23c9c2b2'/%3E%3Ctext%20x='50%'%20y='50'%20font-size='16'%20fill='%232b4c7c'%20text-anchor='middle'%20font-family='serif'%3E%E6%B0%B4%E5%A2%A8%E7%95%99%E7%99%BD%3C/text%3E%3C/svg%3E" />
      </div>
    `,
    methods: {
      reload() {
        alert('演示：触发重新加载')
      },
    },
  },

  skeleton: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 24px; align-items: flex-start; flex-wrap: wrap;">
          <div style="width: 260px;">
            <p class="demo-note">avatar + rows + animated</p>
            <LhSkeleton :loading="loading" :rows="3" avatar animated>
              <div>
                <strong>溪山行旅图</strong>
                <p>范宽·北宋。雨点皴写山石，气势雄壮。</p>
              </div>
            </LhSkeleton>
          </div>
          <div style="width: 260px;">
            <p class="demo-note">SkeletonItem 自由组合形状</p>
            <LhSkeletonItem variant="rect" style="width: 100%; height: 120px;" animated />
            <LhSkeletonItem variant="text" style="margin-top: 12px;" animated />
            <div class="demo-row" style="gap: 12px; margin-top: 12px;">
              <LhSkeletonItem variant="circle" style="width: 40px; height: 40px;" animated />
              <LhSkeletonItem variant="text" style="flex: 1;" animated />
            </div>
          </div>
        </div>
        <p class="demo-note">loading=false 时渲染真实内容</p>
        <LhSkeleton :loading="false" :rows="2">
          <p>这是真实内容：loading 关闭后骨架屏让位给插槽。</p>
        </LhSkeleton>
        <LhButton size="small" style="margin-top: 12px;" @click="toggle">
          {{ loading ? '关闭加载态' : '重新加载' }}
        </LhButton>
      </div>
    `,
    data: () => ({
      loading: true,
    }),
    methods: {
      toggle() {
        this.loading = !this.loading
      },
    },
  },

  spinner: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 48px; flex-wrap: wrap;">
          <div class="demo-col" style="align-items: center; gap: 8px;">
            <LhSpinner size="small" /><span class="demo-note">small</span>
          </div>
          <div class="demo-col" style="align-items: center; gap: 8px;">
            <LhSpinner /><span class="demo-note">default</span>
          </div>
          <div class="demo-col" style="align-items: center; gap: 8px;">
            <LhSpinner size="large" /><span class="demo-note">large</span>
          </div>
          <div class="demo-col" style="align-items: center; gap: 8px;">
            <LhSpinner :size="56" color="var(--lh-primary-color)" />
            <span class="demo-note">自定义 size=56 + color</span>
          </div>
        </div>
      </div>
    `,
  },

  badge: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 40px; flex-wrap: wrap;">
          <LhBadge :value="12" type="primary">
            <LhButton>未读消息</LhButton>
          </LhBadge>
          <LhBadge :value="999" :max="99">
            <LhButton>超出 max 截断</LhButton>
          </LhBadge>
          <LhBadge is-dot>
            <LhButton>红点模式</LhButton>
          </LhBadge>
          <LhBadge :value="0" :show-zero="true">
            <LhButton>showZero</LhButton>
          </LhBadge>
          <LhBadge :value="0">
            <LhButton>零值默认隐藏</LhButton>
          </LhBadge>
          <LhBadge :value="3" type="danger" size="small">
            <LhButton>small 尺寸</LhButton>
          </LhBadge>
        </div>
        <p class="demo-note">offset 微调位置 / hidden 隐藏 / content 自定义文案</p>
        <div class="demo-row" style="gap: 40px; flex-wrap: wrap;">
          <LhBadge content="热" type="danger" :offset="[6, 4]">
            <LhButton>offset 偏移</LhButton>
          </LhBadge>
          <LhBadge :value="5" :hidden="hidden">
            <LhButton>hidden 开关</LhButton>
          </LhBadge>
          <LhButton size="small" @click="hidden = !hidden">{{ hidden ? '显示徽标' : '隐藏徽标' }}</LhButton>
        </div>
      </div>
    `,
    data: () => ({
      hidden: false,
    }),
  },

  avatar: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap;">
          <LhAvatar :src="src" alt="溪山行旅图局部" />
          <LhAvatar :src="src" shape="square" />
          <LhAvatar text="范宽" />
          <LhAvatar icon="lh-icon-user" />
          <LhAvatar text="北宋" shape="square" size="large" />
          <LhAvatar text="郭" size="small" />
          <LhAvatar text="自定义" :size="64" fit="cover" />
        </div>
        <p class="demo-note">图片加载失败时回退到 alt / 图标 / 文字</p>
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap;">
          <LhAvatar src="https://placeholder.lhgb.top/broken.png" alt="加载失败" />
          <LhAvatar src="https://placeholder.lhgb.top/broken.png" icon="lh-icon-user" alt="回退图标" />
        </div>
      </div>
    `,
    data: () => ({
      src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2764%27%20height=%2764%27%3E%3Crect%20width=%2764%27%20height=%2764%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%2046%20Q16%2032%2032%2046%20T64%2046%20V64%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%2726%27%20font-size=%2726%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E5%B1%B1%3C/text%3E%3C/svg%3E',
    }),
  },

  progress: {
    template: `
      <div class="demo-col">
        <p class="demo-note">line 线形</p>
        <LhProgress :percentage="30" />
        <LhProgress :percentage="70" status="success" />
        <LhProgress :percentage="45" status="warning" />
        <LhProgress :percentage="20" status="danger" />
        <LhProgress :percentage="60" :stroke-width="20" :format="fmt" />
        <LhProgress :percentage="100" :show-text="false" />
        <p class="demo-note">circle 环形（width 控制画布尺寸，strokeWidth 控制描边）</p>
        <div class="demo-row" style="gap: 32px; flex-wrap: wrap;">
          <LhProgress type="circle" :percentage="75" />
          <LhProgress type="circle" :percentage="40" :width="120" :stroke-width="14" status="warning" />
          <LhProgress type="circle" :percentage="100" status="success" :format="fmt" />
        </div>
        <p class="demo-note">color 字符串或按百分比返回颜色的函数</p>
        <LhProgress :percentage="percent" :color="colorFn" />
        <LhButton size="small" @click="bump">{{ percent >= 100 ? '重置' : '+10' }}</LhButton>
      </div>
    `,
    data: () => ({
      percent: 30,
    }),
    methods: {
      fmt(p: number) {
        return `${p / 10} 成`
      },
      colorFn(p: number) {
        if (p < 40) return 'var(--lh-danger-color)'
        if (p < 80) return 'var(--lh-warning-color)'
        return 'var(--lh-success-color)'
      },
      bump() {
        this.percent = this.percent >= 100 ? 0 : this.percent + 10
      },
    },
  },

  image: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; align-items: flex-start;">
          <div class="demo-col" style="gap: 8px;">
            <LhImage :src="src" alt="溪山行旅图" fit="cover" preview />
            <span class="demo-note">cover + 可预览</span>
          </div>
          <div class="demo-col" style="gap: 8px;">
            <LhImage :src="src" alt="contain 模式" fit="contain" />
            <span class="demo-note">contain</span>
          </div>
          <div class="demo-col" style="gap: 8px;">
            <LhImage :src="src" alt="懒加载" fit="fill" lazy />
            <span class="demo-note">fill + lazy</span>
          </div>
        </div>
        <p class="demo-note">previewSrcList 多图预览（点击首图依次翻阅）</p>
        <LhImage
          :src="src"
          alt="多图预览入口"
          fit="cover"
          preview
          :preview-src-list="gallery"
        />
      </div>
    `,
    data: () => ({
      src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27240%27%20height=%27160%27%3E%3Crect%20width=%27240%27%20height=%27160%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20115%20Q60%2080%20120%20115%20T240%20115%20V160%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%2767%27%20font-size=%2718%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E6%BA%AA%E5%B1%B1%E8%A1%8C%E6%97%85%E5%9B%BE%3C/text%3E%3C/svg%3E',
      gallery: [
        'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27420%27%3E%3Crect%20width=%27640%27%20height=%27420%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20302%20Q160%20210%20320%20302%20T640%20302%20V420%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%27176%27%20font-size=%2740%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E7%AC%AC%E4%B8%80%E5%B9%85%3C/text%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27420%27%3E%3Crect%20width=%27640%27%20height=%27420%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20302%20Q160%20210%20320%20302%20T640%20302%20V420%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%27176%27%20font-size=%2740%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E7%AC%AC%E4%BA%8C%E5%B9%85%3C/text%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27420%27%3E%3Crect%20width=%27640%27%20height=%27420%27%20fill=%27%23e8e2d5%27/%3E%3Cpath%20d=%27M0%20302%20Q160%20210%20320%20302%20T640%20302%20V420%20H0%20Z%27%20fill=%27%23c9c2b2%27/%3E%3Ctext%20x=%2750%%27%20y=%27176%27%20font-size=%2740%27%20fill=%27%232b4c7c%27%20text-anchor=%27middle%27%20font-family=%27serif%27%3E%E7%AC%AC%E4%B8%89%E5%B9%85%3C/text%3E%3C/svg%3E',
      ],
    }),
  },

  'virtual-list': {
    template: `
      <div class="demo-col">
        <p class="demo-note">定高模式：itemHeight + overscan，千条数据只渲染可见区</p>
        <LhVirtualList :data="items" :height="240" :item-height="36" :overscan="6">
          <template #default="{ item, index }">
            <div class="vl-item" :style="{ background: index % 2 ? 'transparent' : 'var(--lh-fill-color, #f6f1ea)' }">
              {{ index + 1 }}. {{ item }}
            </div>
          </template>
        </LhVirtualList>
        <p class="demo-note">动态高度模式：itemSize 返回每项高度</p>
        <LhVirtualList :data="items" :height="200" :item-size="sizeOf">
          <template #default="{ item, index }">
            <div class="vl-item" :style="{ height: sizeOf(index) + 'px' }">
              {{ index + 1 }}. {{ item }}（高 {{ sizeOf(index) }}px）
            </div>
          </template>
        </LhVirtualList>
      </div>
    `,
    data: () => ({
      items: Array.from({ length: 1000 }, (_, i) => `画作条目 ${i + 1}`),
    }),
    methods: {
      sizeOf(index: number) {
        return 28 + (index % 5) * 14
      },
    },
  },

  alert: {
    template: `
      <div class="demo-col" style="max-width: 520px; gap: 12px;">
        <LhAlert type="info" title="馆藏公告" show-icon>
          《溪山行旅图》数字高清版已上线，欢迎观赏。
        </LhAlert>
        <LhAlert type="success" title="采集完成" show-icon closable>
          120 幅宋画高清采集已完成归档。
        </LhAlert>
        <LhAlert type="warning" title="校色偏差" show-icon plain closable>
          3 处色值偏离基准，建议复核。
        </LhAlert>
        <LhAlert type="danger" :title="titleText" closable :close-label="closeLabel">
          无图标 + 自定义关闭按钮无障碍名称。
        </LhAlert>
        <LhAlert type="info" plain>
          纯文本朴素样式（plain），无标题。
        </LhAlert>
      </div>
    `,
    data: () => ({
      titleText: '审校驳回',
      closeLabel: '关闭此警示',
    }),
  },

  loading: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhButton type="primary" @click="showFull">全屏遮罩（服务式）</LhButton>
          <LhButton @click="showLocal">局部遮罩（服务式）</LhButton>
          <LhButton @click="toggleDirective">v-loading 指令（{{ loading ? '关闭' : '开启' }}）</LhButton>
        </div>
        <div
          ref="panel"
          class="demo-note"
          v-loading="loading"
          style="position: relative; height: 140px; border: 1px dashed var(--lh-border-color, #d9d0c2); border-radius: 8px; margin: 0;"
        >
          <p style="padding: 12px; margin: 0;">指令式遮罩挂在本元素上（position: relative 由内联样式提供）。</p>
        </div>
        <p class="demo-note">LhLoading.show 不传 target 即全屏；传 target 挂指定元素；v-loading 指令走 Vue.use(LhLoading) 注册。</p>
      </div>
    `,
    data: () => ({
      loading: false,
    }),
    methods: {
      showFull() {
        const handle = LhLoading.show({ text: '正在高清渲染…' })
        setTimeout(() => handle.close(), 1500)
      },
      showLocal() {
        const handle = LhLoading.show({ target: this.$refs.panel as HTMLElement, text: '局部加载' })
        setTimeout(() => handle.close(), 1500)
      },
      toggleDirective() {
        this.loading = !this.loading
      },
    },
  },

  message: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhButton @click="show('info')">信息</LhButton>
          <LhButton type="primary" @click="show('success')">成功</LhButton>
          <LhButton type="warning" @click="show('warning')">警告</LhButton>
          <LhButton type="danger" @click="show('danger')">危险</LhButton>
          <LhButton @click="showLoading">加载中</LhButton>
          <LhButton @click="showClose">带关闭按钮</LhButton>
          <LhButton @click="closeAll">全部关闭</LhButton>
        </div>
          <p class="demo-note">LhMessage.success('已保存') 是最常用形态；loading 类型需手动关闭。</p>
      </div>
    `,
    methods: {
      show(type: 'info' | 'success' | 'warning' | 'danger') {
        LhMessage[type]('这是一条 ' + type + ' 提示')
      },
      showLoading() {
        LhMessage.loading('正在保存…')
      },
      showClose() {
        LhMessage({ content: '可手动关闭的提示', showClose: true })
      },
      closeAll() {
        LhMessage.closeAll()
      },
    },
  },

  notification: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhButton @click="show('info')">信息</LhButton>
          <LhButton type="primary" @click="show('success')">成功</LhButton>
          <LhButton type="warning" @click="show('warning')">警告</LhButton>
          <LhButton type="danger" @click="show('danger')">危险</LhButton>
          <LhButton @click="showClickable">可点击卡片</LhButton>
          <LhButton @click="closeAll">全部关闭</LhButton>
        </div>
        <p class="demo-note">LhNotification.success({ title, content })；onClick 传入后卡片可点击。</p>
      </div>
    `,
    methods: {
      show(type: 'info' | 'success' | 'warning' | 'danger') {
        LhNotification[type]({
          title: type + ' 通知',
          content: '《溪山行旅图》数字化流程节点已更新。',
          showClose: true,
        })
      },
      showClickable() {
        LhNotification.info({
          title: '点击我试试',
          content: 'onClick 传入后整张卡片可点击。',
          onClick() {
            LhMessage.success('卡片被点击了')
          },
        })
      },
      closeAll() {
        LhNotification.closeAll()
      },
    },
  },

  drawer: {
    template: `
      <div class="demo-col">
        <div class="demo-row" style="gap: 12px; flex-wrap: wrap;">
          <LhButton type="primary" @click="open('right')">right 右侧</LhButton>
          <LhButton @click="open('left')">left 左侧</LhButton>
          <LhButton @click="open('top')">top 顶部</LhButton>
          <LhButton @click="open('bottom')">bottom 底部</LhButton>
          <LhButton @click="openNoMask">遮罩不关闭</LhButton>
        </div>
        <LhDrawer v-model="visible" :title="title" :direction="direction" :size="size">
          <p style="margin: 0 0 8px;">direction 控制方向，size 控制尺寸（数字 px 或百分比字符串）。</p>
          <p class="demo-note">底部按钮可触发 lockScroll / closeOnEsc 等组合。</p>
          <template #footer>
            <LhButton @click="visible = false">取消</LhButton>
            <LhButton type="primary" @click="visible = false">保存</LhButton>
          </template>
        </LhDrawer>
        <LhDrawer
          v-model="noMask"
          title="点击遮罩不关闭"
          direction="right"
          size="30%"
          :mask-closable="false"
          :show-close="true"
          :lock-scroll="true"
          :close-on-esc="false"
        >
          <p style="margin: 0;">maskClosable=false、closeOnEsc=false，只能点按钮或关闭图标。</p>
          <template #footer>
            <LhButton type="primary" @click="noMask = false">关闭</LhButton>
          </template>
        </LhDrawer>
      </div>
    `,
    data: () => ({
      visible: false,
      noMask: false,
      title: '右侧抽屉',
      direction: 'right' as 'right' | 'left' | 'top' | 'bottom',
      size: '360px',
    }),
    methods: {
      open(dir: 'right' | 'left' | 'top' | 'bottom') {
        this.direction = dir
        this.title = `${dir} 抽屉`
        this.size = dir === 'top' || dir === 'bottom' ? '30%' : '360px'
        this.visible = true
      },
      openNoMask() {
        this.noMask = true
      },
    },
  },

  popover: {
    template: `
      <div class="demo-col" style="padding: 40px 0;">
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center;">
          <LhPopover title="标题" content="click 触发（默认）" placement="top">
            <LhButton>click 顶部</LhButton>
          </LhPopover>
          <LhPopover content="click 触发" placement="right" trigger="click">
            <LhButton>click 右侧</LhButton>
          </LhPopover>
          <LhPopover content="focus 触发" placement="bottom" trigger="focus">
            <LhButton>focus 底部</LhButton>
          </LhPopover>
          <LhPopover content="箭头关闭 + 自定义宽度" placement="left" :arrow="false" :width="240">
            <LhButton>无箭头 左侧</LhButton>
          </LhPopover>
          <LhPopover content="严格按 left 定位" placement="left" :flip="false">
            <LhButton>flip=false</LhButton>
          </LhPopover>
        </div>
        <p class="demo-note">manual 触发配 :visible.sync 手动控制；disabled 禁用弹出；popperClass 自定义类名。</p>
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center;">
          <LhPopover :visible.sync="manual" content="由按钮开关控制" placement="top" trigger="manual">
            <LhButton @click="manual = !manual">manual 开关（{{ manual ? '开' : '关' }}）</LhButton>
          </LhPopover>
          <LhPopover content="禁用状态" disabled>
            <LhButton disabled>disabled</LhButton>
          </LhPopover>
          <LhPopover content="延迟显示/隐藏" placement="top" :show-after="300" :hide-after="500">
            <LhButton>showAfter/hideAfter</LhButton>
          </LhPopover>
        </div>
      </div>
    `,
    data: () => ({
      manual: false,
    }),
  },

  popconfirm: {
    template: `
      <div class="demo-col" style="padding: 40px 0;">
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center;">
          <LhPopconfirm title="确认删除该条著录？" @confirm="onOk">
            <LhButton type="danger">删除</LhButton>
          </LhPopconfirm>
          <LhPopconfirm title="警告语气" type="warning" placement="top" @confirm="onOk">
            <LhButton type="warning">warning</LhButton>
          </LhPopconfirm>
          <LhPopconfirm title="危险语气" type="danger" placement="right" @confirm="onOk">
            <LhButton type="danger">danger 右侧</LhButton>
          </LhPopconfirm>
          <LhPopconfirm title="hover 触发" trigger="hover" placement="bottom" @confirm="onOk">
            <LhButton>hover 底部</LhButton>
          </LhPopconfirm>
        </div>
        <p class="demo-note">自定义按钮文案与类型 / 无图标 / 严格定位</p>
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center;">
          <LhPopconfirm
            title="自定义按钮"
            confirm-text="没问题"
            cancel-text="再想想"
            confirm-button-type="primary"
            placement="left"
            @confirm="onOk"
          >
            <LhButton>自定义按钮</LhButton>
          </LhPopconfirm>
          <LhPopconfirm title="无语气图标" :show-icon="false" placement="top" @confirm="onOk">
            <LhButton>showIcon=false</LhButton>
          </LhPopconfirm>
          <LhPopconfirm title="严格按 top 定位" placement="top" :flip="false" @confirm="onOk">
            <LhButton>flip=false</LhButton>
          </LhPopconfirm>
          <LhPopconfirm title="禁用" disabled>
            <LhButton disabled>disabled</LhButton>
          </LhPopconfirm>
        </div>
      </div>
    `,
    methods: {
      onOk() {
        LhMessage.success('已确认')
      },
    },
  },

  dropdown: {
    template: `
      <div class="demo-col" style="padding: 40px 0;">
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center;">
          <LhDropdown placement="bottom-start" @command="onCommand">
            <LhButton>hover 触发（默认）</LhButton>
            <template #dropdown>
              <LhDropdownItem command="copy">复制题跋</LhDropdownItem>
              <LhDropdownItem command="move">移动至卷轴</LhDropdownItem>
              <LhDropdownItem divided command="delete">删除</LhDropdownItem>
            </template>
          </LhDropdown>
          <LhDropdown trigger="click" placement="bottom" :max-height="180" @command="onCommand">
            <LhButton>click + maxHeight</LhButton>
            <template #dropdown>
              <LhDropdownItem v-for="i in 8" :key="i" :command="'item-' + i">选项 {{ i }}</LhDropdownItem>
            </template>
          </LhDropdown>
          <LhDropdown trigger="contextmenu" placement="bottom-end" @command="onCommand">
            <LhButton>右键触发</LhButton>
            <template #dropdown>
              <LhDropdownItem command="ctx-a">右键菜单 A</LhDropdownItem>
              <LhDropdownItem command="ctx-b" disabled>右键菜单 B（禁用）</LhDropdownItem>
            </template>
          </LhDropdown>
        </div>
        <p class="demo-note">命令：{{ command || '（无）' }}</p>
        <p class="demo-note">hideOnClick=false 时点击菜单项不自动收起；:visible.sync 手动控制；flip=false 严格定位。</p>
        <div class="demo-row" style="gap: 24px; flex-wrap: wrap; justify-content: center;">
          <LhDropdown :hide-on-click="false" placement="top" @command="onCommand">
            <LhButton>hideOnClick=false</LhButton>
            <template #dropdown>
              <LhDropdownItem command="keep-1">点击后不收起</LhDropdownItem>
              <LhDropdownItem command="keep-2">第二项</LhDropdownItem>
            </template>
          </LhDropdown>
          <LhDropdown :visible.sync="manual" placement="top-start" :flip="false" popper-class="my-popper">
            <LhButton @click="manual = !manual">手动开关（{{ manual ? '开' : '关' }}）</LhButton>
            <template #dropdown>
              <LhDropdownItem command="manual-1">手动菜单项</LhDropdownItem>
            </template>
          </LhDropdown>
          <LhDropdown disabled>
            <LhButton disabled>disabled</LhButton>
            <template #dropdown>
              <LhDropdownItem command="never">不会出现</LhDropdownItem>
            </template>
          </LhDropdown>
        </div>
      </div>
    `,
    data: () => ({
      command: '',
      manual: false,
    }),
    methods: {
      onCommand(cmd: string | number) {
        this.command = String(cmd)
      },
    },
  },

  breadcrumb: {
    template: `
      <div class="demo-col" style="max-width: 640px; gap: 20px;">
        <LhBreadcrumb>
          <LhBreadcrumbItem>首页</LhBreadcrumbItem>
          <LhBreadcrumbItem>宋代绘画</LhBreadcrumbItem>
          <LhBreadcrumbItem :to="'#'">范宽</LhBreadcrumbItem>
          <LhBreadcrumbItem>溪山行旅图</LhBreadcrumbItem>
        </LhBreadcrumb>
        <LhBreadcrumb separator="/">
          <LhBreadcrumbItem>首页</LhBreadcrumbItem>
          <LhBreadcrumbItem :to="'#'" replace>山水卷</LhBreadcrumbItem>
          <LhBreadcrumbItem>当前页</LhBreadcrumbItem>
        </LhBreadcrumb>
        <p class="demo-note">maxItems 折叠长链路（首项 + 省略号 + 末尾项）</p>
        <LhBreadcrumb :max-items="3">
          <LhBreadcrumbItem>首页</LhBreadcrumbItem>
          <LhBreadcrumbItem>馆藏</LhBreadcrumbItem>
          <LhBreadcrumbItem>宋代</LhBreadcrumbItem>
          <LhBreadcrumbItem>范宽</LhBreadcrumbItem>
          <LhBreadcrumbItem>溪山行旅图</LhBreadcrumbItem>
        </LhBreadcrumb>
      </div>
    `,
  },

  pagination: {
    template: `
      <div class="demo-col" style="gap: 20px;">
        <LhPagination :total="total" :current.sync="current" :page-size="pageSize" />
        <p class="demo-note">current={{ current }}，pageSize={{ pageSize }}</p>
        <LhPagination
          :total="total"
          show-total
          show-size-changer
          show-jumper
          :page-sizes="[10, 20, 50, 100]"
          :current.sync="current2"
          @change="onChange"
        />
        <p class="demo-note">showTotal + showSizeChanger + showJumper；change 事件：{{ lastChange }}</p>
        <LhPagination :total="total" simple :current.sync="current3" />
        <p class="demo-note">simple 紧凑模式</p>
        <LhPagination :total="total" disabled :current.sync="current4" />
        <p class="demo-note">disabled 禁用</p>
      </div>
    `,
    data: () => ({
      total: 128,
      current: 3,
      pageSize: 10,
      current2: 1,
      current3: 2,
      current4: 1,
      lastChange: '（无）',
    }),
    methods: {
      onChange(page: number, size: number) {
        this.lastChange = `第 ${page} 页，每页 ${size} 条`
      },
    },
  },

  tabs: {
    template: `
      <div class="demo-col" style="max-width: 640px; gap: 20px;">
        <LhTabs v-model="active">
          <LhTabPane name="song" label="宋代">
            <p class="demo-note">范宽《溪山行旅图》、郭熙《早春图》。</p>
          </LhTabPane>
          <LhTabPane name="yuan" label="元代">
            <p class="demo-note">黄公望《富春山居图》。</p>
          </LhTabPane>
          <LhTabPane name="ming" label="明代" disabled>
            <p class="demo-note">禁用页签。</p>
          </LhTabPane>
        </LhTabs>
        <p class="demo-note">v-model={{ active }}</p>
        <LhTabs v-model="active2" type="card" tab-position="bottom" closable addable>
          <LhTabPane v-for="t in panes" :key="t.name" :name="t.name" :label="t.label">
            <p class="demo-note">{{ t.label }} 内容</p>
          </LhTabPane>
        </LhTabs>
        <p class="demo-note">card + 底部页签 + closable + addable</p>
      </div>
    `,
    data: () => ({
      active: 'song',
      active2: 'a',
      panes: [
        { name: 'a', label: '卷轴 A' },
        { name: 'b', label: '卷轴 B' },
        { name: 'c', label: '卷轴 C' },
      ],
    }),
  },

  steps: {
    template: `
      <div class="demo-col" style="max-width: 680px; gap: 28px;">
        <LhSteps :current="current">
          <LhStep title="采集" description="高清扫描入库" />
          <LhStep title="校色" description="色值基准比对" />
          <LhStep title="审校" description="专家复核" />
          <LhStep title="发布" description="上线数字展厅" />
        </LhSteps>
        <div class="demo-row" style="gap: 12px;">
          <LhButton size="small" :disabled="current === 0" @click="current--">上一步</LhButton>
          <LhButton size="small" type="primary" :disabled="current === 3" @click="current++">下一步</LhButton>
        </div>
        <LhSteps :current="2" direction="vertical">
          <LhStep title="采集" description="已完成" />
          <LhStep title="校色" description="已完成" />
          <LhStep title="审校" description="进行中" />
          <LhStep title="发布" description="待处理" />
        </LhSteps>
        <LhSteps :current="1" status="error" :clickable="true" @click="onStepClick">
          <LhStep title="第一步" />
          <LhStep title="出错的一步" icon="lh-icon-user" />
          <LhStep title="第三步" />
        </LhSteps>
        <p class="demo-note">clickable 可点击导航；status="error" 覆盖整体状态；icon 自定义图标。</p>
      </div>
    `,
    data: () => ({
      current: 1,
    }),
    methods: {
      onStepClick(index: number) {
        this.current = index
      },
    },
  },

  menu: {
    template: `
      <div class="demo-col" style="max-width: 640px; gap: 20px;">
        <p class="demo-note">horizontal 水平模式</p>
        <LhMenu v-model="active" mode="horizontal">
          <LhMenuItem index="home">首页</LhMenuItem>
          <LhSubMenu index="song" title="宋代绘画">
            <LhMenuItem index="fan">范宽</LhMenuItem>
            <LhMenuItem index="guo">郭熙</LhMenuItem>
          </LhSubMenu>
          <LhMenuItem index="yuan" disabled>元代（禁用）</LhMenuItem>
        </LhMenu>
        <p class="demo-note">选中：{{ active }}</p>
        <p class="demo-note">vertical 垂直模式 + 手风琴（uniqueOpened）+ 分组</p>
        <LhMenu v-model="active2" mode="vertical" :collapse="collapsed" unique-opened :default-openeds="['g1']" style="width: 220px;">
          <LhSubMenu index="g1" title="山水卷">
            <LhMenuItemGroup title="北宋">
              <LhMenuItem index="fan2">范宽</LhMenuItem>
              <LhMenuItem index="guo2">郭熙</LhMenuItem>
            </LhMenuItemGroup>
            <LhMenuItemGroup title="南宋">
              <LhMenuItem index="li">李唐</LhMenuItem>
            </LhMenuItemGroup>
          </LhSubMenu>
          <LhMenuItem index="yuan2">元代绘画</LhMenuItem>
        </LhMenu>
        <LhButton size="small" @click="collapsed = !collapsed">{{ collapsed ? '展开' : '折叠' }}（collapse）</LhButton>
      </div>
    `,
    data: () => ({
      active: 'home',
      active2: 'fan2',
      collapsed: false,
    }),
  },

  anchor: {
    template: `
      <div class="demo-col" style="max-width: 640px;">
        <div class="demo-row" style="align-items: flex-start; gap: 24px;">
          <div ref="scroller" class="anchor-scroller">
            <div id="anchor-a" class="anchor-sec"><h3>山石</h3><p>雨点皴写山石，气势雄壮。</p></div>
            <div id="anchor-b" class="anchor-sec"><h3>林木</h3><p>夹叶与点叶交错。</p></div>
            <div id="anchor-c" class="anchor-sec"><h3>水口</h3><p>一线瀑布悬于云气。</p></div>
            <div id="anchor-d" class="anchor-sec"><h3>题跋</h3><p>范宽款隐于林间。</p></div>
          </div>
          <LhAnchor :items="items" :target="scrollerEl" :offset="12" direction="vertical" smooth />
        </div>
      </div>
    `,
    data: () => ({
      items: [
        { id: 'anchor-a', title: '山石' },
        { id: 'anchor-b', title: '林木' },
        { id: 'anchor-c', title: '水口' },
        { id: 'anchor-d', title: '题跋' },
      ],
      scrollerEl: undefined as HTMLElement | undefined,
    }),
    mounted() {
      this.scrollerEl = this.$refs.scroller as HTMLElement
    },
  },

  affix: {
    template: `
      <div class="demo-col" style="max-width: 640px;">
        <p class="demo-note">在下方容器内滚动，吸顶条会在距顶 12px 时固定</p>
        <div ref="scroller" class="anchor-scroller">
          <div v-for="i in 12" :key="i" class="anchor-sec"><h3>第 {{ i }} 段</h3><p>上滚下滚观察吸顶条。</p></div>
        </div>
        <LhAffix :target="scrollerEl" :offset-top="12">
          <div class="affix-bar">吸顶条（offsetTop=12）</div>
        </LhAffix>
        <p class="demo-note">Affix 需放在滚动容器外部、容器之后，滚动时自动 fixed。</p>
      </div>
    `,
    data: () => ({
      scrollerEl: undefined as HTMLElement | undefined,
    }),
    mounted() {
      this.scrollerEl = this.$refs.scroller as HTMLElement
    },
  },

  backtop: {
    template: `
      <div class="demo-col" style="max-width: 640px;">
        <p class="demo-note">在容器内向下滚动超过 visibilityHeight（200px），右下角出现回到顶部按钮</p>
        <div ref="scroller" class="anchor-scroller">
          <div v-for="i in 20" :key="i" class="anchor-sec"><h3>第 {{ i }} 段</h3><p>向下滚动后点击右下角按钮。</p></div>
        </div>
        <LhBackTop :target="scrollerEl" :visibility-height="200" :right="24" :bottom="24" smooth />
      </div>
    `,
    data: () => ({
      scrollerEl: undefined as HTMLElement | undefined,
    }),
    mounted() {
      this.scrollerEl = this.$refs.scroller as HTMLElement
    },
  },
}

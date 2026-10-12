# Rate 评分

星级评分。支持 max 星数上限、allowHalf 半星、character 自定义字符、只读与禁用、showScore 分数文本（scoreTemplate 模板）。

<DemoBlock name="rate" title="评分" :height="320">

<!-- gen-demo-code:begin -->
```vue
<template>
  <div class="demo-col" style="gap: 22px">
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
</template>

<script>
export default {
  data: () => ({ score: 3, half: 2.5, custom: 4 }),
}
</script>
```
<!-- gen-demo-code:end -->

</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前评分（model: modelValue/input） | `number` | — |
| max | 星数上限 | `number` | `5` |
| allowHalf | 允许半星 | `boolean` | `false` |
| readonly | 只读（屏读输出星级文本） | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| character | 自定义字符（默认 ★） | `string` | `'★'` |
| showScore | 显示分数文本 | `boolean` | `false` |
| scoreTemplate | 分数模板（`{n}` 占位） | `string` | `'{n}'` |
| sx | sx 快速布局属性 | — | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| input | v-model 事件 | `(val)` |
| change | 评分变化时触发 | `(val)` |

## 无障碍

可交互态为 `role="radiogroup"`，每星 `role="radio"` + `aria-checked`；readonly 态为 `role="img"` + `aria-label` 星级文本；键盘 ←/→ 选星。

# Rate

Star rating. Supports a `max` star ceiling, `allowHalf` half stars, a custom `character`, read-only and disabled states, and a `showScore` text label (via `scoreTemplate`).

<DemoBlock name="rate" title="Rate" :height="320">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Current rating (model: modelValue/input) | `number` | — |
| max | Star ceiling | `number` | `5` |
| allowHalf | Allow half stars | `boolean` | `false` |
| readonly | Read-only (screen readers announce the rating as text) | `boolean` | `false` |
| disabled | Disable interaction | `boolean` | `false` |
| character | Custom character (default ★) | `string` | `'★'` |
| showScore | Show the score text | `boolean` | `false` |
| scoreTemplate | Score template (`{n}` placeholder) | `string` | `'{n}'` |
| sx | sx shorthand layout props | — | — |

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| input | v-model event | `(val)` |
| change | Emitted when the rating changes | `(val)` |

## Accessibility

The interactive state uses `role="radiogroup"`, with each star as `role="radio"` + `aria-checked`; the read-only state uses `role="img"` + `aria-label` with the rating as text. Use ← / → to pick a star.

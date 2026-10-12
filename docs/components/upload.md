# Upload 上传

文件上传。库不内置 HTTP 客户端：由 `request` prop 接管实际传输（`onProgress` 回填进度，Promise resolve 即成功）；支持拖拽、多选、数量 / 大小 / 类型约束与失败重试。

<DemoBlock name="upload" title="上传" :height="370">

<!-- gen-demo-code:begin -->
```vue
<template>
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
      <div style="padding: 20px 0">
        <p class="demo-note" style="font-size: 14px">将文件拖到此处，或点击上传</p>
        <p class="demo-note">支持拖拽（drag 模式）</p>
      </div>
    </LhUpload>
    <LhUpload multiple :max-count="5" accept=".png,.jpg" :request="fakeRequest" disabled>
      <LhButton disabled>禁用态（accept 数组形式 .png/.jpg）</LhButton>
    </LhUpload>
    <p class="demo-note">状态：{{ status }}</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    status: '（未上传）',
  }),
  methods: {
    fakeRequest(opts) {
      const { file, onProgress } = opts
      return new Promise((resolve) => {
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
    onChange(files) {
      this.status = `列表共 ${files.length} 个文件`
    },
    onSuccess(file) {
      var _a
      this.status = `上传成功：${(_a = file.name) !== null && _a !== void 0 ? _a : ''}`
    },
    onError(file, reason) {
      var _a
      this.status = `上传失败：${(_a = file.name) !== null && _a !== void 0 ? _a : ''}（${String(reason)}）`
    },
  },
}
</script>
```
<!-- gen-demo-code:end -->
</DemoBlock>

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| multiple | 多选 | `boolean` | `false` |
| drag | 拖拽上传模式 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| accept | 接受的文件类型（`'.png,.jpg'` 或数组） | `string \| string[]` | — |
| maxSize | 单文件大小上限（字节） | `number` | — |
| maxCount | 文件数量上限（0 为不限） | `number` | `0` |
| request | 上传请求函数（库不内置 HTTP 客户端） | `LhUploadRequest` | — |
| sx | sx 快速布局属性 | — | — |

`LhUploadRequest` 签名：`(options: { file: File; onProgress: (percent: number) => void }) => Promise<{ url?: string }>`——
Promise resolve 触发 `success`，reject（或抛错）触发 `error`。

## Events

`change (files)`、`success (file)`、`error (file, reason)`、`remove (uid)`

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 触发区内容（缺省渲染「点击上传 / 拖到此处」提示） |

## 无障碍

触发区 `role="button"` + `tabindex`（支持回车 / 空格打开文件框），`aria-disabled` 标明禁用；
上传中的文件行带 `role="progressbar"` + `aria-valuenow`，校验失败提示 `role="alert"`。

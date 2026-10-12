# Upload

File upload. The library ships no HTTP client: the `request` prop takes over the actual transfer (`onProgress` feeds progress back, and a resolved Promise means success). Drag-and-drop, multiple selection, count / size / type constraints, and retry on failure are supported.

<DemoBlock name="upload" title="Upload" :height="370">

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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| multiple | Allow multiple files | `boolean` | `false` |
| drag | Drag-and-drop mode | `boolean` | `false` |
| disabled | Disabled | `boolean` | `false` |
| accept | Accepted file types (`'.png,.jpg'` or an array) | `string \| string[]` | — |
| maxSize | Per-file size limit, in bytes | `number` | — |
| maxCount | File count limit (0 means unlimited) | `number` | `0` |
| request | Upload request function (no HTTP client is bundled) | `LhUploadRequest` | — |
| sx | sx shorthand layout props | — | — |

The `LhUploadRequest` signature: `(options: { file: File; onProgress: (percent: number) => void }) => Promise<{ url?: string }>` —
a resolved Promise fires `success`, while a rejection (or a thrown error) fires `error`.

## Events

| Event | Description | Callback args |
| --- | --- | --- |
| change | Emitted when the file list changes | `(files)` |
| success | Emitted when a file uploads successfully | `(file)` |
| error | Emitted when an upload fails | `(file, reason)` |
| remove | Emitted when a file is removed | `(uid)` |

## Slots

| Slot | Description |
| --- | --- |
| default | Trigger area content (falls back to the "click to upload / drop here" prompt) |

## Accessibility

The trigger area has `role="button"` + `tabindex` (Enter / Space opens the file dialog), with `aria-disabled` marking the disabled state;
an uploading file row carries `role="progressbar"` + `aria-valuenow`, and a validation failure is announced via `role="alert"`.

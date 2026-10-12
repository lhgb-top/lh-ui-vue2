import { computed, ref } from 'vue'
import {
  createUploadFile,
  exceedsMaxCount,
  exceedsMaxSize,
  formatFileSize,
  getUploadClassNames,
  getUploadFileClassNames,
  isFileRejected,
  LH_UPLOAD_MAX_SIZE,
  normalizeUploadAccept,
  patchUploadFile,
  removeUploadFile,
} from '@lh-ui/share/core/upload'
import type { LhUploadFile, LhUploadFileStatus } from '@lh-ui/share/core/upload'
import { sxToStyle } from '@lh-ui/share/core/shared/sx'
import { isActivationKey } from '@lh-ui/share/core/shared/keyboard'
import { t } from '../../../locale'
import type { LhUploadProps } from './types'

export interface LhUploadEmits {
  (e: 'change', files: LhUploadFile[]): void
  (e: 'success', file: LhUploadFile): void
  (e: 'error', file: LhUploadFile, reason: string): void
  (e: 'remove', uid: string): void
}

/**
 * Upload 组件 Composable（纯逻辑在 @lh-ui/share/core/upload）
 *
 * Vue2 适配要点：文件队列用 ref 数组整体替换（红线 #4：reactive 根值数组不可追踪）
 */
export function useLhUpload(props: LhUploadProps, emit: LhUploadEmits) {
  const inputRef = ref<HTMLInputElement | null>(null)
  const dragOver = ref(false)
  const files = ref<LhUploadFile[]>([])
  const errorMessage = ref('')

  /** accept 入口归一：字符串（'.png,.jpg'）与数组统一成 string[]，下游只面对一种形态 */
  const acceptList = computed(() => normalizeUploadAccept(props.accept))

  const acceptAttr = computed(() =>
    acceptList.value.length > 0 ? acceptList.value.join(',') : undefined,
  )

  function openFileDialog(): void {
    if (props.disabled) return
    inputRef.value?.click()
  }

  function handleTriggerKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    if (isActivationKey(event)) {
      event.preventDefault()
      openFileDialog()
    }
  }

  function handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) addFiles(Array.from(input.files))
    input.value = ''
  }

  function handleDragOver(): void {
    if (props.disabled) return
    dragOver.value = true
  }

  function handleDragLeave(): void {
    dragOver.value = false
  }

  function handleDrop(event: DragEvent): void {
    dragOver.value = false
    if (props.disabled) return
    const dropped = event.dataTransfer?.files
    if (dropped) addFiles(Array.from(dropped))
  }

  function addFiles(incoming: File[]): void {
    errorMessage.value = ''
    for (const file of incoming) {
      if (exceedsMaxCount(files.value.length, props.maxCount ?? 0)) {
        errorMessage.value = t('upload.exceedCount', '超出数量限制')
        break
      }
      if (exceedsMaxSize(file, props.maxSize ?? LH_UPLOAD_MAX_SIZE)) {
        errorMessage.value = t('upload.exceedSize', '文件超出大小限制')
        continue
      }
      if (isFileRejected(file, acceptList.value)) {
        errorMessage.value = t('upload.rejectType', '文件类型不允许')
        continue
      }
      const record = createUploadFile(file)
      files.value = [...files.value, record]
      emit('change', files.value)
      startUpload(record)
    }
  }

  async function startUpload(record: LhUploadFile): Promise<void> {
    if (!props.request) return
    files.value = patchUploadFile(files.value, record.uid, { status: 'uploading', percent: 0 })
    try {
      const result = await props.request({
        file: record.raw as File,
        onProgress: (percent) => {
          files.value = patchUploadFile(files.value, record.uid, { percent })
        },
      })
      files.value = patchUploadFile(files.value, record.uid, {
        status: 'success',
        percent: 100,
        url: result.url,
      })
      const done = files.value.find((f) => f.uid === record.uid)
      if (done) emit('success', done)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      files.value = patchUploadFile(files.value, record.uid, { status: 'fail', error: reason })
      const failed = files.value.find((f) => f.uid === record.uid)
      if (failed) emit('error', failed, reason)
    }
    emit('change', files.value)
  }

  function remove(uid: string): void {
    files.value = removeUploadFile(files.value, uid)
    emit('remove', uid)
    emit('change', files.value)
  }

  const uploadClasses = computed(() =>
    getUploadClassNames({ dragOver: dragOver.value, disabled: !!props.disabled }),
  )

  const fileClassNames = (status: LhUploadFileStatus) => getUploadFileClassNames(status)

  const uploadStyle = computed(() => sxToStyle(props.sx ?? {}))

  const selectText = computed(() => t('upload.select', '选择文件'))
  const dragText = computed(() => t('upload.drag', '将文件拖到此处，或点击上传'))
  const listLabel = computed(() => t('upload.list', '文件列表'))
  const failText = computed(() => t('upload.fail', '上传失败'))
  const removeText = computed(() => t('upload.remove', '移除'))

  return {
    inputRef,
    dragOver,
    files,
    errorMessage,
    acceptAttr,
    uploadClasses,
    uploadStyle,
    selectText,
    dragText,
    listLabel,
    failText,
    removeText,
    openFileDialog,
    handleTriggerKeydown,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    remove,
    fileClassNames,
    formatFileSize,
  }
}

<script lang="ts">
export default { name: 'LhUpload' }
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { useLhUpload } from './index'
import type { LhUploadRequest } from './types'
import type { LhSxProps } from '@lh-ui/share/core/shared/sx'

const props = defineProps({
  multiple: { type: Boolean, default: false },
  drag: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  accept: { type: [String, Array] as PropType<string | string[]>, default: () => [] },
  maxSize: { type: Number, default: 5 * 1024 * 1024 },
  maxCount: { type: Number, default: 0 },
  request: { type: Function as PropType<LhUploadRequest>, default: undefined },
  sx: { type: [Object, Array, String] as PropType<LhSxProps>, default: undefined },
})

const emit = defineEmits(['change', 'success', 'error', 'remove'])

const {
  inputRef,
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
} = useLhUpload(props, emit)
</script>

<template>
  <div
    :class="uploadClasses"
    :style="uploadStyle"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      ref="inputRef"
      type="file"
      class="lh-upload__input"
      :multiple="multiple || undefined"
      :accept="acceptAttr"
      :disabled="disabled || undefined"
      :aria-label="selectText"
      @change="handleInputChange"
    >

    <div
      class="lh-upload__trigger"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      @click="openFileDialog"
      @keydown="handleTriggerKeydown"
    >
      <slot>
        <span class="lh-upload__hint">
          {{ drag ? dragText : selectText }}
        </span>
      </slot>
    </div>

    <ul
      v-if="files.length > 0"
      class="lh-upload__list"
      :aria-label="listLabel"
    >
      <li
        v-for="file in files"
        :key="file.uid"
        :class="fileClassNames(file.status)"
      >
        <span class="lh-upload__file-name">{{ file.name }}</span>
        <span class="lh-upload__file-size">{{ formatFileSize(file.size) }}</span>

        <span
          v-if="file.status === 'uploading'"
          class="lh-upload__progress"
          role="progressbar"
          :aria-valuenow="file.percent"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span
            class="lh-upload__progress-bar"
            :style="{ width: `${file.percent}%` }"
          />
        </span>
        <span
          v-else-if="file.status === 'fail'"
          class="lh-upload__file-error"
        >
          {{ file.error || failText }}
        </span>
        <span
          v-else-if="file.status === 'success'"
          class="lh-upload__file-success"
          aria-hidden="true"
        >
          ✓
        </span>

        <button
          type="button"
          class="lh-upload__file-remove"
          :aria-label="`${removeText} ${file.name}`"
          @click="remove(file.uid)"
        >
          ✕
        </button>
      </li>
    </ul>

    <p
      v-if="errorMessage"
      class="lh-upload__error"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

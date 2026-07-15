<script setup lang="ts">
import { ref } from 'vue'

import { IMAGE_ACCEPT_ATTRIBUTE } from '../../constants/image'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  fileSelected: [file: File]
}>()

const input = ref<HTMLInputElement | null>(null)

function open(): void {
  input.value?.click()
}

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    emit('fileSelected', file)
  }

  target.value = ''
}

defineExpose({ open })
</script>

<template>
  <input
    ref="input"
    aria-hidden="true"
    class="image-file-input"
    type="file"
    :accept="IMAGE_ACCEPT_ATTRIBUTE"
    :disabled="disabled"
    tabindex="-1"
    @change="handleChange"
  />
</template>

<style scoped>
.image-file-input {
  display: none;
}
</style>

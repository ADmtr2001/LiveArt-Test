<script setup lang="ts">
import { mdiDeleteOutline, mdiSwapHorizontal } from '@mdi/js'
import { ref } from 'vue'

import type { ImageSource } from '../../types/image'
import ImageFileInput from './ImageFileInput.vue'

defineProps<{
  source: ImageSource
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
  remove: []
}>()

const fileInput = ref<InstanceType<typeof ImageFileInput> | null>(null)
</script>

<template>
  <div class="image-source-controls" :aria-busy="loading">
    <ImageFileInput
      ref="fileInput"
      :disabled="loading"
      @file-selected="emit('fileSelected', $event)"
    />

    <div class="image-source-controls__metadata">
      <strong :title="source.name">{{ source.name }}</strong>
      <span>{{ source.width }} × {{ source.height }} px</span>
    </div>

    <div class="image-source-controls__actions">
      <v-btn
        class="image-source-controls__replace"
        aria-label="Replace image"
        :prepend-icon="mdiSwapHorizontal"
        :loading="loading"
        size="small"
        variant="tonal"
        @click="fileInput?.open()"
      >
        <span class="image-source-controls__replace-label">Replace</span>
      </v-btn>
      <v-btn
        :icon="mdiDeleteOutline"
        aria-label="Remove image"
        color="error"
        size="small"
        variant="text"
        @click="emit('remove')"
      />
    </div>

    <v-alert
      v-if="error"
      class="image-source-controls__error"
      density="compact"
      role="alert"
      type="error"
      variant="tonal"
    >
      {{ error }}
    </v-alert>
  </div>
</template>

<style scoped>
.image-source-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--editor-space-3);
  padding: var(--editor-space-3) var(--editor-space-4);
  border-top: 1px solid var(--editor-subtle-border);
  background: rgb(var(--v-theme-surface), 0.96);
}

.image-source-controls__metadata {
  display: grid;
  min-width: 0;
  font-size: 0.78rem;
  line-height: 1.35;
}

.image-source-controls__metadata strong {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-source-controls__metadata span {
  color: rgb(var(--v-theme-on-surface), 0.56);
  font-variant-numeric: tabular-nums;
}

.image-source-controls__actions {
  display: flex;
  align-items: center;
  gap: var(--editor-space-1);
}

.image-source-controls__error {
  grid-column: 1 / -1;
}

@media (max-width: 599px) {
  .image-source-controls {
    padding-inline: var(--editor-space-3);
  }

  .image-source-controls__replace :deep(.v-btn__prepend) {
    margin: 0;
  }

  .image-source-controls__replace-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
}
</style>

<script setup lang="ts">
import ImageDropzone from '../upload/ImageDropzone.vue'
import ImageSourceControls from '../upload/ImageSourceControls.vue'
import type { ImageSource } from '../../types/image'

defineProps<{
  source: ImageSource | null
  isLoading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
  removeSource: []
}>()
</script>

<template>
  <main class="editor-viewport" aria-label="Image workspace">
    <div class="editor-viewport__stage">
      <div v-if="source" class="editor-viewport__source">
        <div class="editor-viewport__canvas">
          <img
            class="editor-viewport__image"
            :src="source.objectUrl"
            :alt="source.name"
          />
        </div>
        <ImageSourceControls
          :error="error"
          :loading="isLoading"
          :source="source"
          @file-selected="emit('fileSelected', $event)"
          @remove="emit('removeSource')"
        />
      </div>
      <ImageDropzone
        v-else
        :error="error"
        :loading="isLoading"
        @file-selected="emit('fileSelected', $event)"
      />
    </div>
  </main>
</template>

<style scoped>
.editor-viewport {
  min-width: 0;
  min-height: 0;
  padding: var(--editor-page-gutter);
  overflow: hidden;
  background-color: var(--editor-workspace-background);
  background-image:
    linear-gradient(45deg, rgb(255 255 255 / 0.025) 25%, transparent 25%),
    linear-gradient(-45deg, rgb(255 255 255 / 0.025) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgb(255 255 255 / 0.025) 75%),
    linear-gradient(-45deg, transparent 75%, rgb(255 255 255 / 0.025) 75%);
  background-position:
    0 0,
    0 12px,
    12px -12px,
    -12px 0;
  background-size: 24px 24px;
}

.editor-viewport__stage {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  place-items: center;
  border: 1px solid var(--editor-subtle-border);
  border-radius: var(--editor-radius-lg);
  background: var(--editor-stage-background);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.025);
}

.editor-viewport__image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.editor-viewport__source {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
}

.editor-viewport__canvas {
  display: grid;
  min-height: 0;
  place-items: center;
  padding: var(--editor-space-4);
  overflow: hidden;
}

@media (max-width: 599px) {
  .editor-viewport__stage {
    border-radius: var(--editor-radius-md);
  }
}
</style>

<script setup lang="ts">
import { ref, toRef } from 'vue'

import ImageDropzone from '../upload/ImageDropzone.vue'
import ImageSourceControls from '../upload/ImageSourceControls.vue'
import { useImageRenderer } from '../../composables/useImageRenderer'
import type { ImageSource } from '../../types/image'
import type { EditDocument } from '../../types/operations'

const props = defineProps<{
  source: ImageSource | null
  editDocument: EditDocument
  isLoading: boolean
  error: string | null
  showOriginal: boolean
  hasEdits: boolean
  isComparing: boolean
  sourceActionsDisabled: boolean
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
  removeSource: []
  compare: [active: boolean]
  reset: []
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)
const { isRendering, renderError } = useImageRenderer({
  canvas,
  container: canvasContainer,
  source: toRef(props, 'source'),
  document: toRef(props, 'editDocument'),
  showOriginal: toRef(props, 'showOriginal'),
})
</script>

<template>
  <section class="editor-viewport" aria-label="Image workspace">
    <div class="editor-viewport__stage">
      <div v-if="source" class="editor-viewport__source">
        <div ref="canvasContainer" class="editor-viewport__canvas">
          <canvas
            ref="canvas"
            class="editor-viewport__image"
            role="img"
            :aria-label="`Preview of ${source.name}`"
          />
          <v-progress-circular
            v-if="isRendering"
            aria-label="Rendering preview"
            class="editor-viewport__rendering"
            color="primary"
            indeterminate
            role="status"
            size="28"
            width="2"
          />
          <v-alert
            v-if="renderError"
            class="editor-viewport__render-error"
            density="compact"
            role="alert"
            type="error"
            variant="tonal"
          >
            {{ renderError }}
          </v-alert>
        </div>
        <ImageSourceControls
          :error="error"
          :has-edits="hasEdits"
          :is-comparing="isComparing"
          :loading="isLoading"
          :source-actions-disabled="sourceActionsDisabled"
          :source="source"
          @file-selected="emit('fileSelected', $event)"
          @compare="emit('compare', $event)"
          @remove="emit('removeSource')"
          @reset="emit('reset')"
        />
      </div>
      <ImageDropzone
        v-else
        :error="error"
        :loading="isLoading"
        @file-selected="emit('fileSelected', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.editor-viewport {
  min-width: 0;
  min-height: 0;
  padding: 0;
  overflow: hidden;
  border-radius: var(--editor-radius-lg);
  background-color: transparent;
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
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.025),
    var(--editor-island-shadow);
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
  position: relative;
  display: grid;
  min-height: 0;
  place-items: center;
  padding: var(--editor-space-4);
  overflow: hidden;
}

.editor-viewport__rendering {
  position: absolute;
  top: var(--editor-space-4);
  right: var(--editor-space-4);
}

.editor-viewport__render-error {
  position: absolute;
  right: var(--editor-space-4);
  bottom: var(--editor-space-4);
  left: var(--editor-space-4);
}

@media (max-width: 599px) {
  .editor-viewport__stage {
    border-radius: var(--editor-radius-md);
  }
}
</style>

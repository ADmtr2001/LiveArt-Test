<script setup lang="ts">
import {
  mdiBackupRestore,
  mdiCheckCircleOutline,
  mdiCompare,
  mdiDeleteOutline,
  mdiSwapHorizontal,
} from '@mdi/js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { ImageSource } from '../../types/image'
import ImageFileInput from './ImageFileInput.vue'

const props = defineProps<{
  source: ImageSource
  loading: boolean
  error: string | null
  hasEdits: boolean
  isComparing: boolean
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
  remove: []
  compare: [active: boolean]
  reset: []
}>()

const fileInput = ref<InstanceType<typeof ImageFileInput> | null>(null)
const showResetConfirmation = ref(false)
let compareInteractionActive = false

function startCompare(): void {
  if (!props.hasEdits || compareInteractionActive) return
  compareInteractionActive = true
  emit('compare', true)
}

function stopCompare(): void {
  if (!compareInteractionActive && !props.isComparing) return
  compareInteractionActive = false
  emit('compare', false)
}

function handlePointerDown(event: PointerEvent): void {
  if (event.button === 0) startCompare()
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    startCompare()
  }
}

function handleKeyUp(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    stopCompare()
  }
}

function requestReset(): void {
  if (props.hasEdits) showResetConfirmation.value = true
}

function confirmReset(): void {
  showResetConfirmation.value = false
  emit('reset')
}

watch(
  () => props.hasEdits,
  (hasEdits) => {
    if (!hasEdits) stopCompare()
  },
)

onMounted(() => {
  window.addEventListener('pointerup', stopCompare)
  window.addEventListener('pointercancel', stopCompare)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('blur', stopCompare)
})

onBeforeUnmount(() => {
  stopCompare()
  window.removeEventListener('pointerup', stopCompare)
  window.removeEventListener('pointercancel', stopCompare)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('blur', stopCompare)
})
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

    <div class="image-source-controls__edit-actions">
      <v-chip
        class="image-source-controls__status"
        :color="isComparing ? 'secondary' : hasEdits ? 'primary' : undefined"
        size="small"
        variant="tonal"
      >
        <span class="image-source-controls__status-dot" aria-hidden="true" />
        {{ isComparing ? 'Original' : hasEdits ? 'Edited' : 'Unedited' }}
      </v-chip>
      <v-btn
        :active="isComparing"
        :color="isComparing ? 'secondary' : undefined"
        :disabled="!hasEdits"
        :prepend-icon="mdiCompare"
        :aria-pressed="isComparing"
        aria-label="View original"
        size="small"
        title="Hold to view original"
        variant="tonal"
        @blur="stopCompare"
        @keydown="handleKeyDown"
        @pointercancel="stopCompare"
        @pointerdown="handlePointerDown"
        @pointerleave="stopCompare"
        @pointerup="stopCompare"
      >
        <span class="image-source-controls__action-label">Hold original</span>
      </v-btn>
      <v-btn
        :disabled="!hasEdits"
        :prepend-icon="mdiBackupRestore"
        aria-label="Reset all edits"
        size="small"
        title="Reset all edits"
        variant="text"
        @click="requestReset"
      >
        <span class="image-source-controls__action-label">Reset</span>
      </v-btn>
    </div>

    <div class="image-source-controls__actions">
      <v-btn
        class="image-source-controls__replace"
        aria-label="Replace image"
        :prepend-icon="mdiSwapHorizontal"
        :loading="loading"
        size="small"
        variant="outlined"
        @click="fileInput?.open()"
      >
        <span class="image-source-controls__replace-label">Replace</span>
      </v-btn>
      <v-btn
        :icon="mdiDeleteOutline"
        aria-label="Remove image"
        color="error"
        size="small"
        title="Remove image"
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

    <v-dialog v-model="showResetConfirmation" max-width="440" scrim="#05070c">
      <v-card class="reset-dialog" rounded="xl">
        <div class="reset-dialog__header">
          <v-avatar color="primary" size="44" variant="tonal">
            <v-icon :icon="mdiBackupRestore" size="24" />
          </v-avatar>
          <div>
            <v-card-title class="reset-dialog__title">Reset all edits?</v-card-title>
            <p class="reset-dialog__subtitle">Return this image to a clean slate.</p>
          </div>
        </div>

        <v-card-text class="reset-dialog__content">
          <p>Your current crop, adjustments and filter settings will be cleared.</p>

          <div class="reset-dialog__operations" aria-label="Edits that will be reset">
            <v-chip size="small" variant="tonal">Crop</v-chip>
            <v-chip size="small" variant="tonal">Adjustments</v-chip>
            <v-chip size="small" variant="tonal">Filters</v-chip>
          </div>

          <div class="reset-dialog__source-note">
            <v-icon color="success" :icon="mdiCheckCircleOutline" size="18" />
            <span>Your original source image will remain unchanged.</span>
          </div>
        </v-card-text>

        <v-card-actions class="reset-dialog__actions">
          <v-btn variant="text" @click="showResetConfirmation = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmReset">
            Reset edits
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.image-source-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--editor-space-3);
  padding: var(--editor-space-3) var(--editor-space-4);
  border-top: 1px solid var(--editor-subtle-border);
  background: var(--editor-overlay-background);
  backdrop-filter: var(--editor-surface-filter);
}

.image-source-controls__metadata {
  display: grid;
  min-width: 0;
  font-size: 0.78rem;
  line-height: 1.35;
}

.image-source-controls__metadata strong {
  min-width: 0;
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
  padding-left: var(--editor-space-3);
  border-left: 1px solid var(--editor-subtle-border);
}

.image-source-controls__edit-actions {
  display: flex;
  align-items: center;
  gap: var(--editor-space-1);
}

.image-source-controls__status {
  min-width: 86px;
  font-variant-numeric: tabular-nums;
}

.image-source-controls__status :deep(.v-chip__content) {
  width: 100%;
  justify-content: center;
}

.image-source-controls__status-dot {
  width: 6px;
  height: 6px;
  margin-right: var(--editor-space-2);
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px currentColor;
  opacity: 0.55;
}

.image-source-controls__error {
  grid-column: 1 / -1;
}

.reset-dialog {
  padding: var(--editor-space-2);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(27 30 37 / 0.9);
  box-shadow: 0 24px 80px rgb(0 0 0 / 0.48);
  backdrop-filter: var(--editor-surface-filter);
}

.reset-dialog__header {
  display: flex;
  align-items: center;
  gap: var(--editor-space-3);
  padding: var(--editor-space-4) var(--editor-space-4) var(--editor-space-3);
}

.reset-dialog__title {
  padding: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.reset-dialog__subtitle,
.reset-dialog__content p {
  margin: 0;
}

.reset-dialog__subtitle {
  margin-top: var(--editor-space-1);
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.reset-dialog__content {
  display: grid;
  gap: var(--editor-space-4);
  padding: var(--editor-space-3) var(--editor-space-4);
  color: rgb(var(--v-theme-on-surface), 0.78);
  font-size: 0.9rem;
  line-height: 1.55;
}

.reset-dialog__operations {
  display: flex;
  flex-wrap: wrap;
  gap: var(--editor-space-2);
}

.reset-dialog__source-note {
  display: flex;
  align-items: center;
  gap: var(--editor-space-2);
  padding: var(--editor-space-3);
  border: 1px solid rgb(var(--v-theme-success), 0.18);
  border-radius: var(--editor-radius-md);
  background: rgb(var(--v-theme-success), 0.07);
  color: rgb(var(--v-theme-on-surface), 0.72);
  font-size: 0.8rem;
}

.reset-dialog__actions {
  justify-content: flex-end;
  gap: var(--editor-space-2);
  padding: var(--editor-space-3) var(--editor-space-4) var(--editor-space-4);
}

@media (max-width: 599px) {
  .image-source-controls {
    padding-inline: var(--editor-space-3);
  }

  .image-source-controls__replace :deep(.v-btn__prepend) {
    margin: 0;
  }

  .image-source-controls__actions {
    padding-left: var(--editor-space-1);
  }

  .image-source-controls__status {
    min-width: 76px;
  }

  .image-source-controls__status-dot {
    margin-right: var(--editor-space-1);
  }

  .image-source-controls__edit-actions :deep(.v-btn__prepend) {
    margin: 0;
  }

  .image-source-controls__action-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .image-source-controls__replace-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .reset-dialog {
    padding: var(--editor-space-1);
  }

  .reset-dialog__header,
  .reset-dialog__content,
  .reset-dialog__actions {
    padding-inline: var(--editor-space-3);
  }

  .reset-dialog__actions .v-btn {
    flex: 1;
  }
}
</style>

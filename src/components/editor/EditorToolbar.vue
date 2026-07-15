<script setup lang="ts">
import {
  mdiBackupRestore,
  mdiCompare,
  mdiDownloadOutline,
  mdiImageEditOutline,
} from '@mdi/js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { EDITOR_LAYOUT } from '../../constants/editor'

const props = withDefaults(
  defineProps<{
    canCompare?: boolean
    canExport?: boolean
    hasEdits?: boolean
    hasImage?: boolean
    isComparing?: boolean
  }>(),
  {
    canCompare: false,
    canExport: false,
    hasEdits: false,
    hasImage: false,
    isComparing: false,
  },
)

const emit = defineEmits<{
  compare: [active: boolean]
  reset: []
}>()

const showResetConfirmation = ref(false)
let compareInteractionActive = false

function startCompare(): void {
  if (!props.canCompare || compareInteractionActive) {
    return
  }

  compareInteractionActive = true
  emit('compare', true)
}

function stopCompare(): void {
  if (!compareInteractionActive && !props.isComparing) {
    return
  }

  compareInteractionActive = false
  emit('compare', false)
}

function handlePointerDown(event: PointerEvent): void {
  if (event.button === 0) {
    startCompare()
  }
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
  if (props.hasEdits) {
    showResetConfirmation.value = true
  }
}

function confirmReset(): void {
  showResetConfirmation.value = false
  emit('reset')
}

watch(
  () => props.canCompare,
  (canCompare) => {
    if (!canCompare) {
      stopCompare()
    }
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
  <v-app-bar
    class="editor-toolbar"
    color="surface"
    elevation="0"
    :height="EDITOR_LAYOUT.toolbarHeight"
  >
    <div class="editor-toolbar__brand" aria-label="LiveArt image editor">
      <v-avatar color="primary" rounded="lg" size="36">
        <v-icon :icon="mdiImageEditOutline" size="22" />
      </v-avatar>

      <div class="editor-toolbar__brand-copy">
        <span class="editor-toolbar__title">LiveArt</span>
        <span class="editor-toolbar__subtitle">Image editor</span>
      </div>
    </div>

    <v-spacer />

    <nav class="editor-toolbar__actions" aria-label="Editor actions">
      <v-chip
        v-if="hasImage"
        class="editor-toolbar__status"
        :color="isComparing ? 'secondary' : hasEdits ? 'primary' : undefined"
        size="small"
        variant="tonal"
      >
        {{ isComparing ? 'Original' : hasEdits ? 'Edited' : 'Unedited' }}
      </v-chip>

      <v-btn
        :disabled="!canCompare"
        :icon="mdiCompare"
        :aria-pressed="isComparing"
        aria-label="View original"
        variant="text"
        title="Hold to view original"
        @blur="stopCompare"
        @keydown="handleKeyDown"
        @pointercancel="stopCompare"
        @pointerdown="handlePointerDown"
        @pointerleave="stopCompare"
        @pointerup="stopCompare"
      />

      <v-btn
        :disabled="!hasEdits"
        :icon="mdiBackupRestore"
        aria-label="Reset all edits"
        title="Reset all edits"
        variant="text"
        @click="requestReset"
      />

      <v-divider class="editor-toolbar__divider" vertical />

      <v-btn
        class="editor-toolbar__export"
        color="primary"
        :disabled="!canExport"
        :prepend-icon="mdiDownloadOutline"
        aria-label="Export image"
        variant="flat"
      >
        <span class="editor-toolbar__export-label">Export</span>
      </v-btn>
    </nav>

    <v-dialog v-model="showResetConfirmation" max-width="420">
      <v-card>
        <v-card-title>Reset all edits?</v-card-title>
        <v-card-text>
          Crop and adjustments will return to their original values. Your source image
          will not be changed.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showResetConfirmation = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmReset">Reset all</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<style scoped>
.editor-toolbar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.editor-toolbar :deep(.v-toolbar__content) {
  padding-inline: var(--editor-page-gutter);
}

.editor-toolbar__brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--editor-space-3);
}

.editor-toolbar__brand-copy {
  display: grid;
  line-height: 1.1;
}

.editor-toolbar__title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.editor-toolbar__subtitle {
  margin-top: 0.2rem;
  color: rgb(var(--v-theme-on-surface), 0.62);
  font-size: 0.72rem;
  font-weight: 500;
}

.editor-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.editor-toolbar__status {
  margin-right: var(--editor-space-2);
}

.editor-toolbar__divider {
  height: 28px;
  margin-inline: var(--editor-space-2);
}

.editor-toolbar__export {
  min-width: 112px;
}

@media (max-width: 599px) {
  .editor-toolbar__subtitle,
  .editor-toolbar__divider,
  .editor-toolbar__export-label {
    display: none;
  }

  .editor-toolbar__export {
    min-width: 40px;
    width: 40px;
    padding: 0;
  }

  .editor-toolbar__export :deep(.v-btn__prepend) {
    margin: 0;
  }

  .editor-toolbar__brand-copy {
    display: none;
  }

  .editor-toolbar__status {
    margin-right: 0;
  }
}
</style>

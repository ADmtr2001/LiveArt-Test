<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, type CSSProperties } from 'vue'

import EditorToolbar from './components/editor/EditorToolbar.vue'
import EditorWorkspace from './components/editor/EditorWorkspace.vue'
import { EDITOR_LAYOUT } from './constants/editor'
import { useEditorStore } from './stores/editor'

const editorStore = useEditorStore()
const { exportError, hasEdits, hasImage, isComparingOriginal, isCropping, isExporting } =
  storeToRefs(editorStore)
const canCompare = computed(() => hasImage.value && hasEdits.value && !isCropping.value)
const canExport = computed(
  () => hasImage.value && !isCropping.value && !isExporting.value,
)

onUnmounted(editorStore.clearSource)

const editorLayoutStyle = {
  '--editor-toolbar-height': `${EDITOR_LAYOUT.toolbarHeight}px`,
  '--editor-sidebar-width': `${EDITOR_LAYOUT.sidebarWidth}px`,
} as CSSProperties
</script>

<template>
  <v-app :style="editorLayoutStyle">
    <EditorToolbar
      :can-compare="canCompare"
      :can-export="canExport"
      :has-edits="hasEdits"
      :has-image="hasImage"
      :is-comparing="isComparingOriginal"
      :is-exporting="isExporting"
      @compare="editorStore.setComparingOriginal"
      @export="editorStore.exportImage"
      @reset="editorStore.resetEdits"
    />

    <v-main>
      <EditorWorkspace />
    </v-main>

    <v-snackbar :model-value="Boolean(exportError)" :timeout="-1">
      {{ exportError }}
      <template #actions>
        <v-btn variant="text" @click="editorStore.clearExportError">Dismiss</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

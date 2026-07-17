<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, type CSSProperties } from 'vue'

import EditorToolbar from './components/editor/EditorToolbar.vue'
import EditorWorkspace from './components/editor/EditorWorkspace.vue'
import { EDITOR_LAYOUT } from './constants/editor'
import { useEditorStore } from './stores/editor'

const editorStore = useEditorStore()
const {
  exportError,
  hasImage,
  isCropping,
  isExporting,
  isFileOperationRunning,
  isImportingRecipe,
  recipeError,
} = storeToRefs(editorStore)
const canExport = computed(
  () => hasImage.value && !isCropping.value && !isFileOperationRunning.value,
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
      :can-export="canExport"
      :has-image="hasImage"
      :is-exporting="isExporting"
      :is-importing-recipe="isImportingRecipe"
      @export="editorStore.exportImage"
      @export-recipe="editorStore.exportRecipe"
      @import-recipe="editorStore.loadRecipe"
    />

    <v-main>
      <EditorWorkspace />
    </v-main>

    <v-snackbar
      aria-live="assertive"
      :model-value="Boolean(exportError)"
      role="alert"
      :timeout="-1"
    >
      {{ exportError }}
      <template #actions>
        <v-btn
          aria-label="Dismiss export error"
          variant="text"
          @click="editorStore.clearExportError"
        >
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      aria-live="assertive"
      :model-value="Boolean(recipeError)"
      role="alert"
      :timeout="-1"
    >
      {{ recipeError }}
      <template #actions>
        <v-btn
          aria-label="Dismiss recipe error"
          variant="text"
          @click="editorStore.clearRecipeError"
        >
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

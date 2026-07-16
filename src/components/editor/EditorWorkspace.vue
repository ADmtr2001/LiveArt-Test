<script setup lang="ts">
import { storeToRefs } from 'pinia'

import EditorSidebar from './EditorSidebar.vue'
import EditorViewport from './EditorViewport.vue'
import CropWorkspace from './CropWorkspace.vue'
import { useEditorStore } from '../../stores/editor'

const editorStore = useEditorStore()
const {
  editDocument,
  hasEdits,
  hasImage,
  isComparingOriginal,
  isCropping,
  source,
  isLoadingSource,
  sourceError,
} = storeToRefs(editorStore)
</script>

<template>
  <div class="editor-workspace">
    <CropWorkspace
      v-if="isCropping && source"
      :committed-crop="editDocument.crop"
      :source="source"
      @apply="editorStore.applyCrop"
      @cancel="editorStore.cancelCropMode"
    />
    <EditorViewport
      v-else
      :error="sourceError"
      :edit-document="editDocument"
      :is-loading="isLoadingSource"
      :has-edits="hasEdits"
      :is-comparing="isComparingOriginal"
      :show-original="isComparingOriginal"
      :source="source"
      @file-selected="editorStore.loadSource"
      @compare="editorStore.setComparingOriginal"
      @remove-source="editorStore.clearSource"
      @reset="editorStore.resetEdits"
    />
    <EditorSidebar
      :adjustments="editDocument.adjustments"
      :filter="editDocument.filter"
      :has-crop="editDocument.crop !== null"
      :has-image="hasImage"
      :is-cropping="isCropping"
      @edit-crop="editorStore.enterCropMode"
      @reset-adjustment="editorStore.resetAdjustment"
      @reset-crop="editorStore.resetCrop"
      @set-filter="editorStore.setFilter"
      @update-adjustment="editorStore.updateAdjustment"
    />
  </div>
</template>

<style scoped>
.editor-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--editor-sidebar-width);
  gap: var(--editor-shell-gap);
  width: 100%;
  height: calc(100dvh - var(--editor-toolbar-height));
  min-height: 0;
  overflow: hidden;
  padding: 0 var(--editor-shell-gap) var(--editor-shell-gap);
  background: transparent;
}

@media (max-width: 959px) {
  .editor-workspace {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) minmax(240px, 38dvh);
  }
}

@media (max-width: 599px) {
  .editor-workspace {
    grid-template-rows: minmax(0, 1fr) minmax(230px, 38dvh);
  }
}
</style>

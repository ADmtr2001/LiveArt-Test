<script setup lang="ts">
import { storeToRefs } from 'pinia'

import EditorSidebar from './EditorSidebar.vue'
import EditorViewport from './EditorViewport.vue'
import { useEditorStore } from '../../stores/editor'

const editorStore = useEditorStore()
const { source, isLoadingSource, sourceError } = storeToRefs(editorStore)
</script>

<template>
  <div class="editor-workspace">
    <EditorViewport
      :error="sourceError"
      :is-loading="isLoadingSource"
      :source="source"
      @file-selected="editorStore.loadSource"
    />
    <EditorSidebar />
  </div>
</template>

<style scoped>
.editor-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--editor-sidebar-width);
  min-height: calc(100dvh - var(--editor-toolbar-height));
  background: rgb(var(--v-theme-background));
}

@media (max-width: 959px) {
  .editor-workspace {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(420px, 58dvh) auto;
  }
}

@media (max-width: 599px) {
  .editor-workspace {
    grid-template-rows: minmax(320px, 52dvh) auto;
  }
}
</style>

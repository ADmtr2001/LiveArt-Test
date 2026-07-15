<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, type CSSProperties } from 'vue'

import EditorToolbar from './components/editor/EditorToolbar.vue'
import EditorWorkspace from './components/editor/EditorWorkspace.vue'
import { EDITOR_LAYOUT } from './constants/editor'
import { useEditorStore } from './stores/editor'

const editorStore = useEditorStore()
const { hasEdits, hasImage, isComparingOriginal, isCropping } = storeToRefs(editorStore)
const canCompare = computed(() => hasImage.value && hasEdits.value && !isCropping.value)

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
      :has-edits="hasEdits"
      :has-image="hasImage"
      :is-comparing="isComparingOriginal"
      @compare="editorStore.setComparingOriginal"
      @reset="editorStore.resetEdits"
    />

    <v-main>
      <EditorWorkspace />
    </v-main>
  </v-app>
</template>

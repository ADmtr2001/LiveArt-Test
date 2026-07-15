<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onUnmounted, type CSSProperties } from 'vue'

import EditorToolbar from './components/editor/EditorToolbar.vue'
import EditorWorkspace from './components/editor/EditorWorkspace.vue'
import { EDITOR_LAYOUT } from './constants/editor'
import { useEditorStore } from './stores/editor'

const editorStore = useEditorStore()
const { hasImage } = storeToRefs(editorStore)

onUnmounted(editorStore.clearSource)

const editorLayoutStyle = {
  '--editor-toolbar-height': `${EDITOR_LAYOUT.toolbarHeight}px`,
  '--editor-sidebar-width': `${EDITOR_LAYOUT.sidebarWidth}px`,
} as CSSProperties
</script>

<template>
  <v-app :style="editorLayoutStyle">
    <EditorToolbar :has-image="hasImage" />

    <v-main>
      <EditorWorkspace />
    </v-main>
  </v-app>
</template>

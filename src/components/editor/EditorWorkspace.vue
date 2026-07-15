<script setup lang="ts">
import EditorSidebar from './EditorSidebar.vue'
import EditorViewport from './EditorViewport.vue'
</script>

<template>
  <div class="editor-workspace">
    <EditorViewport />
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

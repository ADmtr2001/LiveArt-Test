<script setup lang="ts">
import ImageDropzone from '../upload/ImageDropzone.vue'
</script>

<template>
  <main class="editor-viewport" aria-label="Image workspace">
    <div class="editor-viewport__stage">
      <ImageDropzone />
    </div>
  </main>
</template>

<style scoped>
.editor-viewport {
  min-width: 0;
  min-height: 0;
  padding: var(--editor-page-gutter);
  overflow: hidden;
  background-color: var(--editor-workspace-background);
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
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.025);
}

@media (max-width: 599px) {
  .editor-viewport__stage {
    border-radius: var(--editor-radius-md);
  }
}
</style>

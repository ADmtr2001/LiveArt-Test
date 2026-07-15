<script setup lang="ts">
import { mdiImageOutline } from '@mdi/js'
</script>

<template>
  <main class="editor-viewport" aria-label="Image workspace">
    <div class="editor-viewport__stage">
      <div class="editor-viewport__empty">
        <div class="editor-viewport__icon" aria-hidden="true">
          <v-icon :icon="mdiImageOutline" size="36" />
        </div>
        <h1>Your image will appear here</h1>
        <p>Upload an image to start editing.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.editor-viewport {
  min-width: 0;
  min-height: 0;
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  background-color: #0d0f13;
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
  border: 1px solid rgb(255 255 255 / 0.07);
  border-radius: 16px;
  background: rgb(17 19 24 / 0.72);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.025);
}

.editor-viewport__empty {
  display: grid;
  max-width: 320px;
  justify-items: center;
  padding: 2rem;
  text-align: center;
}

.editor-viewport__icon {
  display: grid;
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  place-items: center;
  border: 1px solid rgb(var(--v-theme-primary), 0.25);
  border-radius: 18px;
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary), 0.08);
}

.editor-viewport h1 {
  margin: 0;
  color: rgb(var(--v-theme-on-background));
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 650;
  letter-spacing: -0.02em;
}

.editor-viewport p {
  margin: 0.5rem 0 0;
  color: rgb(var(--v-theme-on-background), 0.58);
  font-size: 0.9rem;
}

@media (max-width: 599px) {
  .editor-viewport {
    padding: 0.75rem;
  }

  .editor-viewport__stage {
    border-radius: 12px;
  }
}
</style>

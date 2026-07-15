<script setup lang="ts">
import { mdiCloudUploadOutline } from '@mdi/js'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: true,
  },
)
</script>

<template>
  <section
    class="image-dropzone"
    :class="{ 'image-dropzone--disabled': disabled }"
    aria-labelledby="upload-heading"
  >
    <div class="image-dropzone__icon" aria-hidden="true">
      <v-icon :icon="mdiCloudUploadOutline" size="34" />
    </div>

    <div class="image-dropzone__copy">
      <h1 id="upload-heading">Drop an image here</h1>
      <p>or choose a file from your device</p>
    </div>

    <v-btn color="primary" :disabled="disabled" variant="flat">Select image</v-btn>

    <p class="image-dropzone__formats">JPEG, PNG or WebP</p>
  </section>
</template>

<style scoped>
.image-dropzone {
  display: grid;
  width: min(100%, 460px);
  justify-items: center;
  padding: clamp(var(--editor-space-6), 5vw, 3rem);
  border: 1px dashed rgb(var(--v-theme-primary), 0.42);
  border-radius: var(--editor-radius-lg);
  background: rgb(var(--v-theme-primary), 0.035);
  text-align: center;
  transition:
    border-color 160ms ease,
    background-color 160ms ease;
}

.image-dropzone--disabled {
  border-color: var(--editor-subtle-border);
  background: rgb(255 255 255 / 0.012);
}

.image-dropzone__icon {
  display: grid;
  width: 64px;
  height: 64px;
  margin-bottom: var(--editor-space-4);
  place-items: center;
  border: 1px solid rgb(var(--v-theme-primary), 0.25);
  border-radius: 18px;
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary), 0.08);
}

.image-dropzone__copy h1,
.image-dropzone__copy p,
.image-dropzone__formats {
  margin: 0;
}

.image-dropzone__copy h1 {
  color: rgb(var(--v-theme-on-background));
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 650;
  letter-spacing: -0.02em;
}

.image-dropzone__copy p {
  margin-top: var(--editor-space-2);
  color: rgb(var(--v-theme-on-background), 0.58);
  font-size: 0.9rem;
}

.image-dropzone .v-btn {
  min-width: 140px;
  margin-top: var(--editor-space-5);
}

.image-dropzone__formats {
  margin-top: var(--editor-space-3);
  color: rgb(var(--v-theme-on-background), 0.4);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
}

@media (prefers-reduced-motion: reduce) {
  .image-dropzone {
    transition: none;
  }
}
</style>

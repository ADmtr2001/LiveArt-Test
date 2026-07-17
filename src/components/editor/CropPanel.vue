<script setup lang="ts">
import { mdiBackupRestore, mdiCrop } from '@mdi/js'

withDefaults(
  defineProps<{
    hasImage?: boolean
    hasCrop?: boolean
    isCropping?: boolean
  }>(),
  {
    hasImage: false,
    hasCrop: false,
    isCropping: false,
  },
)

const emit = defineEmits<{
  editCrop: []
  resetCrop: []
}>()
</script>

<template>
  <section class="tool-panel" aria-labelledby="crop-heading">
    <h3 id="crop-heading">Crop</h3>
    <p>Choose the area you want to keep.</p>
    <div class="tool-panel__actions">
      <v-btn
        :prepend-icon="mdiCrop"
        block
        :disabled="!hasImage || isCropping"
        variant="tonal"
        @click="emit('editCrop')"
      >
        {{ hasCrop ? 'Edit crop' : 'Crop image' }}
      </v-btn>
      <v-btn
        v-if="hasCrop"
        :prepend-icon="mdiBackupRestore"
        block
        :disabled="isCropping"
        variant="text"
        @click="emit('resetCrop')"
      >
        Reset crop
      </v-btn>
    </div>
  </section>
</template>

<style scoped>
.tool-panel {
  min-height: 0;
  padding: var(--editor-space-5) var(--editor-panel-padding);
  overflow: hidden;
}

.tool-panel h3,
.tool-panel p {
  margin: 0;
}

.tool-panel h3 {
  font-size: 0.9rem;
  font-weight: 650;
}

.tool-panel > p {
  margin-top: 0.35rem;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.tool-panel__actions {
  display: grid;
  gap: var(--editor-space-1);
}

@media (max-width: 959px) {
  .tool-panel {
    max-width: 720px;
  }
}

@media (max-width: 599px) {
  .tool-panel {
    padding: var(--editor-space-3) var(--editor-space-4);
  }

  .tool-panel > p {
    margin-top: var(--editor-space-1);
    margin-bottom: var(--editor-space-2);
  }
}
</style>

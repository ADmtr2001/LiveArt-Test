<script setup lang="ts">
import { mdiBackupRestore, mdiCrop, mdiTuneVariant } from '@mdi/js'

import { ADJUSTMENT_DEFINITIONS, DEFAULT_ADJUSTMENT_VALUE } from '../../constants/editor'
import type { AdjustmentId, AdjustmentOperation } from '../../types/operations'

withDefaults(
  defineProps<{
    adjustments: AdjustmentOperation
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
  updateAdjustment: [id: AdjustmentId, value: number]
  resetAdjustment: [id: AdjustmentId]
}>()

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<template>
  <aside class="editor-sidebar" aria-labelledby="tools-heading">
    <div class="editor-sidebar__header">
      <div>
        <p class="editor-sidebar__eyebrow">Editing tools</p>
        <h2 id="tools-heading">Adjust image</h2>
      </div>
      <v-icon :icon="mdiTuneVariant" size="20" />
    </div>

    <v-divider />

    <section class="editor-sidebar__section" aria-labelledby="crop-heading">
      <h3 id="crop-heading">Crop</h3>
      <p>Choose the area you want to keep.</p>
      <div class="editor-sidebar__crop-actions">
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

    <v-divider />

    <section class="editor-sidebar__section" aria-labelledby="adjustments-heading">
      <h3 id="adjustments-heading">Adjustments</h3>
      <p>Fine-tune colour and tone.</p>

      <div class="editor-sidebar__sliders">
        <div
          v-for="adjustment in ADJUSTMENT_DEFINITIONS"
          :key="adjustment.id"
          class="editor-sidebar__slider"
        >
          <div class="editor-sidebar__slider-label">
            <span>{{ adjustment.label }}</span>
            <div class="editor-sidebar__slider-value">
              <output :for="`adjustment-${adjustment.id}`">
                {{ formatPercentage(adjustments[adjustment.id]) }}
              </output>
              <v-btn
                :aria-label="`Reset ${adjustment.label.toLowerCase()} to 100%`"
                :disabled="
                  !hasImage ||
                  isCropping ||
                  adjustments[adjustment.id] === DEFAULT_ADJUSTMENT_VALUE
                "
                :icon="mdiBackupRestore"
                size="x-small"
                title="Reset to 100%"
                variant="text"
                @click="emit('resetAdjustment', adjustment.id)"
              />
            </div>
          </div>
          <v-slider
            :id="`adjustment-${adjustment.id}`"
            :aria-label="adjustment.label"
            color="primary"
            density="compact"
            :disabled="!hasImage || isCropping"
            hide-details
            :max="adjustment.max"
            :min="adjustment.min"
            :model-value="adjustments[adjustment.id]"
            :step="0.01"
            @update:model-value="emit('updateAdjustment', adjustment.id, $event)"
          />
        </div>
      </div>
    </section>

    <div v-if="!hasImage" class="editor-sidebar__hint">
      Upload an image to enable editing tools.
    </div>
  </aside>
</template>

<style scoped>
.editor-sidebar {
  position: relative;
  min-width: 0;
  padding-bottom: var(--editor-space-5);
  overflow: auto;
  border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

.editor-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--editor-panel-padding);
}

.editor-sidebar__eyebrow {
  margin: 0 0 0.25rem;
  color: rgb(var(--v-theme-primary));
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.editor-sidebar h2,
.editor-sidebar h3,
.editor-sidebar p {
  margin: 0;
}

.editor-sidebar h2 {
  font-size: 1.15rem;
  font-weight: 650;
}

.editor-sidebar h3 {
  font-size: 0.9rem;
  font-weight: 650;
}

.editor-sidebar__section {
  padding: var(--editor-space-5) var(--editor-panel-padding);
}

.editor-sidebar__section > p {
  margin-top: 0.35rem;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.editor-sidebar__sliders {
  display: grid;
  gap: var(--editor-space-4);
}

.editor-sidebar__crop-actions {
  display: grid;
  gap: var(--editor-space-1);
}

.editor-sidebar__slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.editor-sidebar__slider-value {
  display: flex;
  min-width: 4.75rem;
  align-items: center;
  justify-content: flex-end;
  gap: var(--editor-space-1);
}

.editor-sidebar__slider-value output {
  min-width: 2.75rem;
  text-align: right;
}

.editor-sidebar__hint {
  margin: var(--editor-space-2) var(--editor-panel-padding) 0;
  padding: var(--editor-space-3);
  border: 1px solid rgb(var(--v-theme-primary), 0.12);
  border-radius: var(--editor-radius-sm);
  color: rgb(var(--v-theme-on-surface), 0.52);
  background: rgb(var(--v-theme-primary), 0.045);
  font-size: 0.75rem;
  line-height: 1.45;
}

@media (max-width: 959px) {
  .editor-sidebar {
    overflow: visible;
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-left: 0;
  }

  .editor-sidebar__section {
    max-width: 720px;
  }

  .editor-sidebar__sliders {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .editor-sidebar__sliders {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

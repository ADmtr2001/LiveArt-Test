<script setup lang="ts">
import { mdiTuneVariant } from '@mdi/js'
import { ref } from 'vue'

import AdjustmentPanel from './AdjustmentPanel.vue'
import CropPanel from './CropPanel.vue'
import FilterPanel from './FilterPanel.vue'
import type {
  AdjustmentId,
  AdjustmentOperation,
  FilterOperation,
} from '../../types/operations'

withDefaults(
  defineProps<{
    adjustments: AdjustmentOperation
    filter: FilterOperation | null
    disabled?: boolean
    hasImage?: boolean
    hasCrop?: boolean
    isCropping?: boolean
  }>(),
  {
    hasImage: false,
    hasCrop: false,
    isCropping: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  editCrop: []
  resetCrop: []
  updateAdjustment: [id: AdjustmentId, value: number]
  resetAdjustment: [id: AdjustmentId]
  setFilter: [filter: FilterOperation | null]
}>()

type ToolPanel = 'crop' | 'adjustments' | 'filters'
const activeTool = ref<ToolPanel>('adjustments')

function updateAdjustment(id: AdjustmentId, value: number): void {
  emit('updateAdjustment', id, value)
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

    <v-divider class="editor-sidebar__header-divider" />

    <v-tabs v-model="activeTool" class="editor-sidebar__tabs" density="compact" grow>
      <v-tab value="crop">Crop</v-tab>
      <v-tab value="adjustments">Adjust</v-tab>
      <v-tab value="filters">Filters</v-tab>
    </v-tabs>

    <v-divider />

    <CropPanel
      v-show="activeTool === 'crop'"
      :has-crop="hasCrop"
      :has-image="hasImage"
      :disabled="disabled"
      :is-cropping="isCropping"
      @edit-crop="emit('editCrop')"
      @reset-crop="emit('resetCrop')"
    />

    <AdjustmentPanel
      v-show="activeTool === 'adjustments'"
      :adjustments="adjustments"
      :disabled="disabled"
      :has-image="hasImage"
      :is-cropping="isCropping"
      @reset-adjustment="emit('resetAdjustment', $event)"
      @update-adjustment="updateAdjustment"
    />

    <FilterPanel
      v-show="activeTool === 'filters'"
      :filter="filter"
      :disabled="disabled"
      :has-image="hasImage"
      :is-cropping="isCropping"
      @set-filter="emit('setFilter', $event)"
    />
  </aside>
</template>

<style scoped>
.editor-sidebar {
  position: relative;
  display: grid;
  grid-template-rows: auto auto auto auto minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--editor-subtle-border);
  border-radius: var(--editor-radius-lg);
  background: var(--editor-island-background);
  box-shadow: var(--editor-island-shadow);
  backdrop-filter: var(--editor-surface-filter);
}

.editor-sidebar__tabs {
  min-width: 0;
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
.editor-sidebar p {
  margin: 0;
}

.editor-sidebar h2 {
  font-size: 1.15rem;
  font-weight: 650;
}

@media (max-width: 959px) {
  .editor-sidebar {
    border: 1px solid var(--editor-subtle-border);
  }
}

@media (max-width: 599px) {
  .editor-sidebar {
    grid-template-rows: auto auto minmax(0, 1fr);
    border-radius: var(--editor-radius-md);
  }

  .editor-sidebar__header,
  .editor-sidebar__header-divider {
    display: none;
  }
}
</style>

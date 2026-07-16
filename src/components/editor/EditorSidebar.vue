<script setup lang="ts">
import { mdiBackupRestore, mdiCodeJson, mdiCrop, mdiTuneVariant } from '@mdi/js'
import { ref } from 'vue'

import { ADJUSTMENT_DEFINITIONS, DEFAULT_ADJUSTMENT_VALUE } from '../../constants/editor'
import {
  DEFAULT_FILTER_AMOUNT,
  FILTER_DEFINITIONS,
  MAX_FILTER_AMOUNT,
  MIN_FILTER_AMOUNT,
} from '../../constants/filters'
import type {
  AdjustmentId,
  AdjustmentOperation,
  FilterName,
  FilterOperation,
} from '../../types/operations'

const props = withDefaults(
  defineProps<{
    adjustments: AdjustmentOperation
    filter: FilterOperation | null
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
  setFilter: [filter: FilterOperation | null]
  exportRecipe: []
}>()

type ToolPanel = 'crop' | 'adjustments' | 'filters'
const activeTool = ref<ToolPanel>('adjustments')

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

function toggleFilter(name: FilterName): void {
  emit(
    'setFilter',
    props.filter?.name === name
      ? null
      : { type: 'filter', name, amount: DEFAULT_FILTER_AMOUNT },
  )
}

function updateFilterAmount(amount: number): void {
  if (props.filter) {
    emit('setFilter', { ...props.filter, amount })
  }
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

    <section
      v-show="activeTool === 'crop'"
      class="editor-sidebar__section"
      aria-labelledby="crop-heading"
    >
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

    <section
      v-show="activeTool === 'adjustments'"
      class="editor-sidebar__section"
      aria-labelledby="adjustments-heading"
    >
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

    <section
      v-show="activeTool === 'filters'"
      class="editor-sidebar__section"
      aria-labelledby="filters-heading"
    >
      <h3 id="filters-heading">Filters</h3>
      <p>Apply a reusable colour treatment.</p>

      <div class="editor-sidebar__filter-options" aria-label="Image filter" role="group">
        <v-btn
          v-for="filterDefinition in FILTER_DEFINITIONS"
          :key="filterDefinition.id"
          :active="filter?.name === filterDefinition.id"
          :aria-pressed="filter?.name === filterDefinition.id"
          :disabled="!hasImage || isCropping"
          size="small"
          variant="tonal"
          @click="toggleFilter(filterDefinition.id)"
        >
          {{ filterDefinition.label }}
        </v-btn>
      </div>

      <div v-if="filter" class="editor-sidebar__filter-amount">
        <div class="editor-sidebar__slider-label">
          <span>Amount</span>
          <output for="filter-amount">{{ formatPercentage(filter.amount) }}</output>
        </div>
        <v-slider
          id="filter-amount"
          aria-label="Filter amount"
          color="primary"
          density="compact"
          :disabled="!hasImage || isCropping"
          hide-details
          :max="MAX_FILTER_AMOUNT"
          :min="MIN_FILTER_AMOUNT"
          :model-value="filter.amount"
          :step="0.01"
          @update:model-value="updateFilterAmount"
        />
      </div>

      <v-btn
        class="editor-sidebar__recipe"
        :disabled="!hasImage || isCropping"
        :prepend-icon="mdiCodeJson"
        size="small"
        variant="outlined"
        @click="emit('exportRecipe')"
      >
        Download recipe
      </v-btn>
    </section>
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
  border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
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
  min-height: 0;
  padding: var(--editor-space-5) var(--editor-panel-padding);
  overflow: hidden;
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

.editor-sidebar__filter-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--editor-space-2);
}

.editor-sidebar__filter-amount {
  margin-top: var(--editor-space-4);
}

.editor-sidebar__recipe {
  width: 100%;
  margin-top: var(--editor-space-4);
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

@media (max-width: 959px) {
  .editor-sidebar {
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
  .editor-sidebar {
    grid-template-rows: auto auto minmax(0, 1fr);
  }

  .editor-sidebar__header,
  .editor-sidebar__header-divider {
    display: none;
  }

  .editor-sidebar__section {
    padding: var(--editor-space-3) var(--editor-space-4);
  }

  .editor-sidebar__section > p {
    margin-top: var(--editor-space-1);
    margin-bottom: var(--editor-space-2);
  }

  .editor-sidebar__sliders {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--editor-space-3);
  }

  .editor-sidebar__slider-label {
    display: grid;
    gap: var(--editor-space-1);
  }

  .editor-sidebar__slider-value {
    min-width: 0;
    justify-content: space-between;
  }
}
</style>

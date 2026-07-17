<script setup lang="ts">
import {
  DEFAULT_FILTER_AMOUNT,
  FILTER_DEFINITIONS,
  MAX_FILTER_AMOUNT,
  MIN_FILTER_AMOUNT,
} from '../../constants/filters'
import type { FilterName, FilterOperation } from '../../types/operations'

const props = withDefaults(
  defineProps<{
    filter: FilterOperation | null
    hasImage?: boolean
    isCropping?: boolean
    disabled?: boolean
  }>(),
  {
    hasImage: false,
    isCropping: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  setFilter: [filter: FilterOperation | null]
}>()

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
  <section class="filter-panel" aria-labelledby="filters-heading">
    <h3 id="filters-heading">Filters</h3>
    <p>Apply a reusable colour treatment.</p>

    <div class="filter-panel__options" aria-label="Image filter" role="group">
      <v-btn
        v-for="filterDefinition in FILTER_DEFINITIONS"
        :key="filterDefinition.id"
        :active="filter?.name === filterDefinition.id"
        :aria-pressed="filter?.name === filterDefinition.id"
        :disabled="disabled || !hasImage || isCropping"
        size="small"
        variant="tonal"
        @click="toggleFilter(filterDefinition.id)"
      >
        {{ filterDefinition.label }}
      </v-btn>
    </div>

    <div v-if="filter" class="filter-panel__amount">
      <div class="filter-panel__slider-label">
        <span>Amount</span>
        <output for="filter-amount">{{ formatPercentage(filter.amount) }}</output>
      </div>
      <v-slider
        id="filter-amount"
        aria-label="Filter amount"
        color="primary"
        density="compact"
        :disabled="disabled || !hasImage || isCropping"
        hide-details
        :max="MAX_FILTER_AMOUNT"
        :min="MIN_FILTER_AMOUNT"
        :model-value="filter.amount"
        :step="0.01"
        @update:model-value="updateFilterAmount"
      />
    </div>
  </section>
</template>

<style scoped>
.filter-panel {
  min-height: 0;
  padding: var(--editor-space-5) var(--editor-panel-padding);
  overflow: hidden;
}

.filter-panel h3,
.filter-panel p {
  margin: 0;
}

.filter-panel h3 {
  font-size: 0.9rem;
  font-weight: 650;
}

.filter-panel > p {
  margin-top: 0.35rem;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.filter-panel__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--editor-space-2);
}

.filter-panel__amount {
  margin-top: var(--editor-space-4);
}

.filter-panel__slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 959px) {
  .filter-panel {
    max-width: 720px;
  }
}

@media (max-width: 599px) {
  .filter-panel {
    padding: var(--editor-space-3) var(--editor-space-4);
  }

  .filter-panel > p {
    margin-top: var(--editor-space-1);
    margin-bottom: var(--editor-space-2);
  }
}
</style>

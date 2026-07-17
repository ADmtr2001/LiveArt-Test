<script setup lang="ts">
import { mdiBackupRestore } from '@mdi/js'

import { ADJUSTMENT_DEFINITIONS, DEFAULT_ADJUSTMENT_VALUE } from '../../constants/editor'
import type { AdjustmentId, AdjustmentOperation } from '../../types/operations'

withDefaults(
  defineProps<{
    adjustments: AdjustmentOperation
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
  updateAdjustment: [id: AdjustmentId, value: number]
  resetAdjustment: [id: AdjustmentId]
}>()

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<template>
  <section class="adjustment-panel" aria-labelledby="adjustments-heading">
    <h3 id="adjustments-heading">Adjustments</h3>
    <p>Fine-tune colour and tone.</p>

    <div class="adjustment-panel__sliders">
      <div
        v-for="adjustment in ADJUSTMENT_DEFINITIONS"
        :key="adjustment.id"
        class="adjustment-panel__slider"
      >
        <div class="adjustment-panel__slider-label">
          <span>{{ adjustment.label }}</span>
          <div class="adjustment-panel__slider-value">
            <output :for="`adjustment-${adjustment.id}`">
              {{ formatPercentage(adjustments[adjustment.id]) }}
            </output>
            <v-btn
              :aria-label="`Reset ${adjustment.label.toLowerCase()} to 100%`"
              :disabled="
                disabled ||
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
          :disabled="disabled || !hasImage || isCropping"
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
</template>

<style scoped>
.adjustment-panel {
  min-height: 0;
  padding: var(--editor-space-5) var(--editor-panel-padding);
  overflow: hidden;
}

.adjustment-panel h3,
.adjustment-panel p {
  margin: 0;
}

.adjustment-panel h3 {
  font-size: 0.9rem;
  font-weight: 650;
}

.adjustment-panel > p {
  margin-top: 0.35rem;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.adjustment-panel__sliders {
  display: grid;
  gap: var(--editor-space-4);
}

.adjustment-panel__slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.adjustment-panel__slider-value {
  display: flex;
  min-width: 4.75rem;
  align-items: center;
  justify-content: flex-end;
  gap: var(--editor-space-1);
}

.adjustment-panel__slider-value output {
  min-width: 2.75rem;
  text-align: right;
}

@media (max-width: 959px) {
  .adjustment-panel {
    max-width: 720px;
  }

  .adjustment-panel__sliders {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .adjustment-panel {
    padding: var(--editor-space-2) var(--editor-space-4);
  }

  .adjustment-panel > h3,
  .adjustment-panel > p {
    display: none;
  }

  .adjustment-panel__sliders {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .adjustment-panel__slider-label {
    margin-bottom: 0;
  }

  .adjustment-panel__slider :deep(.v-slider) {
    height: 28px;
  }
}
</style>

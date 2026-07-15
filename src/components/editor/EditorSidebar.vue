<script setup lang="ts">
import { mdiCrop, mdiTuneVariant } from '@mdi/js'

import { ADJUSTMENT_DEFINITIONS, DEFAULT_ADJUSTMENT_VALUE } from '../../constants/editor'
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
      <v-btn :prepend-icon="mdiCrop" block disabled variant="tonal">Crop image</v-btn>
    </section>

    <v-divider />

    <section class="editor-sidebar__section" aria-labelledby="adjustments-heading">
      <h3 id="adjustments-heading">Adjustments</h3>
      <p>Fine-tune colour and tone.</p>

      <div class="editor-sidebar__sliders">
        <div v-for="adjustment in ADJUSTMENT_DEFINITIONS" :key="adjustment.id">
          <div class="editor-sidebar__slider-label">
            <span>{{ adjustment.label }}</span>
            <span>{{ DEFAULT_ADJUSTMENT_VALUE * 100 }}%</span>
          </div>
          <v-slider
            :aria-label="adjustment.label"
            color="primary"
            density="compact"
            disabled
            hide-details
            :max="adjustment.max"
            :min="adjustment.min"
            :model-value="DEFAULT_ADJUSTMENT_VALUE"
            :step="0.01"
          />
        </div>
      </div>
    </section>

    <div class="editor-sidebar__hint">Upload an image to enable editing tools.</div>
  </aside>
</template>

<style scoped>
.editor-sidebar {
  position: relative;
  min-width: 0;
  padding-bottom: 1.25rem;
  overflow: auto;
  border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

.editor-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
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
  padding: 1.25rem 1.5rem;
}

.editor-sidebar__section > p {
  margin-top: 0.35rem;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.editor-sidebar__sliders {
  display: grid;
  gap: 1rem;
}

.editor-sidebar__slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.editor-sidebar__hint {
  margin: 0.5rem 1.5rem 0;
  padding: 0.75rem;
  border: 1px solid rgb(var(--v-theme-primary), 0.12);
  border-radius: 8px;
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
}
</style>

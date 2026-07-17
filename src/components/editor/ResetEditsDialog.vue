<script setup lang="ts">
import { mdiBackupRestore, mdiCheckCircleOutline } from '@mdi/js'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function confirm(): void {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    scrim="#05070c"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="reset-dialog" rounded="xl">
      <div class="reset-dialog__header">
        <v-avatar color="primary" size="44" variant="tonal">
          <v-icon :icon="mdiBackupRestore" size="24" />
        </v-avatar>
        <div>
          <v-card-title class="reset-dialog__title">Reset all edits?</v-card-title>
          <p class="reset-dialog__subtitle">Return this image to a clean slate.</p>
        </div>
      </div>

      <v-card-text class="reset-dialog__content">
        <p>Your current crop, adjustments and filter settings will be cleared.</p>

        <div class="reset-dialog__operations" aria-label="Edits that will be reset">
          <v-chip size="small" variant="tonal">Crop</v-chip>
          <v-chip size="small" variant="tonal">Adjustments</v-chip>
          <v-chip size="small" variant="tonal">Filters</v-chip>
        </div>

        <div class="reset-dialog__source-note">
          <v-icon color="success" :icon="mdiCheckCircleOutline" size="18" />
          <span>Your original source image will remain unchanged.</span>
        </div>
      </v-card-text>

      <v-card-actions class="reset-dialog__actions">
        <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="confirm">Reset edits</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.reset-dialog {
  padding: var(--editor-space-2);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(27 30 37 / 0.9);
  box-shadow: 0 24px 80px rgb(0 0 0 / 0.48);
  backdrop-filter: var(--editor-surface-filter);
}

.reset-dialog__header {
  display: flex;
  align-items: center;
  gap: var(--editor-space-3);
  padding: var(--editor-space-4) var(--editor-space-4) var(--editor-space-3);
}

.reset-dialog__title {
  padding: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.reset-dialog__subtitle,
.reset-dialog__content p {
  margin: 0;
}

.reset-dialog__subtitle {
  margin-top: var(--editor-space-1);
  color: rgb(var(--v-theme-on-surface), 0.58);
  font-size: 0.8rem;
}

.reset-dialog__content {
  display: grid;
  gap: var(--editor-space-4);
  padding: var(--editor-space-3) var(--editor-space-4);
  color: rgb(var(--v-theme-on-surface), 0.78);
  font-size: 0.9rem;
  line-height: 1.55;
}

.reset-dialog__operations {
  display: flex;
  flex-wrap: wrap;
  gap: var(--editor-space-2);
}

.reset-dialog__source-note {
  display: flex;
  align-items: center;
  gap: var(--editor-space-2);
  padding: var(--editor-space-3);
  border: 1px solid rgb(var(--v-theme-success), 0.18);
  border-radius: var(--editor-radius-md);
  background: rgb(var(--v-theme-success), 0.07);
  color: rgb(var(--v-theme-on-surface), 0.72);
  font-size: 0.8rem;
}

.reset-dialog__actions {
  justify-content: flex-end;
  gap: var(--editor-space-2);
  padding: var(--editor-space-3) var(--editor-space-4) var(--editor-space-4);
}

@media (max-width: 599px) {
  .reset-dialog {
    padding: var(--editor-space-1);
  }

  .reset-dialog__header,
  .reset-dialog__content,
  .reset-dialog__actions {
    padding-inline: var(--editor-space-3);
  }

  .reset-dialog__actions .v-btn {
    flex: 1;
  }
}
</style>

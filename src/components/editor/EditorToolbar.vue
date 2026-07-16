<script setup lang="ts">
import {
  mdiDownloadOutline,
  mdiFileExportOutline,
  mdiFileImportOutline,
  mdiImageEditOutline,
  mdiMenuDown,
} from '@mdi/js'
import { ref } from 'vue'

import { EDITOR_LAYOUT } from '../../constants/editor'

withDefaults(
  defineProps<{
    canExport?: boolean
    hasImage?: boolean
    isExporting?: boolean
    isImportingRecipe?: boolean
  }>(),
  {
    canExport: false,
    hasImage: false,
    isExporting: false,
    isImportingRecipe: false,
  },
)

const emit = defineEmits<{
  export: []
  exportRecipe: []
  importRecipe: [file: File]
}>()

const recipeInput = ref<HTMLInputElement | null>(null)

function selectRecipe(): void {
  recipeInput.value?.click()
}

function handleRecipeSelection(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (file) {
    emit('importRecipe', file)
  }
}
</script>

<template>
  <v-app-bar
    class="editor-toolbar"
    color="surface"
    elevation="0"
    :height="EDITOR_LAYOUT.toolbarHeight"
  >
    <div class="editor-toolbar__surface">
      <div class="editor-toolbar__brand" aria-label="LiveArt image editor">
        <v-avatar color="primary" rounded="lg" size="32">
          <v-icon :icon="mdiImageEditOutline" size="20" />
        </v-avatar>

        <div class="editor-toolbar__brand-copy">
          <span class="editor-toolbar__title">LiveArt</span>
          <span class="editor-toolbar__subtitle">Image editor</span>
        </div>
      </div>

      <v-spacer />

      <nav class="editor-toolbar__actions" aria-label="Editor actions">
        <input
          ref="recipeInput"
          accept="application/json,.json"
          aria-hidden="true"
          class="editor-toolbar__recipe-input"
          :disabled="!hasImage || isImportingRecipe"
          tabindex="-1"
          type="file"
          @change="handleRecipeSelection"
        />

        <v-menu location="bottom end">
          <template #activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              :append-icon="mdiMenuDown"
              aria-label="Recipe actions"
              class="editor-toolbar__recipe"
              color="primary"
              :disabled="!canExport"
              :loading="isImportingRecipe"
              variant="outlined"
            >
              Recipe
            </v-btn>
          </template>

          <v-list density="compact" min-width="210">
            <v-list-item
              :disabled="isImportingRecipe"
              :prepend-icon="mdiFileImportOutline"
              title="Import recipe…"
              @click="selectRecipe"
            />
            <v-list-item
              :disabled="isImportingRecipe"
              :prepend-icon="mdiFileExportOutline"
              title="Export recipe"
              @click="emit('exportRecipe')"
            />
          </v-list>
        </v-menu>

        <v-btn
          class="editor-toolbar__export"
          color="primary"
          :disabled="!canExport"
          :loading="isExporting"
          :prepend-icon="mdiDownloadOutline"
          :aria-label="isExporting ? 'Exporting image' : 'Export image'"
          variant="flat"
          @click="emit('export')"
        >
          <span class="editor-toolbar__export-label">Export</span>
        </v-btn>
      </nav>
    </div>
  </v-app-bar>
</template>

<style scoped>
.editor-toolbar {
  background: transparent !important;
  box-shadow: none !important;
}

.editor-toolbar :deep(.v-toolbar__content) {
  padding: 8px var(--editor-shell-gap);
}

.editor-toolbar__surface {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-inline: var(--editor-space-4);
  overflow: hidden;
  border: 1px solid var(--editor-subtle-border);
  border-radius: var(--editor-radius-lg);
  background: var(--editor-island-background);
  box-shadow: var(--editor-island-shadow);
  backdrop-filter: var(--editor-surface-filter);
}

.editor-toolbar__brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--editor-space-3);
}

.editor-toolbar__brand-copy {
  display: grid;
  line-height: 1.1;
}

.editor-toolbar__title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.editor-toolbar__subtitle {
  margin-top: 0.2rem;
  color: rgb(var(--v-theme-on-surface), 0.62);
  font-size: 0.72rem;
  font-weight: 500;
}

.editor-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.editor-toolbar__export {
  min-width: 112px;
}

.editor-toolbar__recipe-input {
  display: none;
}

.editor-toolbar__recipe {
  min-width: 104px;
}

@media (max-width: 599px) {
  .editor-toolbar__subtitle,
  .editor-toolbar__export-label {
    display: none;
  }

  .editor-toolbar__export {
    min-width: 40px;
    width: 40px;
    padding: 0;
  }

  .editor-toolbar__export :deep(.v-btn__prepend) {
    margin: 0;
  }

  .editor-toolbar__brand-copy {
    display: none;
  }

  .editor-toolbar__surface {
    padding-inline: var(--editor-space-2);
    border-radius: var(--editor-radius-md);
  }

  .editor-toolbar__recipe {
    min-width: 88px;
    padding-inline: var(--editor-space-2);
  }
}
</style>

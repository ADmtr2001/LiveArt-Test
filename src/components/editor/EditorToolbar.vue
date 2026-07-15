<script setup lang="ts">
import {
  mdiBackupRestore,
  mdiCompare,
  mdiDownloadOutline,
  mdiImageEditOutline,
} from '@mdi/js'

import { EDITOR_LAYOUT } from '../../constants/editor'

withDefaults(
  defineProps<{
    hasImage?: boolean
    hasEdits?: boolean
  }>(),
  {
    hasImage: false,
    hasEdits: false,
  },
)
</script>

<template>
  <v-app-bar
    class="editor-toolbar"
    color="surface"
    elevation="0"
    :height="EDITOR_LAYOUT.toolbarHeight"
  >
    <div class="editor-toolbar__brand" aria-label="LiveArt image editor">
      <v-avatar color="primary" rounded="lg" size="36">
        <v-icon :icon="mdiImageEditOutline" size="22" />
      </v-avatar>

      <div class="editor-toolbar__brand-copy">
        <span class="editor-toolbar__title">LiveArt</span>
        <span class="editor-toolbar__subtitle">Image editor</span>
      </div>
    </div>

    <v-spacer />

    <nav class="editor-toolbar__actions" aria-label="Editor actions">
      <v-btn
        :disabled="!hasImage"
        :icon="mdiCompare"
        aria-label="View original"
        variant="text"
      />

      <v-btn
        :disabled="!hasEdits"
        :icon="mdiBackupRestore"
        aria-label="Reset edits"
        variant="text"
      />

      <v-divider class="editor-toolbar__divider" vertical />

      <v-btn
        class="editor-toolbar__export"
        color="primary"
        :disabled="!hasImage"
        :prepend-icon="mdiDownloadOutline"
        aria-label="Export image"
        variant="flat"
      >
        <span class="editor-toolbar__export-label">Export</span>
      </v-btn>
    </nav>
  </v-app-bar>
</template>

<style scoped>
.editor-toolbar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.editor-toolbar :deep(.v-toolbar__content) {
  padding-inline: clamp(1rem, 3vw, 2rem);
}

.editor-toolbar__brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 0.75rem;
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

.editor-toolbar__divider {
  height: 28px;
  margin-inline: 0.5rem;
}

.editor-toolbar__export {
  min-width: 112px;
}

@media (max-width: 599px) {
  .editor-toolbar :deep(.v-toolbar__content) {
    padding-inline: 0.75rem;
  }

  .editor-toolbar__subtitle,
  .editor-toolbar__divider,
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
}
</style>

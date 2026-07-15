<script setup lang="ts">
import { mdiBackupRestore, mdiCheck, mdiClose } from '@mdi/js'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Cropper, type Coordinates, type CropperResult } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import type { ImageSource } from '../../types/image'
import type { CropOperation } from '../../types/operations'
import { clampCropRect } from '../../utils/geometry'

const props = defineProps<{
  source: ImageSource
  committedCrop: CropOperation | null
}>()

const emit = defineEmits<{
  apply: [crop: CropOperation | null]
  cancel: []
}>()

const cropper = ref<InstanceType<typeof Cropper> | null>(null)
const draft = ref<Coordinates | null>(null)
const isReady = ref(false)
const resetDraft = ref(false)

function isFullImageSelection(coordinates: Coordinates): boolean {
  const tolerance = 0.5

  return (
    Math.abs(coordinates.left) <= tolerance &&
    Math.abs(coordinates.top) <= tolerance &&
    Math.abs(coordinates.width - props.source.width) <= tolerance &&
    Math.abs(coordinates.height - props.source.height) <= tolerance
  )
}

function toCoordinates(crop: CropOperation): Coordinates {
  return {
    left: crop.x,
    top: crop.y,
    width: crop.width,
    height: crop.height,
  }
}

function fullImageCoordinates(): Coordinates {
  return {
    left: 0,
    top: 0,
    width: props.source.width,
    height: props.source.height,
  }
}

function handleChange(result: CropperResult): void {
  draft.value = { ...result.coordinates }
  resetDraft.value = isFullImageSelection(result.coordinates)
}

async function handleReady(): Promise<void> {
  isReady.value = true
  await nextTick()

  if (props.committedCrop) {
    const coordinates = toCoordinates(props.committedCrop)
    draft.value = coordinates
    resetDraft.value = false
    cropper.value?.setCoordinates(coordinates)
  } else {
    resetSelection()
  }
}

function resetSelection(): void {
  const coordinates = fullImageCoordinates()
  draft.value = coordinates
  resetDraft.value = true
  cropper.value?.setCoordinates(coordinates)
}

function apply(): void {
  if (!isReady.value || !draft.value) {
    return
  }

  if (resetDraft.value) {
    emit('apply', null)
    return
  }

  emit(
    'apply',
    clampCropRect(
      {
        x: draft.value.left,
        y: draft.value.top,
        width: draft.value.width,
        height: draft.value.height,
      },
      props.source,
    ),
  )
}

function handleKeydown(event: KeyboardEvent): void {
  const target = event.target

  if (target instanceof HTMLElement && target.closest('button, input, textarea')) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('cancel')
  } else if (event.key === 'Enter') {
    event.preventDefault()
    apply()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  cropper.value = null
})
</script>

<template>
  <main class="crop-workspace" aria-labelledby="crop-mode-heading">
    <div class="crop-workspace__header">
      <div>
        <p>Crop mode</p>
        <h1 id="crop-mode-heading">Choose an area to keep</h1>
      </div>
      <span>{{ source.width }} × {{ source.height }} px</span>
    </div>

    <div class="crop-workspace__stage">
      <Cropper
        ref="cropper"
        class="crop-workspace__cropper"
        :canvas="false"
        :check-orientation="false"
        :debounce="false"
        image-restriction="fit-area"
        :move-image="false"
        :resize-image="false"
        :round-result="false"
        :src="source.objectUrl"
        @change="handleChange"
        @ready="handleReady"
      />
    </div>

    <div class="crop-workspace__actions">
      <v-btn :prepend-icon="mdiClose" variant="text" @click="emit('cancel')">
        Cancel
      </v-btn>
      <v-spacer />
      <v-btn
        :disabled="!isReady"
        :prepend-icon="mdiBackupRestore"
        variant="tonal"
        @click="resetSelection"
      >
        Reset crop
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isReady"
        :prepend-icon="mdiCheck"
        variant="flat"
        @click="apply"
      >
        Apply crop
      </v-btn>
    </div>
  </main>
</template>

<style scoped>
.crop-workspace {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 0;
  padding: var(--editor-page-gutter);
  background: var(--editor-workspace-background);
}

.crop-workspace__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--editor-space-4);
  padding-bottom: var(--editor-space-4);
}

.crop-workspace__header p,
.crop-workspace__header h1 {
  margin: 0;
}

.crop-workspace__header p {
  color: rgb(var(--v-theme-primary));
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.crop-workspace__header h1 {
  margin-top: var(--editor-space-1);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 650;
}

.crop-workspace__header > span {
  color: rgb(var(--v-theme-on-background), 0.54);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.crop-workspace__stage {
  min-height: 0;
  padding: var(--editor-space-4);
  overflow: hidden;
  border: 1px solid var(--editor-subtle-border);
  border-radius: var(--editor-radius-lg);
  background: #090b0e;
}

.crop-workspace__cropper {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: #090b0e;
}

.crop-workspace__actions {
  display: flex;
  align-items: center;
  gap: var(--editor-space-2);
  padding-top: var(--editor-space-4);
}

@media (max-width: 599px) {
  .crop-workspace__header > span {
    display: none;
  }

  .crop-workspace__stage {
    border-radius: var(--editor-radius-md);
  }

  .crop-workspace__actions {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
  }

  .crop-workspace__actions .v-spacer {
    display: none;
  }

  .crop-workspace__actions .v-btn {
    min-width: 0;
  }

  .crop-workspace__actions .v-btn:first-child {
    grid-column: 1;
  }
}
</style>

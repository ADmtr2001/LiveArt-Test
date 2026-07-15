import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { ADJUSTMENT_DEFINITIONS, DEFAULT_ADJUSTMENT_VALUE } from '../constants/editor'
import { createDefaultEditDocument } from '../constants/operations'
import { createImageSource, revokeImageSource } from '../services/imageSource'
import type { ImageSource } from '../types/image'
import type { AdjustmentId, CropOperation, FilterOperation } from '../types/operations'
import { clamp } from '../utils/geometry'
import { hasDocumentEdits } from '../utils/editDocument'
import { validateImageFile } from '../utils/fileValidation'

export const useEditorStore = defineStore('editor', () => {
  const source = ref<ImageSource | null>(null)
  const isLoadingSource = ref(false)
  const sourceError = ref<string | null>(null)
  const editDocument = ref(createDefaultEditDocument())
  const isComparingOriginal = ref(false)
  const isCropping = ref(false)
  let loadRevision = 0

  const hasImage = computed(() => source.value !== null)
  const hasEdits = computed(() => hasDocumentEdits(editDocument.value))

  function resetEdits(): void {
    editDocument.value = createDefaultEditDocument()
    isComparingOriginal.value = false
    isCropping.value = false
  }

  function setComparingOriginal(active: boolean): void {
    isComparingOriginal.value = active && hasImage.value
  }

  function setCrop(crop: CropOperation | null): void {
    editDocument.value = {
      ...editDocument.value,
      crop: crop ? { ...crop } : null,
    }
  }

  function enterCropMode(): void {
    if (!source.value) {
      return
    }

    isComparingOriginal.value = false
    isCropping.value = true
  }

  function cancelCropMode(): void {
    isCropping.value = false
  }

  function applyCrop(crop: CropOperation | null): void {
    setCrop(crop)
    isCropping.value = false
  }

  function resetCrop(): void {
    setCrop(null)
  }

  function updateAdjustment(id: AdjustmentId, value: number): void {
    if (!Number.isFinite(value)) {
      return
    }

    const definition = ADJUSTMENT_DEFINITIONS.find((item) => item.id === id)

    if (!definition) {
      return
    }

    editDocument.value = {
      ...editDocument.value,
      adjustments: {
        ...editDocument.value.adjustments,
        [id]: clamp(value, definition.min, definition.max),
      },
    }
  }

  function resetAdjustment(id: AdjustmentId): void {
    updateAdjustment(id, DEFAULT_ADJUSTMENT_VALUE)
  }

  function setFilter(filter: FilterOperation | null): void {
    editDocument.value = {
      ...editDocument.value,
      filter: filter
        ? {
            ...filter,
            amount: clamp(filter.amount, 0, 1),
          }
        : null,
    }
  }

  async function loadSource(file: File): Promise<void> {
    const validation = validateImageFile(file)

    if (!validation.valid) {
      sourceError.value = validation.message
      return
    }

    const revision = ++loadRevision
    isLoadingSource.value = true
    sourceError.value = null

    try {
      const nextSource = await createImageSource(file)

      if (revision !== loadRevision) {
        revokeImageSource(nextSource)
        return
      }

      revokeImageSource(source.value)
      source.value = nextSource
      isComparingOriginal.value = false
      isCropping.value = false
      resetEdits()
    } catch (error) {
      if (revision === loadRevision) {
        sourceError.value =
          error instanceof Error ? error.message : 'The image could not be loaded.'
      }
    } finally {
      if (revision === loadRevision) {
        isLoadingSource.value = false
      }
    }
  }

  function clearSource(): void {
    loadRevision += 1
    revokeImageSource(source.value)
    source.value = null
    sourceError.value = null
    isLoadingSource.value = false
    isComparingOriginal.value = false
    isCropping.value = false
    resetEdits()
  }

  return {
    source,
    isLoadingSource,
    sourceError,
    editDocument,
    isComparingOriginal,
    isCropping,
    hasImage,
    hasEdits,
    loadSource,
    clearSource,
    resetEdits,
    setComparingOriginal,
    setCrop,
    enterCropMode,
    cancelCropMode,
    applyCrop,
    resetCrop,
    updateAdjustment,
    resetAdjustment,
    setFilter,
  }
})

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { createImageSource, revokeImageSource } from '../services/imageSource'
import type { ImageSource } from '../types/image'
import { validateImageFile } from '../utils/fileValidation'

export const useEditorStore = defineStore('editor', () => {
  const source = ref<ImageSource | null>(null)
  const isLoadingSource = ref(false)
  const sourceError = ref<string | null>(null)
  let loadRevision = 0

  const hasImage = computed(() => source.value !== null)

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
  }

  return {
    source,
    isLoadingSource,
    sourceError,
    hasImage,
    loadSource,
    clearSource,
  }
})

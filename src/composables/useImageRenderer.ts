import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

import { loadImageElement } from '../services/imageLoader'
import { renderImageToCanvas } from '../services/imageRenderer'
import { createRenderScheduler } from '../services/renderScheduler'
import type { ImageSource } from '../types/image'
import type { EditDocument } from '../types/operations'

interface UseImageRendererOptions {
  canvas: Ref<HTMLCanvasElement | null>
  container: Ref<HTMLElement | null>
  source: Ref<ImageSource | null>
  document: Ref<EditDocument>
  showOriginal: Ref<boolean>
}

export function useImageRenderer({
  canvas,
  container,
  source,
  document,
  showOriginal,
}: UseImageRendererOptions) {
  const isRendering = ref(false)
  const renderError = ref<string | null>(null)
  let cachedUrl: string | null = null
  let cachedImage: Promise<HTMLImageElement> | null = null
  let resizeObserver: ResizeObserver | null = null

  function getImage(objectUrl: string): Promise<HTMLImageElement> {
    if (cachedUrl !== objectUrl || !cachedImage) {
      cachedUrl = objectUrl
      cachedImage = loadImageElement(objectUrl)
    }

    return cachedImage
  }

  const scheduler = createRenderScheduler(async ({ isCurrent }) => {
    const currentCanvas = canvas.value
    const currentContainer = container.value
    const currentSource = source.value

    if (!currentSource) {
      cachedUrl = null
      cachedImage = null
      isRendering.value = false
      renderError.value = null
      return
    }

    if (!currentCanvas || !currentContainer) {
      isRendering.value = false
      return
    }

    isRendering.value = true
    renderError.value = null

    try {
      const image = await getImage(currentSource.objectUrl)

      if (!isCurrent()) {
        return
      }

      renderImageToCanvas({
        canvas: currentCanvas,
        image,
        sourceSize: currentSource,
        document: document.value,
        mode: 'preview',
        viewport: {
          width: currentContainer.clientWidth,
          height: currentContainer.clientHeight,
        },
        pixelRatio: window.devicePixelRatio,
        showOriginal: showOriginal.value,
      })
    } catch (error) {
      if (isCurrent()) {
        renderError.value =
          error instanceof Error ? error.message : 'The preview could not be rendered.'
      }
    } finally {
      if (isCurrent()) {
        isRendering.value = false
      }
    }
  })

  watch(
    [canvas, container, () => source.value?.objectUrl, document, showOriginal],
    scheduler.schedule,
    { deep: true, flush: 'post' },
  )

  onMounted(() => {
    resizeObserver = new ResizeObserver(scheduler.schedule)

    if (container.value) {
      resizeObserver.observe(container.value)
    }

    scheduler.schedule()
  })

  watch(container, (nextContainer, previousContainer) => {
    if (previousContainer) {
      resizeObserver?.unobserve(previousContainer)
    }

    if (nextContainer) {
      resizeObserver?.observe(nextContainer)
    }
  })

  onBeforeUnmount(() => {
    scheduler.invalidate()
    resizeObserver?.disconnect()
  })

  return {
    isRendering,
    renderError,
    scheduleRender: scheduler.schedule,
  }
}

import { MAX_PREVIEW_PIXEL_RATIO } from '../constants/renderer'
import type { Size } from '../types/geometry'
import type { EditDocument } from '../types/operations'
import type { RenderMode, RenderResult } from '../types/renderer'
import { clampCropRect, fitSizeWithin, getOutputSize } from '../utils/geometry'

interface RenderImageOptions {
  canvas: HTMLCanvasElement
  image: CanvasImageSource
  sourceSize: Size
  document: EditDocument
  mode: RenderMode
  viewport?: Size
  pixelRatio?: number
  showOriginal?: boolean
}

export function buildCanvasFilter(document: EditDocument, showOriginal = false): string {
  if (showOriginal) {
    return 'none'
  }

  const filters = [
    `brightness(${document.adjustments.brightness * 100}%)`,
    `contrast(${document.adjustments.contrast * 100}%)`,
    `saturate(${document.adjustments.saturation * 100}%)`,
  ]

  if (document.filter) {
    const filterName = document.filter.name === 'greyscale' ? 'grayscale' : 'sepia'
    filters.push(`${filterName}(${document.filter.amount * 100}%)`)
  }

  return filters.join(' ')
}

export function renderImageToCanvas({
  canvas,
  image,
  sourceSize,
  document,
  mode,
  viewport,
  pixelRatio = 1,
  showOriginal = false,
}: RenderImageOptions): RenderResult {
  const crop =
    showOriginal || !document.crop ? null : clampCropRect(document.crop, sourceSize)
  const outputSize = getOutputSize(sourceSize, crop)
  const logicalSize =
    mode === 'preview' ? fitSizeWithin(outputSize, viewport ?? outputSize) : outputSize
  const ratio =
    mode === 'preview' ? Math.min(MAX_PREVIEW_PIXEL_RATIO, Math.max(1, pixelRatio)) : 1
  const bitmapSize = {
    width: Math.max(1, Math.round(logicalSize.width * ratio)),
    height: Math.max(1, Math.round(logicalSize.height * ratio)),
  }

  canvas.width = bitmapSize.width
  canvas.height = bitmapSize.height

  if (mode === 'preview') {
    canvas.style.width = `${logicalSize.width}px`
    canvas.style.height = `${logicalSize.height}px`
  } else {
    canvas.style.removeProperty('width')
    canvas.style.removeProperty('height')
  }

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D rendering is not available in this browser.')
  }

  context.clearRect(0, 0, bitmapSize.width, bitmapSize.height)
  context.filter = buildCanvasFilter(document, showOriginal)
  context.drawImage(
    image,
    crop?.x ?? 0,
    crop?.y ?? 0,
    crop?.width ?? sourceSize.width,
    crop?.height ?? sourceSize.height,
    0,
    0,
    bitmapSize.width,
    bitmapSize.height,
  )

  return { mode, logicalSize, bitmapSize }
}

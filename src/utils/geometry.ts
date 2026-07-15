import type { Rect, Size } from '../types/geometry'
import type { CropOperation } from '../types/operations'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function assertPositiveSize(size: Size, label: string): void {
  if (
    !Number.isFinite(size.width) ||
    !Number.isFinite(size.height) ||
    size.width <= 0 ||
    size.height <= 0
  ) {
    throw new RangeError(`${label} dimensions must be finite positive numbers.`)
  }
}

export function clampCropRect(rect: Rect, source: Size): CropOperation {
  assertPositiveSize(source, 'Source')

  if (
    !Number.isFinite(rect.x) ||
    !Number.isFinite(rect.y) ||
    !Number.isFinite(rect.width) ||
    !Number.isFinite(rect.height)
  ) {
    throw new RangeError('Crop rectangle values must be finite numbers.')
  }

  const sourceWidth = Math.max(1, Math.round(source.width))
  const sourceHeight = Math.max(1, Math.round(source.height))
  const x = clamp(Math.round(rect.x), 0, sourceWidth - 1)
  const y = clamp(Math.round(rect.y), 0, sourceHeight - 1)
  const width = clamp(Math.round(rect.width), 1, sourceWidth - x)
  const height = clamp(Math.round(rect.height), 1, sourceHeight - y)

  return {
    type: 'crop',
    unit: 'source-pixel',
    x,
    y,
    width,
    height,
  }
}

export function getOutputSize(source: Size, crop: CropOperation | null): Size {
  assertPositiveSize(source, 'Source')

  return crop
    ? { width: crop.width, height: crop.height }
    : { width: Math.round(source.width), height: Math.round(source.height) }
}

export function fitSizeWithin(source: Size, container: Size): Size {
  assertPositiveSize(source, 'Source')
  assertPositiveSize(container, 'Container')

  const scale = Math.min(
    container.width / source.width,
    container.height / source.height,
    1,
  )

  return {
    width: Math.max(1, Math.round(source.width * scale)),
    height: Math.max(1, Math.round(source.height * scale)),
  }
}

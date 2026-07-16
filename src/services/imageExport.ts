import { EXPORT_FORMAT } from '../constants/export'
import type { ImageSource } from '../types/image'
import type { EditDocument } from '../types/operations'
import { createSafeFileStem } from '../utils/filename'
import { loadImageElement } from './imageLoader'
import { renderImageToCanvas } from './imageRenderer'

interface ExportImageOptions {
  source: ImageSource
  document: EditDocument
}

export function createExportFilename(sourceName: string): string {
  return `${createSafeFileStem(sourceName)}-${EXPORT_FORMAT.suffix}.${EXPORT_FORMAT.extension}`
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType = EXPORT_FORMAT.mimeType,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('The browser could not encode the exported image.'))
      }
    }, mimeType)
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  try {
    anchor.href = objectUrl
    anchor.download = filename
    anchor.hidden = true
    document.body.append(anchor)
    anchor.click()
  } finally {
    anchor.remove()
    URL.revokeObjectURL(objectUrl)
  }
}

export async function exportEditedImage({
  source,
  document: editDocument,
}: ExportImageOptions): Promise<void> {
  const image = await loadImageElement(source.objectUrl)
  const canvas = document.createElement('canvas')

  renderImageToCanvas({
    canvas,
    image,
    sourceSize: source,
    document: editDocument,
    mode: 'output',
  })

  const blob = await canvasToBlob(canvas)
  downloadBlob(blob, createExportFilename(source.name))
}

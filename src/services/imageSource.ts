import type { ImageSource } from '../types/image'
import { loadImageElement } from './imageLoader'

export async function createImageSource(file: File): Promise<ImageSource> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageElement(objectUrl)

    return {
      file,
      objectUrl,
      name: file.name,
      mimeType: file.type,
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

export function revokeImageSource(source: ImageSource | null): void {
  if (source) {
    URL.revokeObjectURL(source.objectUrl)
  }
}

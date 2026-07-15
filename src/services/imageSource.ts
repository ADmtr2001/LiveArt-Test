import type { ImageSource } from '../types/image'

function decodeImageDimensions(
  objectUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    const cleanup = () => {
      image.onload = null
      image.onerror = null
    }

    image.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = image
      cleanup()

      if (width === 0 || height === 0) {
        reject(new Error('The image has invalid dimensions.'))
        return
      }

      resolve({ width, height })
    }

    image.onerror = () => {
      cleanup()
      reject(
        new Error('The image could not be decoded. It may be damaged or unsupported.'),
      )
    }

    image.decoding = 'async'
    image.src = objectUrl
  })
}

export async function createImageSource(file: File): Promise<ImageSource> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const { width, height } = await decodeImageDimensions(objectUrl)

    return {
      file,
      objectUrl,
      name: file.name,
      mimeType: file.type,
      width,
      height,
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

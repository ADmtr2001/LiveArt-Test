export function loadImageElement(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    const cleanup = () => {
      image.onload = null
      image.onerror = null
    }

    image.onload = () => {
      cleanup()

      if (image.naturalWidth === 0 || image.naturalHeight === 0) {
        reject(new Error('The image has invalid dimensions.'))
        return
      }

      resolve(image)
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

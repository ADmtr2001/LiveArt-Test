import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGE_PIXEL_COUNT,
} from '../constants/image'

export type FileValidationResult = { valid: true } | { valid: false; message: string }

export function validateImageFile(file: File): FileValidationResult {
  if (file.size === 0) {
    return { valid: false, message: 'The selected file is empty.' }
  }

  if (
    !ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])
  ) {
    return {
      valid: false,
      message: 'Choose a JPEG, PNG or WebP image.',
    }
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return {
      valid: false,
      message: 'The image must be smaller than 25 MB.',
    }
  }

  return { valid: true }
}

export function validateDecodedImage(
  width: number,
  height: number,
): FileValidationResult {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return { valid: false, message: 'The image has invalid dimensions.' }
  }

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    return {
      valid: false,
      message: `The image must not exceed ${MAX_IMAGE_DIMENSION.toLocaleString()} px on either side.`,
    }
  }

  if (width * height > MAX_IMAGE_PIXEL_COUNT) {
    return {
      valid: false,
      message: 'The decoded image must not exceed 40 megapixels.',
    }
  }

  return { valid: true }
}

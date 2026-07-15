import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from '../constants/image'

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

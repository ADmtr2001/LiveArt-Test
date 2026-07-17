export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(',')

export const MAX_IMAGE_FILE_SIZE = 25 * 1024 * 1024

export const MAX_IMAGE_DIMENSION = 16_384

export const MAX_IMAGE_PIXEL_COUNT = 40_000_000

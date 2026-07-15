export const EDITOR_LAYOUT = {
  toolbarHeight: 64,
  sidebarWidth: 320,
} as const

export const DEFAULT_ADJUSTMENT_VALUE = 1

export const ADJUSTMENT_DEFINITIONS = [
  { id: 'brightness', label: 'Brightness', min: 0, max: 2 },
  { id: 'contrast', label: 'Contrast', min: 0, max: 2 },
  { id: 'saturation', label: 'Saturation', min: 0, max: 2 },
] as const

export type AdjustmentId = (typeof ADJUSTMENT_DEFINITIONS)[number]['id']

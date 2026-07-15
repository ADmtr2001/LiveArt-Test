export type AdjustmentId = 'brightness' | 'contrast' | 'saturation'

export interface CropOperation {
  type: 'crop'
  unit: 'source-pixel'
  x: number
  y: number
  width: number
  height: number
}

export interface AdjustmentOperation {
  type: 'adjustments'
  brightness: number
  contrast: number
  saturation: number
}

export type FilterName = 'greyscale' | 'sepia'

export interface FilterOperation {
  type: 'filter'
  name: FilterName
  amount: number
}

export type EditOperation = CropOperation | AdjustmentOperation | FilterOperation

export interface EditDocument {
  schemaVersion: 1
  crop: CropOperation | null
  adjustments: AdjustmentOperation
  filter: FilterOperation | null
}

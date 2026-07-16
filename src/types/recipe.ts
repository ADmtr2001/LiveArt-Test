import type { AdjustmentOperation, CropOperation, FilterOperation } from './operations'

export interface RecipeSourceMetadata {
  name: string
  mimeType: string
  width: number
  height: number
}

export interface EditRecipe {
  schemaVersion: 1
  source: RecipeSourceMetadata
  operations: {
    crop: CropOperation | null
    adjustments: AdjustmentOperation
    filter: FilterOperation | null
  }
}

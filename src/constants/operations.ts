import type { AdjustmentOperation, EditDocument } from '../types/operations'
import { DEFAULT_ADJUSTMENT_VALUE } from './editor'

export const EDIT_DOCUMENT_SCHEMA_VERSION = 1 as const

export const DEFAULT_ADJUSTMENTS: Readonly<AdjustmentOperation> = Object.freeze({
  type: 'adjustments',
  brightness: DEFAULT_ADJUSTMENT_VALUE,
  contrast: DEFAULT_ADJUSTMENT_VALUE,
  saturation: DEFAULT_ADJUSTMENT_VALUE,
})

export function createDefaultEditDocument(): EditDocument {
  return {
    schemaVersion: EDIT_DOCUMENT_SCHEMA_VERSION,
    crop: null,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    filter: null,
  }
}

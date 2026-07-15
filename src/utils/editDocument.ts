import { DEFAULT_ADJUSTMENTS, createDefaultEditDocument } from '../constants/operations'
import type { EditDocument } from '../types/operations'

export function hasDocumentEdits(document: EditDocument): boolean {
  return (
    document.crop !== null ||
    document.filter !== null ||
    document.adjustments.brightness !== DEFAULT_ADJUSTMENTS.brightness ||
    document.adjustments.contrast !== DEFAULT_ADJUSTMENTS.contrast ||
    document.adjustments.saturation !== DEFAULT_ADJUSTMENTS.saturation
  )
}

export function cloneEditDocument(document: EditDocument): EditDocument {
  return {
    schemaVersion: document.schemaVersion,
    crop: document.crop ? { ...document.crop } : null,
    adjustments: { ...document.adjustments },
    filter: document.filter ? { ...document.filter } : null,
  }
}

export { createDefaultEditDocument }

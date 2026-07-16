import type { ImageSource } from '../types/image'
import type { EditDocument } from '../types/operations'
import type { EditRecipe } from '../types/recipe'
import { createSafeFileStem } from '../utils/filename'
import { downloadBlob } from './imageExport'

const RECIPE_NUMBER_PRECISION = 4

function normalizeNumber(value: number): number {
  const normalized = Number(value.toFixed(RECIPE_NUMBER_PRECISION))
  return Object.is(normalized, -0) ? 0 : normalized
}

export function createEditRecipe(
  source: ImageSource,
  document: EditDocument,
): EditRecipe {
  return {
    schemaVersion: document.schemaVersion,
    source: {
      name: source.name,
      mimeType: source.mimeType,
      width: Math.round(source.width),
      height: Math.round(source.height),
    },
    operations: {
      crop: document.crop
        ? {
            type: 'crop',
            unit: 'source-pixel',
            x: Math.round(document.crop.x),
            y: Math.round(document.crop.y),
            width: Math.round(document.crop.width),
            height: Math.round(document.crop.height),
          }
        : null,
      adjustments: {
        type: 'adjustments',
        brightness: normalizeNumber(document.adjustments.brightness),
        contrast: normalizeNumber(document.adjustments.contrast),
        saturation: normalizeNumber(document.adjustments.saturation),
      },
      filter: document.filter
        ? {
            type: 'filter',
            name: document.filter.name,
            amount: normalizeNumber(document.filter.amount),
          }
        : null,
    },
  }
}

export function serializeEditRecipe(source: ImageSource, document: EditDocument): string {
  return JSON.stringify(createEditRecipe(source, document), null, 2)
}

export function downloadEditRecipe(source: ImageSource, document: EditDocument): void {
  const json = serializeEditRecipe(source, document)
  const blob = new Blob([json], { type: 'application/json' })
  const filename = `${createSafeFileStem(source.name)}-liveart-recipe.json`
  downloadBlob(blob, filename)
}

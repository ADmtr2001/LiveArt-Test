import { ADJUSTMENT_DEFINITIONS } from '../constants/editor'
import {
  FILTER_DEFINITIONS,
  MAX_FILTER_AMOUNT,
  MIN_FILTER_AMOUNT,
} from '../constants/filters'
import { EDIT_DOCUMENT_SCHEMA_VERSION } from '../constants/operations'
import type { ImageSource } from '../types/image'
import type { EditDocument, FilterName } from '../types/operations'
import type { EditRecipe } from '../types/recipe'
import { createSafeFileStem } from '../utils/filename'
import { downloadBlob } from './imageExport'

const RECIPE_NUMBER_PRECISION = 4
const MAX_RECIPE_FILE_SIZE = 256 * 1024

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireFiniteNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${path} must be a finite number.`)
  }

  return value
}

function requireInteger(value: unknown, path: string): number {
  const parsedValue = requireFiniteNumber(value, path)

  if (!Number.isInteger(parsedValue)) {
    throw new Error(`${path} must be an integer.`)
  }

  return parsedValue
}

function parseRecipe(value: unknown, source: ImageSource): EditDocument {
  if (!isRecord(value) || value.schemaVersion !== EDIT_DOCUMENT_SCHEMA_VERSION) {
    throw new Error('This recipe schema version is not supported.')
  }

  const sourceMetadata = value.source
  if (!isRecord(sourceMetadata)) {
    throw new Error('The recipe source metadata is missing.')
  }

  if (
    sourceMetadata.mimeType !== source.mimeType ||
    sourceMetadata.width !== source.width ||
    sourceMetadata.height !== source.height
  ) {
    throw new Error(
      'This recipe was created for an image with different dimensions or type.',
    )
  }

  const operations = value.operations
  if (!isRecord(operations) || !isRecord(operations.adjustments)) {
    throw new Error('The recipe operations are invalid.')
  }

  const adjustments = operations.adjustments
  if (adjustments.type !== 'adjustments') {
    throw new Error('The recipe adjustments operation is invalid.')
  }

  const parsedAdjustments = Object.fromEntries(
    ADJUSTMENT_DEFINITIONS.map((definition) => {
      const adjustmentValue = requireFiniteNumber(
        adjustments[definition.id],
        `operations.adjustments.${definition.id}`,
      )
      if (adjustmentValue < definition.min || adjustmentValue > definition.max) {
        throw new Error(`operations.adjustments.${definition.id} is out of range.`)
      }
      return [definition.id, adjustmentValue]
    }),
  ) as Pick<EditDocument['adjustments'], 'brightness' | 'contrast' | 'saturation'>

  let crop: EditDocument['crop'] = null
  if (operations.crop !== null) {
    if (
      !isRecord(operations.crop) ||
      operations.crop.type !== 'crop' ||
      operations.crop.unit !== 'source-pixel'
    ) {
      throw new Error('The recipe crop operation is invalid.')
    }

    const x = requireInteger(operations.crop.x, 'operations.crop.x')
    const y = requireInteger(operations.crop.y, 'operations.crop.y')
    const width = requireInteger(operations.crop.width, 'operations.crop.width')
    const height = requireInteger(operations.crop.height, 'operations.crop.height')
    if (
      x < 0 ||
      y < 0 ||
      width <= 0 ||
      height <= 0 ||
      x + width > source.width ||
      y + height > source.height
    ) {
      throw new Error('The recipe crop lies outside the source image.')
    }
    crop = { type: 'crop', unit: 'source-pixel', x, y, width, height }
  }

  let filter: EditDocument['filter'] = null
  if (operations.filter !== null) {
    if (!isRecord(operations.filter) || operations.filter.type !== 'filter') {
      throw new Error('The recipe filter operation is invalid.')
    }
    const name = operations.filter.name
    if (
      typeof name !== 'string' ||
      !FILTER_DEFINITIONS.some((item) => item.id === name)
    ) {
      throw new Error('The recipe filter is not supported.')
    }
    const amount = requireFiniteNumber(
      operations.filter.amount,
      'operations.filter.amount',
    )
    if (amount < MIN_FILTER_AMOUNT || amount > MAX_FILTER_AMOUNT) {
      throw new Error('operations.filter.amount is out of range.')
    }
    filter = { type: 'filter', name: name as FilterName, amount }
  }

  return {
    schemaVersion: EDIT_DOCUMENT_SCHEMA_VERSION,
    crop,
    adjustments: { type: 'adjustments', ...parsedAdjustments },
    filter,
  }
}

export async function importEditRecipe(
  file: File,
  source: ImageSource,
): Promise<EditDocument> {
  if (file.size > MAX_RECIPE_FILE_SIZE) {
    throw new Error('The recipe file is too large.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text()) as unknown
  } catch {
    throw new Error('The selected file is not valid JSON.')
  }

  return parseRecipe(parsed, source)
}

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

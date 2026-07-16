import type { FilterName } from '../types/operations'

interface FilterDefinition {
  id: FilterName
  label: string
}

export const FILTER_DEFINITIONS = [
  { id: 'greyscale', label: 'Greyscale' },
  { id: 'sepia', label: 'Sepia' },
] as const satisfies readonly FilterDefinition[]

export const DEFAULT_FILTER_AMOUNT = 1
export const MIN_FILTER_AMOUNT = 0.1
export const MAX_FILTER_AMOUNT = 1

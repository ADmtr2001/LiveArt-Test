import type { Size } from './geometry'

export type RenderMode = 'preview' | 'output'

export interface RenderResult {
  mode: RenderMode
  logicalSize: Size
  bitmapSize: Size
}

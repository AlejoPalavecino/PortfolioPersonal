import type { Point } from '../domain'
import { DIRT_CELL, DIRT_MASK } from './surface-mask'

export type Surface = 'dirt' | 'grass' | 'wood'

/**
 * Plank area of the bridge, measured on camp-hillside.webp in world coordinates.
 * The walkable boundary currently reaches only its landing, so this mostly guards the rule
 * "wood never raises dust and sounds like wood" if the route is ever extended.
 */
export const BRIDGE: readonly Point[] = [
  { x: 758, y: 440 }, { x: 830, y: 430 }, { x: 955, y: 468 }, { x: 955, y: 503 }, { x: 870, y: 500 }, { x: 770, y: 462 },
]

function inside(point: Point, polygon: readonly Point[]): boolean {
  let result = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!, b = polygon[j]!
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) result = !result
  }
  return result
}

export function surfaceAt(point: Point): Surface {
  if (inside(point, BRIDGE)) return 'wood'
  const row = DIRT_MASK[Math.floor(point.y / DIRT_CELL)]
  return row?.[Math.floor(point.x / DIRT_CELL)] === '1' ? 'dirt' : 'grass'
}

/** Dust is only for bare earth: never on wood, never on grass. */
export function raisesDust(surface: Surface): boolean {
  return surface === 'dirt'
}

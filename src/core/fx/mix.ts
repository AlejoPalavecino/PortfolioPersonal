import type { Point } from '../domain'

/** Landmarks that own an ambient sound, in world coordinates. */
export const FIRE: Point = { x: 251, y: 274 }
export const RIVER: Point = { x: 945, y: 430 }

export type AmbientTargets = { wind: number; water: number; fire: number; panWater: number; panFire: number }

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

/**
 * Target gains (0-1, before user volume) and stereo positions for the ambience layers.
 * Wind is always present; water and fire emerge with proximity. Reading ducks everything.
 * These are targets only: the audio engine glides toward them (setTargetAtTime), so
 * position changes never produce a step in level or direction.
 */
export function ambientTargets(position: Point, reading: boolean): AmbientTargets {
  const duck = reading ? 0.3 : 1
  const altitude = 1 - clamp(position.y / 650)
  const water = 0.1 + 0.9 * clamp(1 - distance(position, RIVER) / 560) ** 1.4
  const fire = 0.06 + 0.94 * clamp(1 - distance(position, FIRE) / 300) ** 1.6
  return {
    wind: duck * (0.5 + 0.25 * altitude),
    water: duck * 0.62 * water,
    fire: duck * 0.5 * fire,
    panWater: clamp((RIVER.x - position.x) / 700, -0.5, 0.5),
    panFire: clamp((FIRE.x - position.x) / 700, -0.5, 0.5),
  }
}

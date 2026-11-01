/**
 * Pure locomotion rules for the avatar. Nothing here touches the DOM, so the same
 * numbers drive the world, the loading vignette and the unit tests.
 *
 * Geometry notes (see docs/AUDIOVISUAL.md, "Sprites"):
 * - Walk frames 1 and 3 are the contact poses (feet furthest apart) and 2 and 4 the passing poses.
 * - Heel-to-heel spread of a contact pose is about 28 world px, so one step (two frames) must
 *   advance the body about 30 px or the planted foot visibly slides.
 */
export type Direction = 'down' | 'left' | 'right' | 'up'
export type Vector = Readonly<{ x: number; y: number }>

export const WALK_SPEED = 140
export const STRIDE_PER_FRAME = 15
export const ACCEL_MS = 90
export const DECEL_MS = 110
/** Below this speed the avatar is considered standing, so it never glides on an idle pose. */
export const MIN_MOVING_SPEED = 12
const HYSTERESIS = 1.35

/** Linear ramp toward a target speed. Short on purpose: control must stay precise. */
export function approachSpeed(speed: number, target: number, elapsedMs: number): number {
  const rate = WALK_SPEED / (target > speed ? ACCEL_MS : DECEL_MS) * Math.max(0, elapsedMs)
  return target > speed ? Math.min(target, speed + rate) : Math.max(target, speed - rate)
}

/** Largest speed from which the avatar can still stop within `remaining` px using the standard deceleration. */
export function brakingSpeed(remaining: number): number {
  const deceleration = WALK_SPEED / (DECEL_MS / 1000)
  return Math.max(MIN_MOVING_SPEED * 2, Math.sqrt(2 * deceleration * Math.max(0, remaining)))
}

/** Unit vector, or zero. Diagonal input therefore never exceeds the straight-line speed. */
export function normalize(x: number, y: number): Vector {
  const length = Math.hypot(x, y)
  return length < 1e-9 ? { x: 0, y: 0 } : { x: x / length, y: y / length }
}

/**
 * Four-way facing with hysteresis: the avatar only swaps between horizontal and vertical
 * once the new axis clearly dominates, which removes flicker on diagonals and path corners.
 */
export function facing(previous: Direction, x: number, y: number): Direction {
  const ax = Math.abs(x), ay = Math.abs(y)
  if (ax < 1e-6 && ay < 1e-6) return previous
  const horizontal = previous === 'left' || previous === 'right'
  const useHorizontal = horizontal ? ax * HYSTERESIS >= ay : ax > ay * HYSTERESIS
  if (useHorizontal) return x < 0 ? 'left' : 'right'
  return y < 0 ? 'up' : 'down'
}

/** Exponential smoothing for the heading vector (time constant in ms). */
export function smoothHeading(heading: Vector, target: Vector, elapsedMs: number, timeConstantMs = 70): Vector {
  const alpha = 1 - Math.exp(-Math.max(0, elapsedMs) / timeConstantMs)
  return { x: heading.x + (target.x - heading.x) * alpha, y: heading.y + (target.y - heading.y) * alpha }
}

/** Walk frame (0-3) derived from travelled distance, never from wall-clock time. */
export function walkFrame(distance: number): number {
  return Math.floor(Math.max(0, distance) / STRIDE_PER_FRAME) % 4
}

/** Contact frames land at indices 0 and 2: returns how many footfalls happened between two distances. */
export function footfalls(from: number, to: number): { count: number; foot: 'left' | 'right' } {
  const index = (distance: number) => Math.floor((Math.max(0, distance) + STRIDE_PER_FRAME) / (STRIDE_PER_FRAME * 2))
  const before = index(from), after = index(to)
  return { count: Math.max(0, after - before), foot: after % 2 === 0 ? 'left' : 'right' }
}

export function frameName(direction: Direction, moving: boolean, distance: number): string {
  return moving ? `walk-${direction}-${walkFrame(distance) + 1}` : `idle-${direction}`
}

import { WORLD, createNavigation, reduceNavigation, findPath, isWalkable, moveSafely, nearbySection } from '../core/domain'
import type { Point } from '../core/domain'
import type { Section } from '../entities'
import type { CueBus } from '../core/fx/cues'
import { WALK_SPEED, MIN_MOVING_SPEED, approachSpeed, brakingSpeed, facing, footfalls, normalize, smoothHeading, type Direction, type Vector } from '../core/fx/gait'
import { surfaceAt } from '../core/fx/surface'
import type { Loop } from './loop'

type State = ReturnType<typeof createNavigation>
type Event = Parameters<typeof reduceNavigation>[1]
/** What the renderer needs to draw the avatar. `distance` drives the walk cycle so feet never slide. */
export type Pose = { moving: boolean; direction: Direction; distance: number }
type StopReason = 'arrive' | 'cancel' | 'release' | 'pause' | 'open' | 'replace'

const stopReasons: Partial<Record<Event['type'], StopReason>> = { arrive: 'arrive', cancel: 'cancel', pause: 'pause', 'open-now': 'open', restore: 'open', camp: 'open', 'open-project': 'open', 'back-projects': 'open', 'route-failed': 'open' }

/**
 * Owns the avatar's logical position and locomotion. Position and collisions live here and in
 * the domain; the renderer only reads them. Everything runs on the shared frame loop.
 */
export function createController(render: (state: State, pose: Pose) => void, loop?: Loop, bus?: CueBus) {
  let state = createNavigation(WORLD.spawn), path: Point[] = [], routeId = -1
  let direction: Direction = 'down', moving = false, speed = 0, travelled = 0
  let heading: Vector = { x: 0, y: 1 }, lastDirection: Vector = { x: 0, y: 1 }, input: Vector = { x: 0, y: 0 }
  let stopReason: StopReason = 'release', mode: 'route' | 'manual' = 'route'
  const pose = (): Pose => ({ moving, direction, distance: travelled })

  const dispatch = (event: Event) => {
    const before = state
    state = reduceNavigation(state, event)
    const reason = stopReasons[event.type]
    if (reason) stopReason = reason
    if (event.type !== 'move' && event.type !== 'pause' && event.type !== 'resume' && before.route && state.route?.id !== before.route.id && event.type !== 'arrive') {
      const why = event.type === 'cancel' ? 'cancel' : event.type === 'manual' ? 'manual' : event.type === 'select-section' || event.type === 'select-ground' ? 'replace' : 'open'
      path = []; routeId = -1
      bus?.emit('route-cancel', { reason: why })
      if (why === 'replace') stopReason = 'replace'
    }
    const keeps = event.type === 'select-section' || event.type === 'select-ground' || event.type === 'set-scene' || event.type === 'set-motion'
    if (event.type !== 'move' && !keeps) setMoving(false, true)
    else if (moving && mode === 'route' && !state.route) setMoving(false, true)
    render(state, pose())
  }
  const setMoving = (value: boolean, immediate = false) => {
    if (immediate && value === false) { speed = 0 }
    if (value === moving) return
    moving = value
    if (value) { travelled = 0; bus?.emit('move-start', { mode }) }
    else bus?.emit('move-stop', { reason: stopReason })
  }
  const prepare = () => {
    if (!state.route || state.route.id === routeId) return
    routeId = state.route.id
    const target = state.route.target.kind === 'section' ? WORLD.arrivals[state.route.target.section].point : state.route.target.point
    path = findPath(WORLD, state.position, target) ?? []
    if (!path.length) { dispatch({ type: 'route-failed', id: routeId }); return }
    path.shift()
    mode = 'route'
    if (state.route.target.kind === 'section') bus?.emit('destination-selected', { section: state.route.target.section, point: target, path: [state.position, ...path] })
  }
  const remaining = () => {
    let total = 0, from = state.position
    for (const point of path) { total += Math.hypot(point.x - from.x, point.y - from.y); from = point }
    return total
  }
  const arrive = (id: number) => {
    const target = state.route?.target
    const point = state.position
    direction = 'up'
    dispatch({ type: 'arrive', id, position: state.position })
    bus?.emit('arrive', { section: target?.kind === 'section' ? target.section : null, point })
  }
  /** Integrates one frame. Route following and manual input share the same speed ramp. */
  const frame = (_time: number, elapsedMs: number) => {
    prepare()
    const route = state.route
    let desired: Vector = { x: 0, y: 0 }, target = 0
    if (route?.status === 'active' && path.length) {
      const next = path[0]!
      desired = normalize(next.x - state.position.x, next.y - state.position.y); lastDirection = desired
      target = Math.min(WALK_SPEED, brakingSpeed(remaining()))
    } else if (!route && (input.x || input.y)) {
      desired = normalize(input.x, input.y); lastDirection = desired; mode = 'manual'; target = WALK_SPEED
    } else if (speed > 0) {
      desired = lastDirection
    }
    speed = approachSpeed(speed, target, elapsedMs)
    if (target === 0 && speed < MIN_MOVING_SPEED) speed = 0
    if (route?.status === 'active' && !path.length && routeId === route.id) { arrive(route.id); return }
    if (speed <= 0) { if (moving) setMoving(false); return }
    const before = state.position
    let next: Point
    if (route?.status === 'active') {
      let budget = speed * elapsedMs / 1000, position = before
      while (budget > 1e-6 && path.length) {
        const waypoint = path[0]!, distance = Math.hypot(waypoint.x - position.x, waypoint.y - position.y)
        if (distance <= budget) { position = waypoint; budget -= distance; path.shift() }
        else { position = { x: position.x + (waypoint.x - position.x) / distance * budget, y: position.y + (waypoint.y - position.y) / distance * budget }; budget = 0 }
      }
      next = position
    } else {
      const step = speed * elapsedMs / 1000
      next = moveSafely(WORLD, before, { x: desired.x * step, y: desired.y * step })
    }
    const moved = Math.hypot(next.x - before.x, next.y - before.y)
    if (moved < 1e-4) { speed = 0; if (moving) setMoving(false); return }
    if (!moving) { stopReason = 'release'; heading = desired; setMoving(true) }
    heading = smoothHeading(heading, desired, elapsedMs)
    direction = facing(direction, heading.x, heading.y)
    const previousDistance = travelled
    travelled += moved
    state = reduceNavigation(state, { type: 'move', position: next })
    const steps = footfalls(previousDistance, travelled)
    if (steps.count > 0 && bus) bus.emit('step', { foot: steps.foot, surface: surfaceAt(next), point: next })
    render(state, pose())
  }
  const off = loop?.add(frame)

  return {
    dispatch, get state() { return state }, get path(): readonly Point[] { return path }, get pose() { return pose() },
    select(section: Section) {
      const arrival = WORLD.arrivals[section]
      const arrived = Math.hypot(state.position.x - arrival.point.x, state.position.y - arrival.point.y) <= arrival.radius
      dispatch({ type: 'select-section', section, arrived })
      if (arrived) bus?.emit('arrive', { section, point: state.position })
    },
    ground(point: Point) {
      if (!isWalkable(WORLD, point)) return false
      dispatch({ type: 'select-ground', point })
      if (state.route?.target.kind === 'ground') bus?.emit('ground-tap', { point })
      return true
    },
    /** Held movement direction (not normalised): diagonals are normalised here so they are never faster. */
    setInput(x: number, y: number) {
      input = { x: Math.sign(x), y: Math.sign(y) }
      if ((input.x || input.y) && state.route) dispatch({ type: 'manual' })
      if (input.x || input.y) direction = facing(direction, input.x, input.y)
    },
    stopManual() { input = { x: 0, y: 0 } },
    /** Turn in place (entry gesture). Ignored while walking so it can never fight an order. */
    face(next: Direction) { if (!moving && !state.route && !(input.x || input.y)) { direction = next; render(state, pose()) } },
    interact() {
      const section = nearbySection(WORLD, state.position)
      if (!section) return
      dispatch({ type: 'select-section', section, arrived: true })
      bus?.emit('arrive', { section, point: state.position })
    },
    dispose() { off?.() },
  }
}

import { WORLD, createNavigation, reduceNavigation, findPath, isWalkable, moveSafely, nearbySection } from '../core/domain'
import type { Point } from '../core/domain'
import type { Section } from '../entities'

type State = ReturnType<typeof createNavigation>
type Event = Parameters<typeof reduceNavigation>[1]
export function createController(render: (state: State, moving: boolean, direction: string) => void) {
  let state = createNavigation(WORLD.spawn), path: Point[] = [], routeId = -1, last = 0
  let direction = 'down', moving = false
  const dispatch = (event: Event) => {
    state = reduceNavigation(state, event)
    if (event.type !== 'move') moving = false
    render(state, moving, direction)
  }
  const prepare = () => {
    if (!state.route || state.route.id === routeId) return
    routeId = state.route.id
    const target = state.route.target.kind === 'section' ? WORLD.arrivals[state.route.target.section].point : state.route.target.point
    path = findPath(WORLD, state.position, target) ?? []
    if (!path.length) dispatch({ type: 'route-failed', id: routeId })
    else path.shift()
  }
  const tick = (time: number) => {
    const elapsed = last ? Math.min((time - last) / 1000, .05) : 0; last = time
    prepare()
    if (state.route?.status === 'active') advance(elapsed)
    requestAnimationFrame(tick)
  }
  const advance = (elapsed: number) => {
    const route = state.route, next = path[0]
    if (!route) return
    if (!next) { moving = false; direction = 'up'; dispatch({ type: 'arrive', id: route.id, position: state.position }); return }
    const dx = next.x - state.position.x, dy = next.y - state.position.y, distance = Math.hypot(dx, dy)
    direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
    moving = true
    const step = Math.min(distance, 190 * elapsed)
    dispatch({ type: 'move', position: { x: state.position.x + dx / (distance || 1) * step, y: state.position.y + dy / (distance || 1) * step } })
    if (step >= distance) path.shift()
  }
  requestAnimationFrame(tick)
  return {
    dispatch, get state() { return state },
    select(section: Section) { const arrival = WORLD.arrivals[section]; const arrived = Math.hypot(state.position.x - arrival.point.x, state.position.y - arrival.point.y) <= arrival.radius; dispatch({ type: 'select-section', section, arrived }) },
    ground(point: Point) { if (isWalkable(WORLD, point)) dispatch({ type: 'select-ground', point }); else return false; return true },
    manual(dx: number, dy: number) {
      if (state.route) dispatch({ type: 'manual' })
      direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
      moving = true; dispatch({ type: 'move', position: moveSafely(WORLD, state.position, { x: dx, y: dy }) })
    },
    stopManual() { moving = false; render(state, moving, direction) },
    interact() { const section = nearbySection(WORLD, state.position); if (section) dispatch({ type: 'select-section', section, arrived: true }) },
  }
}


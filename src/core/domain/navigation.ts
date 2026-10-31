import type { Navigation, NavigationEvent, Point, Route, Target, View } from './types'

export function createNavigation(position: Point): Navigation {
  return { position, view: { kind: 'camp' }, route: null, visited: [], scene: 'loading', reducedMotion: false, revision: 0 }
}

function openTarget(state: Navigation, target: Target): Navigation {
  if (target.kind === 'ground') return { ...state, view: { kind: 'camp' }, route: null, revision: state.revision + (state.route ? 1 : 0) }
  if (!state.route && state.view.kind === 'section' && state.view.section === target.section) return state
  const visited = state.visited.includes(target.section) ? state.visited : [...state.visited, target.section]
  return { ...state, view: { kind: 'section', section: target.section }, visited, route: null, revision: state.revision + (state.route ? 1 : 0) }
}

function selectTarget(state: Navigation, target: Target): Navigation {
  if (target.kind === 'section' && ((state.route?.target.kind === 'section' && state.route.target.section === target.section) || (!state.route && state.view.kind === 'section' && state.view.section === target.section))) return state
  if (state.scene !== 'ready' || state.reducedMotion) return openTarget(state, target)
  const route: Route = { id: state.revision + 1, target, origin: state.route?.origin ?? state.view, status: 'active' }
  return { ...state, route, revision: route.id, view: { kind: 'camp' } }
}

function restore(state: Navigation, view: View): Navigation {
  const section = view.kind === 'section' ? view.section
    : view.kind === 'recognitions' || view.kind === 'credential' ? 'journey' : null
  const visited = section && !state.visited.includes(section) ? [...state.visited, section] : state.visited
  return { ...state, view, visited, route: null, revision: state.revision + (state.route ? 1 : 0) }
}

export function reduceNavigation(state: Navigation, event: NavigationEvent): Navigation {
  switch (event.type) {
    case 'set-scene': {
      const next = { ...state, scene: event.scene }
      return event.scene !== 'ready' && state.route ? openTarget(next, state.route.target) : next
    }
    case 'set-motion': {
      const next = { ...state, reducedMotion: event.reduced }
      return event.reduced && state.route ? openTarget(next, state.route.target) : next
    }
    case 'select-section': return event.arrived ? openTarget(state, { kind: 'section', section: event.section }) : selectTarget(state, { kind: 'section', section: event.section })
    case 'select-ground': return state.view.kind === 'camp' && state.scene === 'ready' && !state.reducedMotion ? selectTarget(state, { kind: 'ground', point: event.point }) : state
    case 'move': return { ...state, position: event.position }
    case 'arrive': return state.route?.id === event.id && state.route.status === 'active' ? openTarget({ ...state, position: event.position }, state.route.target) : state
    case 'route-failed': return state.route?.id === event.id ? openTarget(state, state.route.target) : state
    case 'pause': return state.route ? { ...state, route: { ...state.route, status: 'paused' } } : state
    case 'resume': return state.route ? { ...state, route: { ...state.route, status: 'active' } } : state
    case 'cancel': return state.route ? restore(state, state.route.origin) : state
    case 'open-now': return state.route?.target.kind === 'section' ? openTarget(state, state.route.target) : state
    case 'manual': return restore(state, { kind: 'camp' })
    case 'open-project': return restore(state, { kind: 'project', project: event.project })
    case 'back-projects': return openTarget(state, { kind: 'section', section: 'projects' })
    case 'camp': return restore(state, { kind: 'camp' })
    case 'restore': return restore(state, event.view)
  }
}

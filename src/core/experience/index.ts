export type ExperiencePhase = 'intro' | 'loading' | 'ready' | 'explore' | 'read' | 'direct'
export type Experience = { phase: ExperiencePhase; preparation: 'idle' | 'loading' | 'ready' | 'failed'; entered: boolean; direct: boolean; generation: number; slow: boolean; overlay: 'none' | 'menu' | 'help' | 'settings'; reducedMotion: boolean }
export type ExperienceEvent =
  | { type: 'load-start' | 'load-ready' | 'load-failed' | 'load-slow'; generation: number }
  | { type: 'enter' | 'read' | 'camp' | 'direct' }
  | { type: 'overlay'; overlay: Experience['overlay'] }
  | { type: 'set-motion'; reduced: boolean }

export function createExperience(options: { entered?: boolean; direct?: boolean; reducedMotion?: boolean } = {}): Experience {
  return { phase: options.direct ? 'direct' : 'intro', preparation: 'idle', entered: options.entered ?? false, direct: options.direct ?? false, generation: 0, slow: false, overlay: 'none', reducedMotion: options.reducedMotion ?? false }
}

function loadReady(state: Experience): Experience {
  const phase = state.phase === 'direct' || state.phase === 'read' ? state.phase : state.entered ? 'explore' : 'ready'
  return { ...state, preparation: 'ready', phase, slow: false }
}

function loadFailed(state: Experience): Experience {
  const phase = state.phase === 'read' ? 'read' : 'direct'
  return { ...state, preparation: 'failed', phase, direct: true, slow: false }
}

export function reduceExperience(state: Experience, event: ExperienceEvent): Experience {
  switch (event.type) {
    case 'load-start': return event.generation > state.generation ? { ...state, generation: event.generation, preparation: 'loading', slow: false, phase: state.phase === 'direct' || state.phase === 'read' ? state.phase : 'loading' } : state
    case 'load-ready': return event.generation === state.generation && state.preparation === 'loading' ? loadReady(state) : state
    case 'load-failed': return event.generation === state.generation ? loadFailed(state) : state
    case 'load-slow': return event.generation === state.generation && state.preparation === 'loading' ? { ...state, slow: true } : state
    case 'enter': return state.preparation === 'ready' ? { ...state, phase: 'explore', entered: true, direct: false } : state
    case 'read': return state.phase === 'direct' ? state : { ...state, phase: 'read', overlay: 'none' }
    case 'camp': return { ...state, phase: state.direct || state.preparation === 'failed' ? 'direct' : 'explore', overlay: 'none' }
    case 'direct': return { ...state, phase: 'direct', direct: true, overlay: 'none' }
    case 'overlay': return { ...state, overlay: event.overlay }
    case 'set-motion': return { ...state, reducedMotion: event.reduced }
  }
}

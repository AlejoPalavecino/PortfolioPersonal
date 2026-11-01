import type { Section, View as DomainView } from '../domain'

export type ExperiencePhase = 'intro' | 'loading' | 'ready' | 'explore' | 'read' | 'direct'
export type SceneStage = 'preparing' | 'intro' | 'exploring' | 'routing' | 'entering' | 'room-loading' | 'interior' | 'exiting'
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

export function effectiveReducedMotion(system: boolean, user: boolean): boolean { return system || user }

export function roomForView(view: DomainView | { kind: 'case'; id: string }): Section | null {
  if (view.kind === 'camp') return null
  if (view.kind === 'section') return view.section
  if (view.kind === 'project' || view.kind === 'case') return 'projects'
  if (view.kind === 'recognitions' || view.kind === 'credential') return 'journey'
  return null
}

export const INTRO_DURATION_MS = 6800

export type IntroBeatSnapshot = {
  elapsedMs: number
  beatIndex: 0 | 1 | 2 | 3 | 4
  action: 'landscape-reveal' | 'walk-right' | 'idle-down' | 'crossfade-to-existing-world'
  title: string
  subtitle: string
  specialty: string
  actorFrame: string
  actorXPercent: number
  actorYPercent: number
  actorVisible: boolean
  crossfade: number
  completed: boolean
}

export function sampleIntroTimeline(rawElapsedMs: number): IntroBeatSnapshot {
  const elapsedMs = Math.max(0, Math.min(INTRO_DURATION_MS, rawElapsedMs))
  const specialty = 'Full stack · Análisis · Automatización e IA'
  if (elapsedMs < 1200) {
    return {
      elapsedMs,
      beatIndex: 0,
      action: 'landscape-reveal',
      title: 'Campamento creativo',
      subtitle: '',
      specialty,
      actorFrame: 'idle-right',
      actorXPercent: 6,
      actorYPercent: 91,
      actorVisible: elapsedMs >= 450,
      crossfade: 0,
      completed: false,
    }
  }
  if (elapsedMs < 2800) {
    const walkElapsed = elapsedMs - 1200
    const u = Math.max(0, Math.min(1, walkElapsed / 1600))
    const stepIndex = (Math.floor(walkElapsed / 130) % 4) + 1
    return {
      elapsedMs,
      beatIndex: 1,
      action: 'walk-right',
      title: 'Campamento creativo',
      subtitle: '',
      specialty,
      actorFrame: `walk-right-${stepIndex}`,
      actorXPercent: 6 + 22 * u,
      actorYPercent: 91,
      actorVisible: true,
      crossfade: 0,
      completed: false,
    }
  }
  if (elapsedMs < 4800) {
    return {
      elapsedMs,
      beatIndex: 2,
      action: 'idle-down',
      title: 'Soy Alejo Palavecino.',
      subtitle: specialty,
      specialty,
      actorFrame: 'idle-down',
      actorXPercent: 28,
      actorYPercent: 91,
      actorVisible: true,
      crossfade: 0,
      completed: false,
    }
  }
  if (elapsedMs < 6200) {
    return {
      elapsedMs,
      beatIndex: 3,
      action: 'idle-down',
      title: 'Soy Alejo Palavecino.',
      subtitle: 'Desarrollo software. Transformo ideas en productos.',
      specialty,
      actorFrame: 'idle-down',
      actorXPercent: 28,
      actorYPercent: 91,
      actorVisible: true,
      crossfade: 0,
      completed: false,
    }
  }
  const crossfade = Math.max(0, Math.min(1, (elapsedMs - 6200) / 600))
  return {
    elapsedMs,
    beatIndex: 4,
    action: 'crossfade-to-existing-world',
    title: 'Explorá mi trabajo.',
    subtitle: 'Desarrollo software. Transformo ideas en productos.',
    specialty,
    actorFrame: 'idle-down',
    actorXPercent: 28,
    actorYPercent: 91,
    actorVisible: true,
    crossfade,
    completed: elapsedMs >= INTRO_DURATION_MS,
  }
}


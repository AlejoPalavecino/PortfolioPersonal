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

/**
 * Five-beat, non-blocking prologue. Its clock is narrative only: scene preparation
 * is counted separately, and completing the story never launches the game.
 */
export const INTRO_DURATION_MS = 7800

export type IntroBeatSnapshot = {
  elapsedMs: number
  beatIndex: 0 | 1 | 2 | 3 | 4
  action: 'landscape-reveal' | 'walk-right' | 'idle-down' | 'invite'
  title: string
  subtitle: string
  specialty: string
  actorFrame: string
  actorXPercent: number
  actorYPercent: number
  actorVisible: boolean
  crossfade: number
  storyProgress: number
  cameraScale: number
  cameraShiftPercent: number
  skyLight: number
  completed: boolean
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const progress = (time: number, start: number, end: number) => clamp01((time - start) / (end - start))

export function sampleIntroTimeline(rawElapsedMs: number): IntroBeatSnapshot {
  const elapsedMs = Number.isFinite(rawElapsedMs) ? Math.max(0, Math.min(INTRO_DURATION_MS, rawElapsedMs)) : 0
  const advance = elapsedMs / INTRO_DURATION_MS
  const specialty = 'Full Stack · Análisis funcional · Automatización e IA'
  const shared = {
    elapsedMs,
    specialty,
    storyProgress: advance,
    cameraScale: 1.065 - 0.065 * advance,
    cameraShiftPercent: -1.4 * advance,
    skyLight: 0.32 + 0.48 * progress(elapsedMs, 0, 6800),
    actorYPercent: 91,
    crossfade: progress(elapsedMs, 6700, INTRO_DURATION_MS),
    completed: elapsedMs >= INTRO_DURATION_MS,
  }

  if (elapsedMs < 1200) return {
    ...shared,
    beatIndex: 0,
    action: 'landscape-reveal',
    title: 'Las ideas necesitan un camino.',
    subtitle: 'Cada proyecto comienza con una necesidad real.',
    actorFrame: 'idle-right',
    actorXPercent: 6,
    actorVisible: elapsedMs >= 320,
  }
  if (elapsedMs < 3300) {
    const u = progress(elapsedMs, 1200, 3300)
    return {
      ...shared,
      beatIndex: 1,
      action: 'walk-right',
      title: 'Primero entender. Después construir.',
      subtitle: 'Analizar el problema es parte de encontrar la solución.',
      actorFrame: 'walk-right-' + (Math.floor((elapsedMs - 1200) / 135) % 4 + 1),
      actorXPercent: 6 + 24 * u,
      actorVisible: true,
    }
  }
  if (elapsedMs < 5100) return {
    ...shared,
    beatIndex: 2,
    action: 'idle-down',
    title: 'Soy Alejo Palavecino.',
    subtitle: 'Desarrollador Full Stack y estudiante de Ingeniería en Sistemas en la UTN.',
    actorFrame: 'idle-down',
    actorXPercent: 30,
    actorVisible: true,
  }
  if (elapsedMs < 6700) return {
    ...shared,
    beatIndex: 3,
    action: 'idle-down',
    title: 'De la idea al producto.',
    subtitle: 'Análisis funcional, desarrollo y tecnologías de IA con propósito.',
    actorFrame: 'idle-down',
    actorXPercent: 30,
    actorVisible: true,
  }
  return {
    ...shared,
    beatIndex: 4,
    action: 'invite',
    title: 'Te invito a recorrer mi trabajo.',
    subtitle: 'Explorá el campamento o consultá directamente los proyectos.',
    actorFrame: 'idle-down',
    actorXPercent: 30,
    actorVisible: true,
  }
}

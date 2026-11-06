import { CAMP_SCENERY } from '../camp-scenery'
import { validateFrames } from './frames'
import { localizeText } from '../locale-copy'
import type { SpriteFrame } from './frames'
export type { SpriteFrame } from './frames'

export type ScenePreparation = {
  generation: number
  status: 'idle' | 'loading' | 'ready' | 'failed'
  completed: number
  total: number
  timedOut: boolean
  error: string | null
  frames: readonly SpriteFrame[]
  task?: string
}
export type ScenePorts = { metadata(): Promise<unknown>; image(file: string): Promise<void>; navigation(): Promise<void> }

/**
 * Only assets needed to display the camp and place its idle avatar block entry.
 * Once the visitor enters, warm the remaining movement frames in the background.
 * The world reveals its destinations when exploration begins.
 */
export const INITIAL_SCENE_TASKS = 5
const essentialImages = [CAMP_SCENERY.ground, CAMP_SCENERY.backdrop, 'avatar/idle-down.webp'] as const
const labels = {
  paths: 'Trazando los caminos',
  scenery: 'Cargando el paisaje',
  character: 'Preparando los movimientos de Alejo',
} as const

export function createSceneLoader(ports: ScenePorts, onChange: (state: ScenePreparation) => void, timeoutMs = 8000) {
  let state: ScenePreparation = {
    generation: 0, status: 'idle', completed: 0,
    total: INITIAL_SCENE_TASKS, timedOut: false, error: null, frames: [],
  }
  let timer: ReturnType<typeof setTimeout> | undefined
  let prefetchedGeneration = 0
  let disposed = false

  const active = (generation: number) =>
    !disposed && generation === state.generation && state.status === 'loading'
  const publish = (change: Partial<ScenePreparation>) => {
    if (disposed) return
    state = { ...state, ...change }
    onChange(state)
  }
  const clear = () => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
  }

  /** At most two extra image decodes at a time, with no effect on readiness. */
  const prefetchMovement = () => {
    const generation = state.generation
    if (disposed || state.status !== 'ready' || generation === prefetchedGeneration) return
    prefetchedGeneration = generation
    const queue = state.frames.filter(frame => frame.name !== 'idle-down').map(frame => `avatar/${frame.name}.webp`)
    let nextIndex = 0
    const next = () => {
      if (disposed || state.generation !== generation || state.status !== 'ready') return
      const file = queue[nextIndex++]
      if (!file) return
      void Promise.resolve().then(() => ports.image(file)).catch(() => {
        // Optional images must not block access; the normal img element can retry.
      }).then(next)
    }
    next()
    next()
  }

  const complete = (generation: number, label: string) => {
    if (!active(generation)) return
    const completed = state.completed + 1
    if (completed === state.total) {
      if (timer !== undefined) clearTimeout(timer)
      timer = undefined
      publish({ completed, status: 'ready', task: 'Listo para explorar' })
    } else {
      publish({ completed, task: localizeText(label) })
    }
  }
  const fail = (generation: number, error: unknown) => {
    if (!active(generation)) return
    clear()
    publish({ status: 'failed', error: error instanceof Error ? error.message : String(error) })
  }
  const run = (generation: number, label: string, operation: () => Promise<void>) => {
    void Promise.resolve().then(operation).then(
      () => complete(generation, label),
      error => fail(generation, error),
    )
  }
  const startGeneration = () => {
    if (disposed) return
    clear()
    const generation = state.generation + 1
    publish({
      generation, status: 'loading', completed: 0, timedOut: false,
      error: null, frames: [], total: INITIAL_SCENE_TASKS, task: localizeText(labels.paths),
    })
    timer = setTimeout(() => {
      if (active(generation)) publish({ timedOut: true })
    }, timeoutMs)
    run(generation, labels.paths, () => ports.navigation())
    for (const file of essentialImages) run(generation, labels.scenery, () => ports.image(file))
    void Promise.resolve().then(() => ports.metadata()).then(value => {
      if (!active(generation)) return
      const frames = validateFrames(value)
      publish({ frames })
      complete(generation, labels.character)
    }).catch(error => fail(generation, error))
  }
  return {
    get state() { return state },
    start() { if (state.status === 'idle') startGeneration() },
    retry() { startGeneration() },
    prefetchMovement,
    dispose() { disposed = true; clear() },
  }
}

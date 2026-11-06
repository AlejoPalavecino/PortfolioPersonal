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
 * The remaining sprites are fetched in the background; the browser also requests
 * visible world elements directly through their markup.
 */
export const INITIAL_SCENE_TASKS = 5
const essentialImages = ['camp-hillside.webp', 'world-backdrop.webp', 'avatar/idle-down.webp'] as const
const deferredImages = ['poi-projects.webp', 'poi-about.webp', 'poi-journey.webp', 'poi-contact.webp'] as const
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
  let deferredTimer: ReturnType<typeof setTimeout> | undefined
  let disposed = false
  let framesForPrefetch: readonly SpriteFrame[] = []

  const active = (generation: number) =>
    !disposed && generation === state.generation && state.status === 'loading'
  const publish = (change: Partial<ScenePreparation>) => {
    if (disposed) return
    state = { ...state, ...change }
    onChange(state)
  }
  const clear = () => {
    if (timer !== undefined) clearTimeout(timer)
    if (deferredTimer !== undefined) clearTimeout(deferredTimer)
    timer = undefined
    deferredTimer = undefined
  }

  /** At most two extra image decodes at a time, with no effect on readiness. */
  const prefetchAfterReady = (generation: number) => {
    const queue = [
      ...deferredImages,
      ...framesForPrefetch.filter(frame => frame.name !== 'idle-down').map(frame => `avatar/${frame.name}.webp`),
    ]
    let nextIndex = 0
    const next = () => {
      if (disposed || state.generation !== generation || state.status !== 'ready') return
      const file = queue[nextIndex++]
      if (!file) return
      void Promise.resolve().then(() => ports.image(file)).catch(() => {
        // Optional images must not block access; the normal img element can retry.
      }).then(next)
    }
    deferredTimer = setTimeout(() => {
      if (disposed || state.generation !== generation || state.status !== 'ready') return
      next()
      next()
    }, 900)
  }

  const complete = (generation: number, label: string) => {
    if (!active(generation)) return
    const completed = state.completed + 1
    if (completed === state.total) {
      if (timer !== undefined) clearTimeout(timer)
      timer = undefined
      publish({ completed, status: 'ready', task: 'Listo para explorar' })
      prefetchAfterReady(generation)
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
    framesForPrefetch = []
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
      framesForPrefetch = frames
      publish({ frames })
      complete(generation, labels.character)
    }).catch(error => fail(generation, error))
  }
  return {
    get state() { return state },
    start() { if (state.status === 'idle') startGeneration() },
    retry() { startGeneration() },
    dispose() { disposed = true; clear() },
  }
}

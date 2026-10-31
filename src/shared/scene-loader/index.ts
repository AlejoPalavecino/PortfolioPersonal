import { validateFrames } from './frames'
import type { SpriteFrame } from './frames'
export type { SpriteFrame } from './frames'

export type ScenePreparation = { generation: number; status: 'idle' | 'loading' | 'ready' | 'failed'; completed: number; total: number; timedOut: boolean; error: string | null; frames: readonly SpriteFrame[] }
export type ScenePorts = { metadata(): Promise<unknown>; image(file: string): Promise<void>; navigation(): Promise<void> }
const images = ['world-backdrop.webp', 'camp-ground.webp', 'poi-projects.webp', 'poi-about.webp', 'poi-journey.webp', 'poi-contact.webp']

export function createSceneLoader(ports: ScenePorts, onChange: (state: ScenePreparation) => void, timeoutMs = 8000) {
  let state: ScenePreparation = { generation: 0, status: 'idle', completed: 0, total: 28, timedOut: false, error: null, frames: [] }
  let timer: ReturnType<typeof setTimeout> | undefined, disposed = false
  const current = (generation: number) => !disposed && state.generation === generation && state.status === 'loading'
  const publish = (change: Partial<ScenePreparation>) => { state = { ...state, ...change }; onChange(state) }
  const clear = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined }
  const complete = (generation: number) => {
    if (!current(generation)) return
    const completed = state.completed + 1
    if (completed === state.total) { clear(); publish({ completed, status: 'ready' }) }
    else publish({ completed })
  }
  const fail = (generation: number, error: unknown) => {
    if (!current(generation)) return
    clear(); publish({ status: 'failed', error: error instanceof Error ? error.message : String(error) })
  }
  const run = (generation: number, operation: () => Promise<void>) => {
    void Promise.resolve().then(operation).then(() => complete(generation), error => fail(generation, error))
  }
  const startGeneration = () => {
    if (disposed) return
    clear()
    const generation = state.generation + 1
    publish({ generation, status: 'loading', completed: 0, timedOut: false, error: null, frames: [] })
    timer = setTimeout(() => { if (current(generation)) publish({ timedOut: true }) }, timeoutMs)
    run(generation, () => ports.navigation())
    for (const image of images) run(generation, () => ports.image(image))
    void Promise.resolve().then(() => ports.metadata()).then(value => {
      if (!current(generation)) return
      const frames = validateFrames(value)
      publish({ frames }); complete(generation)
      for (const frame of frames) run(generation, () => ports.image(`avatar/${frame.name}.webp`))
    }).catch(error => fail(generation, error))
  }
  return {
    get state() { return state },
    start() { if (state.status === 'idle') startGeneration() },
    retry() { startGeneration() },
    dispose() { disposed = true; clear() },
  }
}

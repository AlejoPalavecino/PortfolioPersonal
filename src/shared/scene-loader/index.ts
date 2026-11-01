import { validateFrames } from './frames'
import type { SpriteFrame } from './frames'
export type { SpriteFrame } from './frames'

export type ScenePreparation = { generation: number; status: 'idle' | 'loading' | 'ready' | 'failed'; completed: number; total: number; timedOut: boolean; error: string | null; frames: readonly SpriteFrame[]; task?: string }
export type ScenePorts = { metadata(): Promise<unknown>; image(file: string): Promise<void>; navigation(): Promise<void> }
const images = ['world-backdrop.webp', 'camp-hillside.webp', 'poi-projects.webp', 'poi-about.webp', 'poi-journey.webp', 'poi-contact.webp']

/** Real groups of work, in the order shown to the person. Each label names what is actually pending. */
type Group = 'paths' | 'scenery' | 'character'
const labels: Record<Group, string> = { paths: 'Trazando los caminos', scenery: 'Cargando el paisaje', character: 'Preparando los movimientos de Alejo' }
const order: readonly Group[] = ['paths', 'scenery', 'character']
const sizes: Record<Group, number> = { paths: 1, scenery: images.length, character: 21 }

export function createSceneLoader(ports: ScenePorts, onChange: (state: ScenePreparation) => void, timeoutMs = 8000) {
  let state: ScenePreparation = { generation: 0, status: 'idle', completed: 0, total: 28, timedOut: false, error: null, frames: [] }
  let timer: ReturnType<typeof setTimeout> | undefined, disposed = false
  let done: Record<Group, number> = { paths: 0, scenery: 0, character: 0 }
  const current = (generation: number) => !disposed && state.generation === generation && state.status === 'loading'
  const publish = (change: Partial<ScenePreparation>) => { state = { ...state, ...change }; onChange(state) }
  const clear = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined }
  const task = () => labels[order.find(group => done[group] < sizes[group]) ?? 'character']
  const complete = (generation: number, group: Group) => {
    if (!current(generation)) return
    done = { ...done, [group]: done[group] + 1 }
    const completed = state.completed + 1
    if (completed === state.total) { clear(); publish({ completed, status: 'ready', task: 'Listo para explorar' }) }
    else publish({ completed, task: task() })
  }
  const fail = (generation: number, error: unknown) => {
    if (!current(generation)) return
    clear(); publish({ status: 'failed', error: error instanceof Error ? error.message : String(error) })
  }
  const run = (generation: number, group: Group, operation: () => Promise<void>) => {
    void Promise.resolve().then(operation).then(() => complete(generation, group), error => fail(generation, error))
  }
  const startGeneration = () => {
    if (disposed) return
    clear()
    done = { paths: 0, scenery: 0, character: 0 }
    const generation = state.generation + 1
    publish({ generation, status: 'loading', completed: 0, timedOut: false, error: null, frames: [], task: labels.paths })
    timer = setTimeout(() => { if (current(generation)) publish({ timedOut: true }) }, timeoutMs)
    run(generation, 'paths', () => ports.navigation())
    for (const image of images) run(generation, 'scenery', () => ports.image(image))
    void Promise.resolve().then(() => ports.metadata()).then(value => {
      if (!current(generation)) return
      const frames = validateFrames(value)
      publish({ frames }); complete(generation, 'character')
      for (const frame of frames) run(generation, 'character', () => ports.image(`avatar/${frame.name}.webp`))
    }).catch(error => fail(generation, error))
  }
  return {
    get state() { return state },
    start() { if (state.status === 'idle') startGeneration() },
    retry() { startGeneration() },
    dispose() { disposed = true; clear() },
  }
}

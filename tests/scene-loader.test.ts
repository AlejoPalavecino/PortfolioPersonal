import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSceneLoader, INITIAL_SCENE_TASKS } from '../src/shared/scene-loader'

const names = ['down', 'left', 'right', 'up'].flatMap(dir => [`idle-${dir}`, ...[1, 2, 3, 4].map(n => `walk-${dir}-${n}`)])
const frames = names.map(name => ({ name, w: 32, h: 64, anchorX: 16, anchorY: 63 }))
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const flush = async () => { for (let i = 0; i < 16; i++) await Promise.resolve() }
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

describe('carga progresiva de escena', () => {
  it('habilita el campamento con cinco operaciones sin esperar sprites secundarios', async () => {
    vi.useFakeTimers()
    const last = deferred<void>()
    const image = vi.fn((file: string) => file === 'avatar/walk-up-4.webp' ? last.promise : Promise.resolve())
    const notify = vi.fn()
    const loader = createSceneLoader({ metadata: async () => frames, image, navigation: async () => {} }, notify)
    loader.start(); await flush()

    expect(INITIAL_SCENE_TASKS).toBe(5)
    expect(loader.state).toMatchObject({ status: 'ready', completed: 5, total: 5, timedOut: false })
    expect(loader.state.frames).toHaveLength(20)
    expect(image.mock.calls.map(call => call[0])).toEqual(expect.arrayContaining([
      'world-backdrop.webp', 'camp-hillside.webp', 'avatar/idle-down.webp',
    ]))
    expect(image).toHaveBeenCalledTimes(3)
    expect(image.mock.calls.map(call => call[0])).not.toContain('camp-ambience-loop.wav')
    expect(image.mock.calls.map(call => call[0])).not.toContain('cv-alejo-palavecino-es.pdf')

    await vi.advanceTimersByTimeAsync(899)
    expect(image).toHaveBeenCalledTimes(3)
    await vi.advanceTimersByTimeAsync(1); await flush()
    expect(image.mock.calls.map(call => call[0])).toContain('avatar/walk-up-4.webp')
    expect(loader.state.status).toBe('ready')
    const count = notify.mock.calls.length
    last.reject(new Error('optional decode failed')); await flush()
    expect(loader.state.status).toBe('ready')
    expect(notify).toHaveBeenCalledTimes(count)
    loader.dispose()
  })

  it('marca demora a los 8 segundos solo si sigue faltando un recurso esencial', async () => {
    vi.useFakeTimers()
    const nav = deferred<void>()
    const loader = createSceneLoader({ metadata: async () => frames, image: async () => {}, navigation: () => nav.promise }, () => {})
    loader.start(); await flush()
    expect(loader.state).toMatchObject({ status: 'loading', completed: 4, total: 5, timedOut: false })
    await vi.advanceTimersByTimeAsync(7999)
    expect(loader.state.timedOut).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(loader.state).toMatchObject({ status: 'loading', completed: 4, timedOut: true })
    nav.resolve(); await flush()
    expect(loader.state).toMatchObject({ status: 'ready', completed: 5 })
    loader.dispose()
  })

  it('rechaza metadatos corruptos y fallos de la carga esencial, pero no recursos diferidos', async () => {
    const invalid = createSceneLoader({ metadata: async () => frames.slice(1), image: async () => {}, navigation: async () => {} }, () => {})
    invalid.start(); await flush()
    expect(invalid.state.status).toBe('failed')
    expect(invalid.state.error).toBeTruthy()

    const broken = createSceneLoader({
      metadata: async () => frames,
      image: async file => { if (file === 'camp-hillside.webp') throw new Error('essential decode failed') },
      navigation: async () => {},
    }, () => {})
    broken.start(); await flush()
    expect(broken.state.status).toBe('failed')
    invalid.dispose(); broken.dispose()
  })

  it('ignora respuestas de generaciones anteriores y cancela prefetch al destruirse', async () => {
    vi.useFakeTimers()
    const pending = deferred<unknown>()
    const metadata = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValue(frames)
    const image = vi.fn().mockResolvedValue(undefined)
    const loader = createSceneLoader({ metadata, image, navigation: async () => {} }, () => {})
    loader.start(); const first = loader.state.generation
    loader.retry(); await flush()
    expect(loader.state).toMatchObject({ generation: first + 1, status: 'ready', completed: 5 })
    pending.reject(new Error('stale metadata')); await flush()
    expect(loader.state).toMatchObject({ generation: first + 1, status: 'ready' })
    loader.dispose()
    await vi.advanceTimersByTimeAsync(1100)
    expect(image).toHaveBeenCalledTimes(6) // three essentials for each generation

    const later = deferred<unknown>()
    const notify = vi.fn()
    const disposed = createSceneLoader({ metadata: () => later.promise, image: async () => {}, navigation: async () => {} }, notify)
    disposed.start(); disposed.dispose(); const calls = notify.mock.calls.length
    later.resolve(frames); await flush()
    expect(notify).toHaveBeenCalledTimes(calls)
  })
})

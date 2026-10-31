import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSceneLoader } from '../src/shared/scene-loader'

const names = ['down', 'left', 'right', 'up'].flatMap(dir => [`idle-${dir}`, ...[1, 2, 3, 4].map(n => `walk-${dir}-${n}`)])
const frames = names.map(name => ({ name, w: 32, h: 64, anchorX: 16, anchorY: 63 }))
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve() }
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

describe('preparación real de escena', () => {
  it('espera navegación, imágenes y todos los frames decodificados sin demora mínima', async () => {
    const last = deferred<void>()
    const image = vi.fn((file: string) => file === 'avatar/walk-up-4.webp' ? last.promise : Promise.resolve())
    const loader = createSceneLoader({ metadata: async () => frames, image, navigation: async () => {} }, () => {})
    loader.start(); await flush()
    expect(loader.state.status).toBe('loading')
    expect(loader.state.completed).toBe(27)
    expect(loader.state.total).toBe(28)
    expect(image).toHaveBeenCalledTimes(26)
    expect(image.mock.calls.map(call => call[0])).not.toContain('camp-ambience-loop.wav')
    expect(image.mock.calls.map(call => call[0])).not.toContain('cv-alejo-palavecino-es.pdf')
    last.resolve(); await flush()
    expect(loader.state).toMatchObject({ status: 'ready', completed: 28, timedOut: false })
    expect(loader.state.frames).toHaveLength(20)
    loader.dispose()
  })

  it('muestra alternativa a los ocho segundos sin falsear progreso y acepta éxito tardío', async () => {
    vi.useFakeTimers()
    const nav = deferred<void>()
    const loader = createSceneLoader({ metadata: async () => frames, image: async () => {}, navigation: () => nav.promise }, () => {})
    loader.start(); await flush()
    expect(loader.state).toMatchObject({ status: 'loading', completed: 27, timedOut: false })
    await vi.advanceTimersByTimeAsync(7999)
    expect(loader.state.timedOut).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(loader.state).toMatchObject({ status: 'loading', completed: 27, timedOut: true })
    nav.resolve(); await flush()
    expect(loader.state).toMatchObject({ status: 'ready', completed: 28 })
    loader.dispose()
  })

  it('falla ante metadata inválida o error crítico sin quedar cargando', async () => {
    const invalid = createSceneLoader({ metadata: async () => frames.slice(1), image: async () => {}, navigation: async () => {} }, () => {})
    invalid.start(); await flush()
    expect(invalid.state.status).toBe('failed')
    expect(invalid.state.error).toBeTruthy()
    const broken = createSceneLoader({ metadata: async () => frames, image: async () => { throw new Error('decode') }, navigation: async () => {} }, () => {})
    broken.start(); await flush()
    expect(broken.state.status).toBe('failed')
    invalid.dispose(); broken.dispose()
  })

  it('ignora resultados de generaciones anteriores y de loaders destruidos', async () => {
    const pending = deferred<unknown>()
    const metadata = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValue(frames)
    const loader = createSceneLoader({ metadata, image: async () => {}, navigation: async () => {} }, () => {})
    loader.start(); const old = loader.state.generation
    loader.retry(); await flush()
    expect(loader.state).toMatchObject({ generation: old + 1, status: 'ready', completed: 28 })
    pending.reject(new Error('respuesta tardía')); await flush()
    expect(loader.state).toMatchObject({ generation: old + 1, status: 'ready' })
    const later = deferred<unknown>()
    const notify = vi.fn()
    const disposed = createSceneLoader({ metadata: () => later.promise, image: async () => {}, navigation: async () => {} }, notify)
    disposed.start(); disposed.dispose(); const calls = notify.mock.calls.length
    later.resolve(frames); await flush()
    expect(notify).toHaveBeenCalledTimes(calls)
    loader.dispose()
  })
})

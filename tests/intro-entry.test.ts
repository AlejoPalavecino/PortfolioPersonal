import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from '../src/app/session'
import type { ScenePreparation } from '../src/shared'
import type { createController } from '../src/app/controller'
import { shell } from '../src/app/shell'

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

function harness(reduced = false) {
  vi.useFakeTimers()
  const intro = {
    hidden: false, classList: { add: vi.fn(), remove: vi.fn() },
    setAttribute: vi.fn(), removeAttribute: vi.fn(),
  }
  const enter = { disabled: true, focus: vi.fn() }
  const direct = { focus: vi.fn() }
  const world = { inert: true, focus: vi.fn() }
  const status = { textContent: '' }
  const inert = { inert: false }
  const panel = { hidden: true, querySelector: vi.fn() }
  const nodeStatus = { hidden: true, contains: () => false }
  const retry = { hidden: true, contains: () => false }
  const nodes: Record<string, unknown> = {
    '.intro': intro, '.loading-status': status, '[data-action=enter]': enter,
    '[data-action=direct]': direct, '.world': world,
    '.hud-left': inert, '.hud-right': { inert: false }, '.panel': panel,
    '.scene-status': nodeStatus, '.retry-intro': retry,
  }
  const root = {
    dataset: { reading: 'false' } as Record<string, string>,
    querySelector: (selector: string) => nodes[selector],
  } as unknown as HTMLElement
  const controller = { dispatch: vi.fn() } as unknown as ReturnType<typeof createController>
  vi.stubGlobal('location', { hash: '' })
  vi.stubGlobal('sessionStorage', { getItem: () => null, setItem: vi.fn() })
  vi.stubGlobal('document', { activeElement: null })
  vi.stubGlobal('window', {
    setTimeout: (callback: () => void, delay: number) => setTimeout(callback, delay),
    clearTimeout: (id: number) => clearTimeout(id),
  })
  const session = createSession(root, controller, reduced)
  const load = (generation: number, state: ScenePreparation['status']): ScenePreparation => ({
    generation, status: state, completed: state === 'ready' ? 28 : 6,
    total: 28, timedOut: false, error: null, frames: [],
  })
  return { root, intro, enter, direct, world, session, load, controller }
}

describe('entrada deliberada al portfolio', () => {
  it('omitir durante la carga no entra automáticamente cuando los recursos quedan listos', () => {
    const h = harness()
    h.session.loading(h.load(1, 'loading'))
    h.session.skipIntro()
    expect(h.root.dataset.introSkipped).toBe('true')
    expect(h.session.state.phase).toBe('loading')
    expect(h.intro.hidden).toBe(false)
    expect(h.direct.focus).toHaveBeenCalledOnce()

    h.session.loading(h.load(1, 'ready'))
    expect(h.session.state.phase).toBe('ready')
    expect(h.intro.hidden).toBe(false)
    expect(h.enter.disabled).toBe(false)
    expect(h.world.focus).not.toHaveBeenCalled()

    h.session.enter()
    expect(h.intro.classList.add).toHaveBeenCalledWith('is-leaving')
    expect(h.enter.disabled).toBe(true)
    expect(h.session.state.phase).toBe('ready')
    vi.advanceTimersByTime(420)
    expect(h.session.state.phase).toBe('explore')
    expect(h.intro.hidden).toBe(true)
    expect(h.world.focus).toHaveBeenCalledOnce()
  })

  it('no oculta la presentación ni crea una ruta si se intenta entrar antes de ready', () => {
    const h = harness()
    h.session.loading(h.load(1, 'loading'))
    h.session.enter()
    expect(h.intro.hidden).toBe(false)
    expect(h.session.state.phase).toBe('loading')
    expect(h.world.focus).not.toHaveBeenCalled()
    h.session.direct()
    expect(h.session.state.phase).toBe('direct')
    expect(h.intro.hidden).toBe(true)
  })

  it('respeta movimiento reducido sin imponer animación de salida', () => {
    const h = harness(true)
    h.session.loading(h.load(1, 'loading'))
    h.session.loading(h.load(1, 'ready'))
    h.session.enter()
    expect(h.intro.classList.add).not.toHaveBeenCalled()
    expect(h.session.state.phase).toBe('explore')
    expect(h.world.focus).toHaveBeenCalledOnce()
  })

  it('mantiene acceso a proyectos y controles de reproducción desde el primer cuadro', () => {
    const html = shell()
    expect(html).toContain('data-action="intro-replay"')
    expect(html).toContain('data-action="intro-pause"')
    expect(html).toContain('data-action="skip-intro"')
    expect(html).toContain('data-action="direct"')
    expect(html).toContain('data-action="enter" disabled')
    expect(html).toContain('intro-story-track')
    expect(html).toContain('aria-label="Carga real de recursos del campamento"')
  })
})

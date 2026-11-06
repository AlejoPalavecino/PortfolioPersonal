import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from '../src/app/session'
import { restoreHistoryView } from '../src/app/history'
import type { createController } from '../src/app/controller'
import type { createViews, View } from '../src/app/views'

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

function setup(entered: boolean, ready: boolean) {
  vi.stubGlobal('sessionStorage', { getItem: () => entered ? '1' : null, setItem: vi.fn() })
  vi.stubGlobal('location', { hash: '#proyectos/foxmind' })
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  vi.stubGlobal('document', { activeElement: null })
  const node = () => ({ hidden: false, inert: false, disabled: false, textContent: '', focus: vi.fn(), contains: () => false })
  const intro = node(), panel = node(), world = node(), entry = node(), direct = node()
  const elements: Record<string, ReturnType<typeof node>> = {
    '.intro': intro, '.panel': panel, '.world': world, '.loading-status': node(),
    '[data-action=enter]': entry, '.intro-primary-actions [data-action=direct]': direct,
    '.hud-left': node(), '.hud-right': node(), '.scene-status': node(), '.retry-intro': node(),
  }
  const root = { dataset: {}, querySelector: (key: string) => elements[key] } as unknown as HTMLElement
  const controller = { dispatch: vi.fn() } as unknown as ReturnType<typeof createController>
  const session = createSession(root, controller)
  session.update({ type: 'load-start', generation: 1 })
  if (ready) session.update({ type: 'load-ready', generation: 1 })
  const restore = vi.fn((view: View) => {
    panel.hidden = view.kind === 'camp'
    session.update({ type: view.kind === 'camp' ? 'camp' : 'read' })
  })
  const views = { restore } as unknown as ReturnType<typeof createViews>
  return { intro, panel, world, entry, direct, controller, session, views, restore }
}

describe('restauración del historial desde lectura directa', () => {
  it('vuelve al inicio con CTA habilitada y Adelante recupera lectura sin intro', () => {
    const x = setup(false, true)
    restoreHistoryView({ kind: 'camp' }, x.controller, x.views, x.session)
    expect(x.intro.hidden).toBe(false)
    expect(x.entry.disabled).toBe(false)
    expect(x.world.inert).toBe(true)
    restoreHistoryView({ kind: 'case', id: 'foxmind' }, x.controller, x.views, x.session)
    expect(x.intro.hidden).toBe(true)
    expect(x.panel.hidden).toBe(false)
    expect(x.restore).toHaveBeenLastCalledWith({ kind: 'case', id: 'foxmind' }, x.controller)
  })

  it('vuelve al campamento jugable si ya se entró y los recursos están listos', () => {
    const x = setup(true, true)
    restoreHistoryView({ kind: 'camp' }, x.controller, x.views, x.session)
    expect(x.intro.hidden).toBe(true)
    expect(x.session.state.phase).toBe('explore')
    expect(x.world.inert).toBe(false)
  })

  it('entra automáticamente si se pidió explorar, salvo que se elijan proyectos durante la espera', () => {
    for (const readInstead of [false, true]) {
      const x = setup(false, false)
      x.session.prepareEntry()
      x.session.skipIntro()
      expect(x.session.state.phase).not.toBe('explore')
      if (readInstead) x.session.direct()
      x.session.update({ type: 'load-ready', generation: 1 })
      expect(x.session.state.phase).toBe(readInstead ? 'direct' : 'explore')
    }
  })

  it('ofrece entrada mientras carga aunque la sesión ya haya entrado', () => {
    const x = setup(true, false)
    restoreHistoryView({ kind: 'camp' }, x.controller, x.views, x.session)
    expect(x.intro.hidden).toBe(false)
    expect(x.entry.disabled).toBe(false)
    x.session.skipIntro()
    expect(x.world.inert).toBe(true)
    x.session.update({ type: 'load-ready', generation: 1 })
    expect(x.session.state.phase).toBe('explore')
    expect(x.intro.hidden).toBe(true)
    expect(x.world.inert).toBe(false)
  })
})

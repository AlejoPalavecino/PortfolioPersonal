import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectiveReducedMotion } from '../src/core/experience'
import { returnToCamp } from '../src/app/actions'
import { createViews } from '../src/app/views'
import type { createController } from '../src/app/controller'
import type { createSession } from '../src/app/session'

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

describe('preferencia efectiva de movimiento', () => {
  it.each([[false, false, false], [true, false, true], [false, true, true], [true, true, true]])(
    'combina sistema %s y control interno %s', (system, user, expected) => {
      expect(effectiveReducedMotion(system, user)).toBe(expected)
    },
  )
})

describe('regreso explícito durante un recorrido', () => {
  it('cancela la ruta y limpia la URL incluso si la vista ya es campamento', () => {
    const location = { pathname: '/PortfolioPersonal/', hash: '#proyectos' }
    const pushState = vi.fn((_state, _title, url: string) => { location.hash = url.startsWith('#') ? url : '' })
    vi.stubGlobal('location', location)
    vi.stubGlobal('history', { pushState })
    const panel = { setAttribute: vi.fn(), querySelector: vi.fn() }
    const root = { dataset: {}, querySelector: (selector: string) => selector === '.panel' ? panel : null } as unknown as HTMLElement
    const views = createViews(root)
    const controller = { dispatch: vi.fn() } as unknown as ReturnType<typeof createController>
    const session = { state: { direct: false } } as unknown as ReturnType<typeof createSession>

    returnToCamp(controller, views, session)

    expect(controller.dispatch).toHaveBeenCalledWith({ type: 'camp' })
    expect(location.hash).toBe('')
    expect(pushState).toHaveBeenCalled()
  })
})

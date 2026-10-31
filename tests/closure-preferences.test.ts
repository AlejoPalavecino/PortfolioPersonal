import { afterEach, describe, expect, it, vi } from 'vitest'
import { bindPreferences } from '../src/app/events'
import type { createController } from '../src/app/controller'
import type { createSession } from '../src/app/session'

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

describe('preferencias durante la visita', () => {
  it('combina sistema y preferencia manual, cancela animaciones y solo guarda cambios manuales', () => {
    let change = () => {}
    const media = { matches: false, addEventListener: vi.fn((_event, handler: () => void) => { change = handler }) }
    const setItem = vi.fn()
    vi.stubGlobal('matchMedia', () => media)
    vi.stubGlobal('localStorage', { setItem })
    const cancel = vi.fn(), button = { setAttribute: vi.fn(), textContent: '' }
    const root = { dataset: { reading: 'true' }, getAnimations: () => [{ cancel }], querySelector: (s: string) => s === '[data-action=motion]' ? button : null } as unknown as HTMLElement
    const controller = { dispatch: vi.fn() } as unknown as ReturnType<typeof createController>
    const session = { update: vi.fn() } as unknown as ReturnType<typeof createSession>
    const toggle = bindPreferences(root, controller, session, true)
    expect(root.dataset.motion).toBe('reduced'); expect(cancel).toHaveBeenCalled(); expect(setItem).not.toHaveBeenCalled()
    media.matches = true; change()
    expect(button.textContent).toContain('sistema y preferencia'); expect(setItem).not.toHaveBeenCalled()
    toggle()
    expect(setItem).toHaveBeenCalledWith('camp:motion:v1', 'false')
    expect(root.dataset.userMotion).toBe('false'); expect(root.dataset.motion).toBe('reduced')
    media.matches = false; change()
    expect(root.dataset.motion).toBe('full'); expect(setItem).toHaveBeenCalledTimes(1)
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from '../src/app/session'
import type { createController } from '../src/app/controller'
import type { ScenePreparation } from '../src/shared'

afterEach(() => vi.unstubAllGlobals())

describe('lectura durante la preparación', () => {
  it.each([false, true])('conserva lectura y foco cuando llega ready, con fallo previo: %s', failed => {
    const focused = { focus: vi.fn() }, status = { textContent: '' }, intro = { hidden: false }, enter = { disabled: false }
    const panel = { hidden: false, scrollTop: 291, querySelector: () => focused }
    const sceneStatus = { hidden: true, contains: () => false }, retry = { hidden: true, contains: () => false }
    const inert = { inert: false }
    const nodes: Record<string, unknown> = { '.intro': intro, '.loading-status': status, '[data-action=enter]': enter, '.scene-status': sceneStatus, '.retry-intro': retry, '.panel': panel, '.hud-left': inert, '.hud-right': inert, '.world': inert }
    const root = { dataset: { reading: 'true' }, querySelector: (selector: string) => nodes[selector] } as unknown as HTMLElement
    const controller = { dispatch: vi.fn() } as unknown as ReturnType<typeof createController>
    vi.stubGlobal('location', { hash: '#proyectos/flower' }); vi.stubGlobal('sessionStorage', { getItem: () => null })
    vi.stubGlobal('document', { activeElement: focused })
    const session = createSession(root, controller, false)
    const state = (generation: number, status: ScenePreparation['status']): ScenePreparation => ({ generation, status, completed: status === 'ready' ? 28 : 7, total: 28, timedOut: false, error: null, frames: [] })
    session.loading(state(1, 'loading')); session.direct(); session.update({ type: 'read' })
    if (failed) { session.loading(state(1, 'failed')); session.loading(state(2, 'loading')) }
    session.loading(state(failed ? 2 : 1, 'ready'))
    expect(session.state).toMatchObject({ phase: 'direct', preparation: 'ready' })
    expect(location.hash).toBe('#proyectos/flower'); expect(panel.scrollTop).toBe(291)
    expect(focused.focus).not.toHaveBeenCalled(); expect(intro.hidden).toBe(true)
    expect(controller.dispatch).toHaveBeenLastCalledWith({ type: 'set-scene', scene: 'ready' })
  })
})

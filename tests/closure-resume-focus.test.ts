import { expect, it, vi } from 'vitest'
import { bindActions } from '../src/app/actions'
import type { createController } from '../src/app/controller'
import type { createViews } from '../src/app/views'
import type { createAudio } from '../src/app/audio'
import type { createSession } from '../src/app/session'

it('al reanudar devuelve foco al mundo después de retirar el botón', () => {
  let click!: (event: { target: { closest: () => unknown } }) => void
  const focus = vi.fn()
  const root = {
    addEventListener: (_type: string, handler: typeof click) => { click = handler },
    querySelector: (selector: string) => selector === '.world' ? { focus } : null,
  } as unknown as HTMLElement
  const dispatch = vi.fn()
  const controller = { dispatch } as unknown as ReturnType<typeof createController>
  const views = { current: { kind: 'camp' } } as unknown as ReturnType<typeof createViews>
  bindActions(root, controller, views, {} as ReturnType<typeof createAudio>, {} as ReturnType<typeof createSession>, vi.fn(), vi.fn())
  click({ target: { closest: () => ({ dataset: { action: 'resume' } }) } })
  expect(dispatch).toHaveBeenCalledWith({ type: 'resume' })
  expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  expect(dispatch.mock.invocationCallOrder[0]).toBeLessThan(focus.mock.invocationCallOrder[0]!)
})

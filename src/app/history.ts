import type { createController } from './controller'
import type { createViews, View } from './views'
import type { createSession } from './session'

export function restoreHistoryView(
  view: View,
  controller: ReturnType<typeof createController>,
  views: ReturnType<typeof createViews>,
  session: ReturnType<typeof createSession>,
): void {
  views.restore(view, controller)
  if (view.kind !== 'camp') return
  if (session.state.entered && session.state.preparation === 'ready') session.enter()
  else session.prepareEntry()
}

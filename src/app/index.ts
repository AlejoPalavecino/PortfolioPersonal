import { createController } from './controller'
import { createAudio } from './audio'
import { shell } from './shell'
import { createViews } from './views'
import { createRenderer } from './rendering'
import { bindEvents, bindPreferences } from './events'
import { bindActions } from './actions'
import { prepareScene } from './load-scene'
import { createSession } from './session'
import { observeViewport } from './viewport'
import { effectiveReducedMotion } from '../core/experience'
import { readManualMotion } from './motion-preference'
import { createCueBus } from '../core/fx/cues'
import { createLoop } from './loop'
import { bindIntroFx } from './fx/intro-fx'
import { bindWorldFx } from './fx/world-fx'

export function mount(root: HTMLElement) {
  const userMotion = readManualMotion()
  const reducedMotion = effectiveReducedMotion(matchMedia('(prefers-reduced-motion: reduce)').matches, userMotion)
  root.dataset.userMotion = String(userMotion)
  root.dataset.motion = reducedMotion ? 'reduced' : 'full'
  root.innerHTML = shell()
  observeViewport(root)
  const loop = createLoop(), bus = createCueBus()
  const views = createViews(root, { onView: view => session.update({ type: view.kind === 'camp' ? 'camp' : 'read' }), bus })
  const renderer = createRenderer(root, views, loop)
  const controller = createController(renderer.render, loop, bus)
  const session = createSession(root, controller, reducedMotion, bus)
  bindIntroFx(root, bus, loop, () => root.dataset.motion === 'reduced')
  bindWorldFx(root, controller, renderer.camera, bus, loop)
  const audio = createAudio(bus, () => ({ position: controller.state.position, reading: root.dataset.reading === 'true' }))
  const toggleMotion = bindPreferences(root, controller, session, userMotion)
  const loader = prepareScene(state => { renderer.setFrames(state.frames); session.loading(state) })
  bindActions(root, controller, views, audio, session, () => loader.retry(), toggleMotion)
  bindEvents(root, controller, views, audio, session, renderer.camera, loop, bus)
  views.restoreUrl(controller)
}

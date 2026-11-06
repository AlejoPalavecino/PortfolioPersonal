import { createController } from './controller'
import { applyPageMetadata } from '../shared/i18n'
import { bindLanguagePicker } from './locale-ui'
import { createAudio } from './audio'
import { showWorldArt } from './world-markup'
import { shell } from './shell'
import { createViews } from './views'
import { createRenderer } from './rendering'
import { bindEvents, bindPreferences } from './events'
import { bindActions } from './actions'
import { createCampLoader } from './load-scene'
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
  applyPageMetadata()
  const hasSectionLink = typeof location !== 'undefined' && !!location.hash
  root.innerHTML = shell(hasSectionLink)
  observeViewport(root)
  const loop = createLoop(root), bus = createCueBus()
  const views = createViews(root, {
    onView: view => session.update({ type: view.kind === 'camp' ? 'camp' : 'read' }),
    onCamp: () => loader.start(),
    bus,
  })
  const renderer = createRenderer(root, views, loop)
  const controller = createController(renderer.render, loop, bus)
  const session = createSession(root, controller, reducedMotion, bus)
  const introFx = bindIntroFx(root, bus, loop, () => root.dataset.motion === 'reduced', () => session.skipIntro())
  bindWorldFx(root, controller, renderer.camera, bus, loop)
  const audio = createAudio(bus, () => ({ position: controller.state.position, reading: root.dataset.reading === 'true', intro: !root.querySelector<HTMLElement>('.intro')!.hidden }))
  // Sound is opt-in. Do not download the ambience or create an AudioContext
  // until the visitor explicitly activates the sound control.
  const toggleMotion = bindPreferences(root, controller, session, userMotion)
  const loader = createCampLoader(root, state => { renderer.setFrames(state.frames); session.loading(state) })
  bus.on('enter', () => {
    showWorldArt(root)
    loader.prefetchMovement()
  })
  bindActions(root, controller, views, audio, session, () => loader.retry(), toggleMotion)
  bindEvents(root, controller, views, audio, session, renderer.camera, loop, bus)
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('calibrate')) {
    void import('./scene-calibration').then(({ bindSceneCalibration }) => bindSceneCalibration(root, loop, controller))
  }
  views.restoreUrl(controller)
  if (views.current.kind === 'camp') {
    if (hasSectionLink) session.prepareEntry()
    loader.start()
  }
  bindLanguagePicker(root, views, introFx, session)
}

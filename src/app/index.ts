import { createController } from './controller'
import { applyPageMetadata } from '../shared/i18n'
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
import { setControlLabel } from './control-label'
import { bindIntroFx } from './fx/intro-fx'
import { bindWorldFx } from './fx/world-fx'

export function mount(root: HTMLElement) {
  const userMotion = readManualMotion()
  const reducedMotion = effectiveReducedMotion(matchMedia('(prefers-reduced-motion: reduce)').matches, userMotion)
  root.dataset.userMotion = String(userMotion)
  root.dataset.motion = reducedMotion ? 'reduced' : 'full'
  applyPageMetadata()
  root.innerHTML = shell()
  observeViewport(root)
  const loop = createLoop(), bus = createCueBus()
  const views = createViews(root, { onView: view => session.update({ type: view.kind === 'camp' ? 'camp' : 'read' }), bus })
  const renderer = createRenderer(root, views, loop)
  const controller = createController(renderer.render, loop, bus)
  const session = createSession(root, controller, reducedMotion, bus)
  bindIntroFx(root, bus, loop, () => root.dataset.motion === 'reduced', () => session.skipIntro())
  bindWorldFx(root, controller, renderer.camera, bus, loop)
  const audio = createAudio(bus, () => ({ position: controller.state.position, reading: root.dataset.reading === 'true', intro: !root.querySelector<HTMLElement>('.intro')!.hidden }))
  // Autoplay is best effort: browser policies may require a trusted gesture.
  let wanted = true, starting = false
  const startSound = async () => {
    if (!wanted || starting || audio.enabled || document.hidden) return
    starting = true
    await audio.toggle()
    starting = false
    root.dataset.sound = String(audio.enabled)
    root.querySelectorAll<HTMLButtonElement>('[data-action=sound]').forEach(button => {
      button.setAttribute('aria-pressed', String(audio.enabled))
      setControlLabel(button, audio.enabled ? 'Apagar sonido' : 'Activar sonido')
    })
  }
  root.addEventListener('click', event => { if ((event.target as HTMLElement).closest('[data-action=sound]')) wanted = false }, true)
  document.addEventListener('pointerdown', event => { if (!(event.target as HTMLElement).closest('[data-action=sound]')) void startSound() })
  document.addEventListener('keydown', () => { void startSound() })
  void startSound()
  const toggleMotion = bindPreferences(root, controller, session, userMotion)
  const loader = prepareScene(state => { renderer.setFrames(state.frames); session.loading(state) })
  bindActions(root, controller, views, audio, session, () => loader.retry(), toggleMotion)
  bindEvents(root, controller, views, audio, session, renderer.camera, loop, bus)
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('calibrate')) {
    void import('./scene-calibration').then(({ bindSceneCalibration }) => bindSceneCalibration(root, loop, controller))
  }
  views.restoreUrl(controller)
}

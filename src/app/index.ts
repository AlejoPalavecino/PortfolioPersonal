import { createController } from './controller'
import { createAudio } from './audio'
import { shell } from './shell'
import { createViews } from './views'
import { createRenderer } from './rendering'
import { bindEvents, bindPreferences } from './events'
import { loadScene } from './load-scene'

export function mount(root: HTMLElement) {
  root.innerHTML = shell()
  const views = createViews(root)
  const renderer = createRenderer(root, views)
  const controller = createController(renderer.render)
  bindPreferences(root, controller)
  bindEvents(root, controller, views, createAudio())
  views.restoreUrl(controller)
  loadScene(root, controller)
  void renderer.loadFrames(() => renderer.render(controller.state, false, 'down'))
}

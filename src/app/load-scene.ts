import type { createController } from './controller'

export function loadScene(root: HTMLElement, controller: ReturnType<typeof createController>) {
  const images = [...root.querySelectorAll<HTMLImageElement>('.ground,.poi')]
  let generation = 0
  const retry = () => {
    const id = ++generation
    controller.dispatch({ type: 'set-scene', scene: 'loading' })
    let remaining = images.length
    const finish = () => {
      if (id === generation && --remaining === 0 && controller.state.scene !== 'failed') {
        controller.dispatch({ type: 'set-scene', scene: 'ready' })
      }
    }
    images.forEach(image => {
      if (image.complete && image.naturalWidth) { finish(); return }
      image.onload = finish
      image.onerror = () => {
        if (id === generation) controller.dispatch({ type: 'set-scene', scene: 'failed' })
      }
      if (image.complete) image.src = image.src.split('?')[0] + `?retry=${id}`
    })
  }
  root.addEventListener('click', event => {
    if ((event.target as HTMLElement).closest('[data-action=retry]')) retry()
  })
  retry()
}

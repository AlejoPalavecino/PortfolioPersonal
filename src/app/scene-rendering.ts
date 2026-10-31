import { occludingDestination, type Navigation } from '../core/domain'

export function renderScene(root: HTMLElement, state: Pick<Navigation, 'position' | 'visited' | 'route'>): void {
  const avatar = root.querySelector<HTMLImageElement>('.avatar:not(.avatar-ghost)')
  const ghost = root.querySelector<HTMLImageElement>('.avatar-ghost')
  const overlay = root.querySelector<HTMLElement>('.avatar-occlusion')
  const section = occludingDestination(state.position)
  const object = section && root.querySelector<HTMLImageElement>(`[data-poi="${section}"]`)
  if (!avatar || !ghost || !overlay) return
  overlay.hidden = !object
  if (!object) return
  overlay.style.maskImage = `url("${object.currentSrc || object.src}")`
  overlay.style.maskPosition = `${object.offsetLeft}px ${object.offsetTop}px`
  overlay.style.maskSize = `${object.offsetWidth}px ${object.offsetHeight}px`
  ghost.src = avatar.src
  ghost.style.width = avatar.style.width
  ghost.style.left = avatar.style.left
  ghost.style.top = avatar.style.top
  ghost.style.transform = avatar.style.transform
}

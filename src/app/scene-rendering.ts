import { occludingDestination, type Navigation } from '../core/domain'

/**
 * The sprite's real alpha is the reveal mask; the character's feet determine
 * whether a building is in front. Never show a rectangular silhouette or draw
 * a ghost while the POI sprite has not decoded.
 */
export function renderScene(root: HTMLElement, state: Pick<Navigation, 'position' | 'visited' | 'route'>): void {
  const avatar = root.querySelector<HTMLImageElement>('.avatar:not(.avatar-ghost)')
  const ghost = root.querySelector<HTMLImageElement>('.avatar-ghost')
  const overlay = root.querySelector<HTMLElement>('.avatar-occlusion')
  if (!avatar || !ghost || !overlay) return

  const section = occludingDestination(state.position)
  const object = section ? root.querySelector<HTMLImageElement>(`[data-poi="${section}"]`) : null
  const source = object?.currentSrc || object?.src
  const visible = !!(section && object?.complete && object.naturalWidth > 0 && source)
  overlay.hidden = !visible
  if (!visible || !object) {
    delete overlay.dataset.destination
    return
  }

  const mask = `url("${source}")`
  if (overlay.style.maskImage !== mask) overlay.style.maskImage = mask
  overlay.dataset.destination = section
  const position = `${object.offsetLeft}px ${object.offsetTop}px`
  const size = `${object.offsetWidth}px ${object.offsetHeight}px`
  if (overlay.style.maskPosition !== position) overlay.style.maskPosition = position
  if (overlay.style.maskSize !== size) overlay.style.maskSize = size
  if (ghost.src !== avatar.src) ghost.src = avatar.src
  ghost.style.width = avatar.style.width
  ghost.style.left = avatar.style.left
  ghost.style.top = avatar.style.top
  ghost.style.transform = avatar.style.transform
}

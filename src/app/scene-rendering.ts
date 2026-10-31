import { isOccluded, type Navigation } from '../core/domain'

export function renderScene(root: HTMLElement, state: Pick<Navigation, 'position' | 'visited' | 'route'>): void {
  const avatar = root.querySelector<HTMLImageElement>('.avatar:not(.avatar-ghost)')
  const ghost = root.querySelector<HTMLImageElement>('.avatar-ghost')
  if (!avatar || !ghost) return
  ghost.hidden = !isOccluded(state.position)
  if (!ghost.hidden) {
    ghost.src = avatar.src
    ghost.style.width = avatar.style.width
    ghost.style.left = avatar.style.left
    ghost.style.top = avatar.style.top
    ghost.style.transform = avatar.style.transform
  }
}

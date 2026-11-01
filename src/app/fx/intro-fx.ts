import type { CueBus } from '../../core/fx/cues'
import type { Loop } from '../loop'
import { createVignette } from './vignette'

/**
 * Connects the real preparation cues to the intro: the pixel vignette, the progress bar and
 * a separate screen-reader announcement. The visible "n de m" text changes constantly, so it is
 * not a live region; the live region only speaks when something important changes.
 */
export function bindIntroFx(root: HTMLElement, bus: CueBus, loop: Loop, reducedMotion: () => boolean) {
  const card = root.querySelector<HTMLElement>('.intro-card')
  const canvas = root.querySelector<HTMLCanvasElement>('.loading-canvas')
  const bar = root.querySelector<HTMLElement>('.loading-progress')
  const fill = bar?.querySelector<HTMLElement>('span')
  if (!card) return { dispose() {}, refresh() {} }
  const live = document.createElement('p')
  live.className = 'sr-only'; live.setAttribute('role', 'status')
  card.append(live)
  const paint = (completed: number, total: number) => {
    bar?.setAttribute('aria-valuemax', String(total)); bar?.setAttribute('aria-valuenow', String(completed))
    fill?.style.setProperty('--progress', String(total ? completed / total : 0))
    root.dataset.prepared = completed >= total && total > 0 ? 'true' : 'false'
  }
  const offs = [
    bus.on('prepare-start', () => { live.textContent = 'Preparando el campamento.'; paint(0, 28) }),
    bus.on('prepare-progress', ({ completed, total }) => paint(completed, total)),
    bus.on('prepare-slow', () => { live.textContent = 'La preparación está tardando. Podés consultar el portfolio mientras tanto.' }),
    bus.on('prepare-ready', () => { live.textContent = 'Listo para explorar.'; root.dataset.prepared = 'true'; fill?.style.setProperty('--progress', '1') }),
    bus.on('prepare-failed', () => { live.textContent = 'No se pudo preparar el campamento. Podés reintentar o consultar el portfolio.' }),
  ]
  const vignette = canvas ? createVignette(canvas, { bus, loop, reducedMotion }) : null
  const motion = new MutationObserver(() => vignette?.refresh?.())
  motion.observe(root, { attributes: true, attributeFilter: ['data-motion'] })
  return {
    refresh() { vignette?.refresh?.() },
    dispose() { offs.forEach(off => off()); motion.disconnect(); vignette?.dispose(); live.remove() },
  }
}

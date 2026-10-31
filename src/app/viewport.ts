/** Keep reading below the HUD when text size or mobile browser bars change. */
export function observeViewport(root: HTMLElement) {
  const clusters = [...root.querySelectorAll<HTMLElement>('.hud-left,.hud-right')]
  const update = () => {
    const bottom = Math.max(...clusters.map(cluster => cluster.getBoundingClientRect().bottom))
    root.style.setProperty('--hud-clearance', `${Math.ceil(bottom + 12)}px`)
  }
  const observer = new ResizeObserver(update)
  clusters.forEach(cluster => observer.observe(cluster))
  window.addEventListener('resize', update)
  update()
}

/** If a synchronous startup exception occurs, leave a useful screen instead of a blank site. */
export function restoreStartupScreen(root: HTMLElement, initialMarkup: string): void {
  root.innerHTML = initialMarkup
  const section = root.querySelector<HTMLElement>('.startup-preboot')
  if (!section) return
  section.dataset.failed = 'true'
  section.setAttribute('role', 'alert')
  const english = typeof location !== 'undefined' && new URLSearchParams(location.search).get('lang') === 'en'
  const heading = section.querySelector<HTMLElement>('h1')
  const message = section.querySelector<HTMLElement>('.startup-copy')
  if (heading) heading.textContent = english ? 'The camp could not start' : 'No pudimos iniciar el campamento'
  if (message) message.textContent = english
    ? 'Try reloading the page. You can still contact me below.'
    : 'Probá actualizar la página. También podés contactarme desde los enlaces.'
  const details = section.querySelector<HTMLDetailsElement>('.startup-help')
  if (details) details.open = true
}

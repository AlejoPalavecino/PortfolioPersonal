/** Preserve the SVG while keeping the control's accessible name up to date. */
export function setControlLabel(button: HTMLButtonElement, label: string) {
  button.setAttribute('aria-label', label)
  button.title = label
  if (!button.classList?.contains('icon-control')) button.textContent = label
}

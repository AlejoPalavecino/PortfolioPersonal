import type { Section } from '../core/domain'

const paths: Record<Section, string> = {
  projects: '<path d="m8 5-5 7 5 7m8-14 5 7-5 7m-3-16-2 18"/>',
  about: '<path d="m3 20 9-17 9 17H3Zm5 0 4-8 4 8M12 3v6"/>',
  journey: '<path d="M12 5v16M3 4h5l4 2 4-2h5v15h-5l-4 2-4-2H3V4Z"/>',
  contact: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="m7 9 9-6M7 13h5m-5 4h5"/><circle cx="17" cy="15" r="2"/>',
}

export function campIcon(section: Section): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[section]}</svg>`
}

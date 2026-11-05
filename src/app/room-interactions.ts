import { email } from '../entities'

export function bindObjectInteractions(content: HTMLElement, saved: Record<string, string | undefined> = {}) {
  const tabs = [...content.querySelectorAll<HTMLButtonElement>('[data-notebook]')]
  const pages = content.querySelectorAll<HTMLElement>('[data-notebook-page]')
  function activate(tab: HTMLButtonElement) {
    content.dataset.notebook = tab.dataset.notebook
    for (const button of tabs) {
      const active = button === tab
      button.setAttribute('aria-selected', String(active))
      button.tabIndex = active ? 0 : -1
    }
    pages.forEach(page => { page.hidden = page.dataset.notebookPage !== tab.dataset.notebook })
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => activate(tab))
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab)
      const targets: Record<string, HTMLButtonElement | undefined> = {
        ArrowRight: tabs[(index + 1) % tabs.length],
        ArrowLeft: tabs[(index + tabs.length - 1) % tabs.length],
        Home: tabs[0],
        End: tabs.at(-1),
      }
      const next = targets[event.key]
      if (!next) return
      event.preventDefault()
      activate(next)
      next.focus()
    })
  }
  const milestones = [...content.querySelectorAll<HTMLButtonElement>('[data-milestone]')]
  for (const button of milestones) {
    button.addEventListener('click', () => {
      content.dataset.milestone = button.dataset.milestone
      milestones.forEach(other => other.setAttribute('aria-expanded', String(other === button)))
      content.querySelectorAll<HTMLElement>('[data-journal-page]').forEach(page => {
        page.hidden = page.dataset.journalPage !== button.dataset.milestone
        if (!page.hidden && content.isConnected) page.focus()
      })
    })
  }
  const intents = [...content.querySelectorAll<HTMLButtonElement>('[data-contact-intent]')]
  for (const button of intents) {
    button.addEventListener('click', () => {
      content.dataset.intent = button.dataset.contactIntent
      const project = button.dataset.contactIntent === 'proyecto'
      intents.forEach(other => other.setAttribute('aria-pressed', String(other === button)))
      const link = content.querySelector<HTMLAnchorElement>('.radio-send')!
      const description = content.querySelector<HTMLElement>('.radio-intent-description')!
      const subject = project ? 'Proyecto de desarrollo a medida' : 'Oportunidad laboral'
      link.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`
      link.textContent = `Abrir correo · ${project ? 'Desarrollo a medida' : subject} ↗`
      description.textContent = project
        ? 'Aplicaciones web, sistemas de gestión, integraciones e inteligencia artificial con un alcance definido.'
        : 'Desarrollo full stack, análisis funcional, automatización e IA aplicada.'
      content.querySelector<HTMLElement>('.radio-console')!.dataset.channel = project ? 'project' : 'team'
    })
  }

  tabs.find(tab => tab.dataset.notebook === saved.notebook)?.click()
  milestones.find(button => button.dataset.milestone === saved.milestone)?.click()
  intents.find(button => button.dataset.contactIntent === saved.intent)?.click()
}

import type { CaseId, Section } from '../entities'
import { caseMarkup, sectionMarkup } from '../widgets'
import type { createController } from './controller'

export type View = { kind: 'camp' } | { kind: 'section'; section: Section } | { kind: 'case'; id: CaseId }
type Context = { scroll: number; focus: number }
const urls: Record<Section, string> = {
  projects: 'proyectos', about: 'sobre-mi', journey: 'trayectoria', contact: 'contacto',
}
const key = (view: View) => JSON.stringify(view)
const path = (view: View) => view.kind === 'camp' ? location.pathname
  : view.kind === 'case' ? `#proyectos/${view.id}` : `#${urls[view.section]}`

export function createViews(root: HTMLElement) {
  const panel = root.querySelector<HTMLElement>('.panel')!
  const world = root.querySelector<HTMLElement>('.world')!
  const reading = new Map<string, Context>()
  let current: View = { kind: 'camp' }, campScroll = 0
  let originFocus: HTMLElement | null = null, restoring = false
  const controls = () => [...panel.querySelectorAll<HTMLElement>('button,a')]
  const saveReading = () => reading.set(key(current), {
    scroll: window.scrollY, focus: controls().indexOf(document.activeElement as HTMLElement),
  })
  const focusReading = (view: View) => {
    const context = reading.get(key(view))
    const heading = panel.querySelector<HTMLElement>('h2') ?? panel
    heading.tabIndex = -1
    if (context) {
      window.scrollTo({ top: context.scroll, behavior: 'instant' })
      ;(controls()[context.focus] ?? heading).focus({ preventScroll: true })
    } else {
      heading.focus({ preventScroll: true })
      panel.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
  }
  const show = (next: View, push = true) => {
    if (key(current) === key(next)) return
    if (current.kind !== 'camp') saveReading()
    else campScroll = window.scrollY
    current = next
    panel.hidden = next.kind === 'camp'
    world.inert = next.kind !== 'camp'
    root.querySelector<HTMLElement>('.hero')!.hidden = next.kind !== 'camp'
    if (next.kind === 'camp') {
      window.scrollTo({ top: campScroll, behavior: 'instant' })
      const fallback = root.querySelector<HTMLElement>('.brand')!
      ;(originFocus?.isConnected && originFocus.offsetParent ? originFocus : fallback).focus({ preventScroll: true })
    } else {
      panel.innerHTML = next.kind === 'section' ? sectionMarkup(next.section) : caseMarkup(next.id)
      focusReading(next)
    }
    const changesUrl = next.kind === 'camp' ? !!location.hash : location.hash !== path(next)
    if (push && !restoring && changesUrl) history.pushState(next, '', path(next))
  }
  const restore = (view: View, controller: ReturnType<typeof createController>) => {
    restoring = true
    controller.dispatch({ type: 'restore', view: view.kind === 'case' ? { kind: 'project', project: view.id } : view })
    show(view, false)
    restoring = false
  }
  const restoreUrl = (controller: ReturnType<typeof createController>) => {
    const hash = location.hash.slice(1).split('/')
    const section = Object.entries(urls).find(([, value]) => hash[0] === value)?.[0] as Section | undefined
    const id = hash[1]
    const view: View = section === 'projects' && (id === 'foxmind' || id === 'flower')
      ? { kind: 'case' as const, id } : section ? { kind: 'section' as const, section } : { kind: 'camp' as const }
    restore(view, controller)
    history.replaceState(view, '', location.href)
  }
  return { show, restore, restoreUrl, get current() { return current },
    saveFocus() { originFocus = document.activeElement as HTMLElement },
  }
}

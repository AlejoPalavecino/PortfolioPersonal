import type { CaseId, Section } from '../entities'
import { caseMarkup, sectionMarkup } from '../widgets'
import type { createController } from './controller'

export type View = { kind: 'camp' } | { kind: 'section'; section: Section } | { kind: 'case'; id: CaseId }
export type ViewOptions = { onView?: (view: View) => void; onCamp?: () => void }
type Reading = { scroll: number; focus: number }
type Context = {
  root: HTMLElement; panel: HTMLElement; current: View; reading: Map<string, Reading>
  origin: HTMLElement | null; restoring: boolean; options: ViewOptions
}
const urls: Record<Section, string> = {
  projects: 'proyectos', about: 'sobre-mi', journey: 'trayectoria', contact: 'contacto',
}
const key = (view: View) => JSON.stringify(view)
const controls = (panel: HTMLElement) => [...panel.querySelectorAll<HTMLElement>('button,a')]
const path = (view: View) => view.kind === 'camp' ? location.pathname
  : view.kind === 'case' ? `#proyectos/${view.id}` : `#${urls[view.section]}`

function remember(context: Context) {
  if (context.current.kind === 'camp') return
  const scroll = context.panel.querySelector<HTMLElement>('.panel-scroll')!
  context.reading.set(key(context.current), {
    scroll: scroll.scrollTop,
    focus: controls(context.panel).indexOf(document.activeElement as HTMLElement),
  })
}

function renderReading(context: Context, view: Exclude<View, { kind: 'camp' }>) {
  const source = document.createElement('div')
  source.innerHTML = view.kind === 'section' ? sectionMarkup(view.section) : caseMarkup(view.id)
  const heading = source.querySelector('h2')!
  const title = heading.textContent ?? ''
  const navigation = source.querySelector('.panel-nav')!
  const header = document.createElement('header')
  const sceneStatus = context.root.querySelector<HTMLElement>('.scene-status')
  header.className = 'panel-header'
  header.innerHTML = '<span class="eyebrow">CUADERNO DEL CAMPAMENTO · REVISIÓN</span>'
  header.append(navigation)
  heading.id = 'reading-title'; heading.tabIndex = -1
  header.append(heading)
  if (sceneStatus) header.append(sceneStatus)
  const scroll = document.createElement('div')
  scroll.className = 'panel-scroll'; scroll.tabIndex = 0
  scroll.setAttribute('aria-label', `Contenido de ${title}`)
  scroll.append(...source.childNodes)
  context.panel.replaceChildren(header, scroll)
  const previous = context.reading.get(key(view))
  scroll.scrollTop = previous?.scroll ?? 0
  const focus = previous ? controls(context.panel)[previous.focus] ?? heading : heading
  focus.focus({ preventScroll: true })
}

function show(context: Context, next: View, push = true) {
  if (key(context.current) === key(next)) return
  remember(context)
  context.current = next
  context.panel.hidden = next.kind === 'camp'
  context.root.querySelector<HTMLElement>('.world')!.inert = next.kind !== 'camp'
  context.root.dataset.reading = String(next.kind !== 'camp')
  context.options.onView?.(next)
  if (next.kind === 'camp') {
    const sceneStatus = context.panel.querySelector<HTMLElement>('.scene-status')
    if (sceneStatus) context.root.querySelector('main')!.append(sceneStatus)
    context.options.onCamp?.()
    const fallback = context.root.querySelector<HTMLElement>('[data-action=menu],.menu-toggle,.world')!
    const origin = context.origin?.isConnected && context.origin.offsetParent ? context.origin : fallback
    origin.focus({ preventScroll: true })
  } else renderReading(context, next)
  const changesUrl = next.kind === 'camp' ? !!location.hash : location.hash !== path(next)
  if (push && !context.restoring && changesUrl) history.pushState(next, '', path(next))
}

export function createViews(root: HTMLElement, options: ViewOptions = {}) {
  const panel = root.querySelector<HTMLElement>('.panel')!
  panel.setAttribute('role', 'region')
  panel.setAttribute('aria-labelledby', 'reading-title')
  const context: Context = { root, panel, current: { kind: 'camp' }, reading: new Map(),
    origin: null, restoring: false, options }
  const restore = (view: View, controller: ReturnType<typeof createController>) => {
    context.restoring = true
    controller.dispatch({ type: 'restore', view: view.kind === 'case' ? { kind: 'project', project: view.id } : view })
    show(context, view, false)
    context.restoring = false
  }
  const restoreUrl = (controller: ReturnType<typeof createController>) => {
    const hash = location.hash.slice(1).split('/')
    const section = Object.entries(urls).find(([, value]) => hash[0] === value)?.[0] as Section | undefined
    const id = hash[1]
    const view: View = section === 'projects' && (id === 'foxmind' || id === 'flower')
      ? { kind: 'case', id } : section ? { kind: 'section', section } : { kind: 'camp' }
    restore(view, controller)
    history.replaceState(view, '', location.href)
  }
  return {
    show: (next: View, push = true) => show(context, next, push), restore, restoreUrl,
    get current() { return context.current },
    saveFocus() { context.origin = document.activeElement as HTMLElement },
  }
}

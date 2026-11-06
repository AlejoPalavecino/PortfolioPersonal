import { cases, credentialById, type CaseId, type Section } from '../entities'
import { roomForView } from '../core/experience'
import { assetUrl, createRoomLoader, ROOM_META } from '../shared'
import { caseMarkup, sectionMarkup, recognitionsMarkup, credentialMarkup } from '../widgets'
import type { createController } from './controller'

import type { View, ViewOptions, RoomContext as Context } from './room-types'
import { clearActorTimers, copyReaction, bindRoomInteractions, defaultReactionForView, updateActorBubble } from './room-actor'
import { buildRoomShell, syncRoomBackdrop, refreshRoomNavigation } from './room-shell'
import { t } from '../shared/i18n'
import { bindObjectInteractions } from './room-interactions'
export type { View } from './room-types'

const urls: Record<Section, string> = {
  projects: 'proyectos', about: 'sobre-mi', journey: 'trayectoria', contact: 'contacto',
}
const key = (view: View) => JSON.stringify(view)
const controls = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('button,a')]
const path = (view: View) => view.kind === 'camp' ? location.pathname + location.search
  : view.kind === 'case' ? `#proyectos/${view.id}` : view.kind === 'recognitions' ? '#trayectoria/reconocimientos'
    : view.kind === 'credential' ? `#trayectoria/reconocimientos/${view.id}` : `#${urls[view.section]}`

function remember(context: Context) {
  if (context.current.kind === 'camp') return
  const scroll = context.panel.querySelector?.<HTMLElement>('.panel-scroll')
  if (!scroll) return
  const active = document.activeElement as HTMLElement | null
  let selector: string | null = null
  if (active && scroll.contains?.(active)) {
    if (active.dataset?.case) selector = `[data-case="${active.dataset.case}"]`
    else if (active.dataset?.credential) selector = `[data-credential="${active.dataset.credential}"]`
    else if (active.dataset?.action) selector = `[data-action="${active.dataset.action}"]`
  }
  context.reading.set(key(context.current), {
    scroll: scroll.scrollTop,
    focus: controls(scroll).indexOf(active as HTMLElement),
    selector,
    objects: { ...scroll.querySelector<HTMLElement>('.panel-content')?.dataset },
  })
}

function bindMediaState(container: HTMLElement) {
  container.querySelectorAll<HTMLImageElement>('img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) return
    img.dataset.loading = 'true'
    const clear = () => { delete img.dataset.loading; delete img.dataset.failed }
    img.addEventListener('load', clear, { once: true })
    img.addEventListener('error', () => {
      delete img.dataset.loading
      img.dataset.failed = 'true'
      if (img.nextElementSibling?.classList.contains('media-error')) return
      const note = document.createElement('p')
      note.className = 'media-error'
      note.innerHTML = 'No se pudo cargar la imagen. <button type="button" class="text-button">Reintentar</button>'
      note.querySelector('button')?.addEventListener('click', () => {
        note.remove()
        img.dataset.loading = 'true'
        delete img.dataset.failed
        const base = img.src.split('?')[0]!
        img.src = `${base}?r=${Date.now()}`
      })
      img.after(note)
    })
  })
}

function clearTimers(context: Context) {
  if (context.closeTimer !== undefined) { window.clearTimeout(context.closeTimer); context.closeTimer = undefined }
  if (context.entryTimer !== undefined) { window.clearTimeout(context.entryTimer); context.entryTimer = undefined }
  if (context.curtainTimer !== undefined) { window.clearTimeout(context.curtainTimer); context.curtainTimer = undefined }
  clearActorTimers(context)
  if (context.offLoader) { context.offLoader(); context.offLoader = undefined }
}

function hideCurtain(root: HTMLElement) {
  const curtain = root.querySelector?.<HTMLElement>('.room-curtain')
  if (!curtain) return
  curtain.hidden = true
  curtain.classList.remove('is-active', 'is-loading')
}

function showCurtain(root: HTMLElement, section: Section, isLoading: boolean) {
  const curtain = root.querySelector?.<HTMLElement>('.room-curtain')
  if (!curtain) return
  const meta = ROOM_META[section]
  const icon = curtain.querySelector<HTMLImageElement>('.room-curtain-icon')
  const text = curtain.querySelector<HTMLElement>('.room-curtain-text')
  const sub = curtain.querySelector<HTMLElement>('.room-curtain-sub')
  const forceBtn = curtain.querySelector<HTMLButtonElement>('[data-action="force-room"]')
  if (icon) icon.src = assetUrl(meta.iconAsset)
  if (text) text.textContent = isLoading ? meta.loadingLabel : meta.enteringLabel
  if (sub) sub.textContent = isLoading ? `${meta.title} · Descargando escenario` : `${meta.number} · ${meta.title}`
  if (forceBtn) forceBtn.hidden = !isLoading
  curtain.hidden = false
  curtain.classList.add('is-active')
  curtain.classList.toggle('is-loading', isLoading)
}

function renderReading(context: Context, view: Exclude<View, { kind: 'camp' }>, animateActor = false) {
  const room = roomForView(view)!
  const source = document.createElement('div')
  source.innerHTML = view.kind === 'section' ? sectionMarkup(view.section) : view.kind === 'case' ? caseMarkup(view.id)
    : view.kind === 'recognitions' ? recognitionsMarkup() : credentialMarkup(view.id)
  const heading = source.querySelector('h2')!
  const title = heading.textContent ?? ''
  const navigation = source.querySelector('.panel-nav')
  const sourceEyebrow = source.querySelector('.eyebrow')
  sourceEyebrow?.remove()
  const header = document.createElement('header')
  const sceneStatus = context.root.querySelector<HTMLElement>('.scene-status')
  header.className = 'panel-header'
  header.dataset.subview = String(view.kind !== 'section')
  if (navigation?.childElementCount) header.append(navigation)
  heading.id = 'reading-title'; heading.tabIndex = -1
  header.append(heading)
  if (sceneStatus) header.append(sceneStatus)

  const scroll = buildRoomShell(context, room, animateActor)
  scroll.setAttribute('aria-label', t(`Contenido de ${title}`, `Content of ${title}`))
  const content = document.createElement('div')
  content.className = 'panel-content'
  content.append(...source.childNodes)
  bindMediaState(content)
  bindRoomInteractions(context, content, view)
  bindObjectInteractions(content, context.reading.get(key(view))?.objects)
  updateActorBubble(context, defaultReactionForView(view), false)
  scroll.replaceChildren(header, content)

  const previous = context.reading.get(key(view))
  scroll.scrollTop = previous?.scroll ?? 0
  const bySelector = previous?.selector ? scroll.querySelector<HTMLElement>(previous.selector) : null
  const byIndex = previous && previous.focus >= 0 ? controls(scroll)[previous.focus] : null
  const focus = bySelector ?? byIndex ?? heading
  focus.focus({ preventScroll: true })
}

function commitInterior(context: Context, next: Exclude<View, { kind: 'camp' }>, wasCamp: boolean, sameRoom: boolean, animateActor: boolean) {
  const room = roomForView(next)!
  const kind = next.kind === 'section' ? next.section : next.kind
  context.panel.hidden = false
  context.panel.inert = false
  context.panel.dataset.transition = wasCamp ? 'open' : sameRoom ? 'subview' : 'change'
  context.panel.dataset.variant = kind
  context.panel.dataset.surface = next.kind === 'section' ? 'object' : 'dossier'
  context.root.querySelector<HTMLElement>('.world')?. toggleAttribute('inert', true)
  context.root.dataset.reading = 'true'
  context.root.dataset.room = room
  context.root.dataset.sceneStage = 'interior'
  delete context.root.dataset.enteringRoom
  context.options.onView?.(next)
  if (wasCamp) context.options.bus?.emit('surface-open', { kind })
  else context.options.bus?.emit('page-change', { kind })
  renderReading(context, next, animateActor)
  const scroll = context.panel.querySelector<HTMLElement>('.panel-scroll')
  if (context.root.dataset.motion !== 'reduced') {
    scroll?.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180 })
  }
}

function show(context: Context, next: View, push = true) {
  const spatialSection = context.pendingSpatialSection
  context.pendingSpatialSection = null

  if (key(context.current) === key(next)) {
    if (push && next.kind === 'camp' && location.hash) history.pushState(next, '', location.pathname)
    return
  }
  context.panel.querySelector('details.room-navigation')?.removeAttribute('open')
  remember(context)
  const prevRoom = roomForView(context.current)
  const nextRoom = roomForView(next)
  const wasCamp = context.current.kind === 'camp'
  const sameRoom = prevRoom !== null && prevRoom === nextRoom
  context.current = next
  const transition = ++context.transition
  clearTimers(context)
  hideCurtain(context.root)
  context.panel.getAnimations?.({ subtree: true }).forEach(animation => animation.cancel())

  const changesUrl = next.kind === 'camp' ? !!location.hash : location.hash !== path(next)
  if (push && !context.restoring && changesUrl) history.pushState(next, '', path(next))

  if (next.kind === 'camp') {
    context.mountedRoom = null
    delete context.root.dataset.room
    delete context.root.dataset.enteringRoom
    context.root.dataset.sceneStage = 'exploring'
    if (!context.panel.hidden && context.root.dataset.motion !== 'reduced') {
      context.panel.dataset.transition = 'close'; context.panel.inert = true
      context.closeTimer = window.setTimeout(() => { if (context.transition === transition) context.panel.hidden = true }, 180)
    } else {
      context.panel.hidden = true; context.panel.inert = false
    }
    const world = context.root.querySelector<HTMLElement>('.world')
    if (world) world.inert = false
    context.root.dataset.reading = 'false'
    context.options.onView?.(next)
    context.options.bus?.emit('surface-close', {})
    const sceneStatus = context.panel.querySelector?.<HTMLElement>('.scene-status')
    if (sceneStatus) context.root.querySelector('main')?.append(sceneStatus)
    context.options.onCamp?.()
    const signFallback = prevRoom ? context.root.querySelector<HTMLElement>(`.world-label[data-section="${prevRoom}"]`) : null
    const fallback = signFallback ?? context.root.querySelector<HTMLElement>('[data-action=menu],.menu-toggle,.world')
    const dock = prevRoom ? context.root.querySelector<HTMLElement>(`.camp-destinations [data-section="${prevRoom}"]`) : null
    const visible = (element: HTMLElement | null) => !!element?.offsetParent && getComputedStyle(element).visibility !== 'hidden'
    const origin = visible(context.origin) ? context.origin : visible(signFallback) ? signFallback : visible(dock) ? dock : fallback
    origin?.focus({ preventScroll: true })
    return
  }

  // Always ensure the target room's background is being prefetched.
  if (nextRoom) void context.roomLoader.prefetch(nextRoom)

  const reduced = context.root.dataset.motion === 'reduced'
  const hasCurtainDom = !!context.root.querySelector?.('.room-curtain')
  const useSpatialSequence = !context.restoring && !reduced && hasCurtainDom && wasCamp && next.kind === 'section' && spatialSection === next.section

  if (!useSpatialSequence) {
    commitInterior(context, next, wasCamp, sameRoom, !sameRoom && !reduced)
    return
  }

  // Spatial entry choreography: threshold gesture (280ms) -> curtain/asset gate -> interior reveal.
  const room = next.section
  context.root.dataset.sceneStage = 'entering'
  context.root.dataset.enteringRoom = room
  const world = context.root.querySelector<HTMLElement>('.world')
  if (world) world.inert = true

  context.entryTimer = window.setTimeout(() => {
    if (context.transition !== transition) return
    const snapshot = context.roomLoader.get(room)
    if (snapshot.status === 'loading') {
      context.root.dataset.sceneStage = 'room-loading'
      showCurtain(context.root, room, true)
      context.offLoader = context.roomLoader.subscribe((loadedSection, state) => {
        if (loadedSection !== room || context.transition !== transition) return
        if (state.status === 'ready' || state.status === 'failed') {
          context.offLoader?.(); context.offLoader = undefined
          commitInterior(context, next, wasCamp, false, true)
          context.curtainTimer = window.setTimeout(() => {
            if (context.transition === transition) hideCurtain(context.root)
          }, 160)
        }
      })
      return
    }
    showCurtain(context.root, room, false)
    commitInterior(context, next, wasCamp, false, true)
    context.curtainTimer = window.setTimeout(() => {
      if (context.transition === transition) hideCurtain(context.root)
    }, 220)
  }, 280)
}

export function createViews(root: HTMLElement, options: ViewOptions = {}) {
  const panel = root.querySelector<HTMLElement>('.panel')!
  panel.setAttribute('role', 'region')
  panel.setAttribute('aria-labelledby', 'reading-title')
  const roomLoader = options.roomLoader ?? createRoomLoader()
  const context: Context = {
    root, panel, current: { kind: 'camp' }, reading: new Map(),
    origin: null, restoring: false, options, transition: 0,
    roomLoader, pendingSpatialSection: null, mountedRoom: null,
  }

  options.bus?.on('destination-selected', ({ section }) => {
    void roomLoader.prefetch(section)
  })
  options.bus?.on('arrive', ({ section }) => {
    if (section) {
      void roomLoader.prefetch(section)
      context.pendingSpatialSection = section
    }
  })
  options.bus?.on('route-cancel', () => {
    context.pendingSpatialSection = null
    if (context.root.dataset.sceneStage === 'entering' || context.root.dataset.sceneStage === 'room-loading') {
      ++context.transition
      clearTimers(context)
      hideCurtain(context.root)
      delete context.root.dataset.enteringRoom
      context.root.dataset.sceneStage = 'exploring'
    }
  })

  window.addEventListener('resize', () => {
    const room = roomForView(context.current)
    if (!room) return
    if (context.mountedRoom === room) syncRoomBackdrop(context, room)
    else void roomLoader.prefetch(room)
  })
  const restore = (view: View, controller: ReturnType<typeof createController>) => {
    context.restoring = true
    context.pendingSpatialSection = null
    controller.dispatch({ type: 'restore', view: view.kind === 'case' ? { kind: 'project', project: view.id } : view })
    show(context, view, false)
    context.restoring = false
  }
  const restoreUrl = (controller: ReturnType<typeof createController>) => {
    const hash = location.hash.slice(1).split('/')
    const section = Object.entries(urls).find(([, value]) => hash[0] === value)?.[0] as Section | undefined
    const id = hash[1]
    const view: View = section === 'journey' && id === 'reconocimientos'
      ? hash[2] && credentialById(hash[2]) ? { kind: 'credential', id: hash[2] } : { kind: 'recognitions' }
      : section === 'projects' && id && Object.prototype.hasOwnProperty.call(cases, id)
      ? { kind: 'case', id: id as CaseId } : section ? { kind: 'section', section } : { kind: 'camp' }
    restore(view, controller)
    history.replaceState(view, '', path(view))
  }
  const forceOpenPendingRoom = () => {
    if (context.current.kind === 'camp') return
    clearTimers(context)
    hideCurtain(context.root)
    commitInterior(context, context.current, true, false, false)
  }
  const retryRoomBackground = (room: Section) => {
    const stage = context.panel.querySelector?.<HTMLElement>('.room-stage')
    const retryBar = context.panel.querySelector?.<HTMLElement>('.room-bg-fallback')
    if (stage) stage.dataset.bgState = 'loading'
    if (retryBar) retryBar.hidden = true
    void roomLoader.retry(room).then(() => {
      if (context.mountedRoom === room) syncRoomBackdrop(context, room)
    })
  }
  const relocalize = () => {
    if (context.current.kind === 'camp' || context.panel.hidden) return
    if (context.root.dataset.sceneStage === 'entering' || context.root.dataset.sceneStage === 'room-loading') return
    remember(context)
    refreshRoomNavigation(context, roomForView(context.current)!)
    renderReading(context, context.current, false)
  }
  return {
    show: (next: View, push = true) => show(context, next, push), restore, restoreUrl, relocalize,
    forceOpenPendingRoom, retryRoomBackground, roomLoader,
    copyResult: (success: boolean) => copyReaction(context, success),
    get current() { return context.current },
    saveFocus() { context.origin = document.activeElement as HTMLElement },
  }
}

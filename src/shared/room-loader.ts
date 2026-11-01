import type { Section } from '../core/domain'
import { assetUrl } from './index'

export type RoomTheme = 'workbench' | 'linen' | 'journal' | 'radio'
export type RoomAssetStatus = 'idle' | 'loading' | 'ready' | 'failed'

export type RoomMeta = Readonly<{
  section: Section
  number: string
  title: string
  shortLabel: string
  eyebrow: string
  enteringLabel: string
  loadingLabel: string
  theme: RoomTheme
  fallbackBg: string
  desktopAsset: string
  portraitAsset: string
  iconAsset: string
  frameAsset: string
  introFx: 'door-open' | 'canvas-open' | 'journal-open' | 'radio-signal'
}>

export const ROOM_META: Readonly<Record<Section, RoomMeta>> = {
  projects: {
    section: 'projects',
    number: '01',
    title: 'Taller de soluciones',
    shortLabel: 'Proyectos',
    eyebrow: 'CAMPAMENTO / TALLER DE SOLUCIONES',
    enteringLabel: 'Entrando al taller…',
    loadingLabel: 'Preparando el interior…',
    theme: 'workbench',
    fallbackBg: '#241b16',
    desktopAsset: 'camp-rooms-v1/rooms/projects-desktop.webp',
    portraitAsset: 'camp-rooms-v1/rooms/projects-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-projects@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-workbench-9slice.png',
    introFx: 'door-open',
  },
  about: {
    section: 'about',
    number: '02',
    title: 'Carpa personal',
    shortLabel: 'Sobre mí',
    eyebrow: 'CAMPAMENTO / CARPA PERSONAL',
    enteringLabel: 'Entrando a la carpa…',
    loadingLabel: 'Preparando el interior…',
    theme: 'linen',
    fallbackBg: '#1f2a24',
    desktopAsset: 'camp-rooms-v1/rooms/about-desktop.webp',
    portraitAsset: 'camp-rooms-v1/rooms/about-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-about@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-linen-9slice.png',
    introFx: 'canvas-open',
  },
  journey: {
    section: 'journey',
    number: '03',
    title: 'Archivo de expedición',
    shortLabel: 'Trayectoria',
    eyebrow: 'CAMPAMENTO / ARCHIVO DE EXPEDICIÓN',
    enteringLabel: 'Abriendo el archivo…',
    loadingLabel: 'Preparando el interior…',
    theme: 'journal',
    fallbackBg: '#261e17',
    desktopAsset: 'camp-rooms-v1/rooms/journey-desktop.webp',
    portraitAsset: 'camp-rooms-v1/rooms/journey-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-journey@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-journal-9slice.png',
    introFx: 'journal-open',
  },
  contact: {
    section: 'contact',
    number: '04',
    title: 'Puesto de radio',
    shortLabel: 'Contacto',
    eyebrow: 'CAMPAMENTO / PUESTO DE RADIO',
    enteringLabel: 'Conectando puesto de radio…',
    loadingLabel: 'Preparando el interior…',
    theme: 'radio',
    fallbackBg: '#16262f',
    desktopAsset: 'camp-rooms-v1/rooms/contact-desktop.webp',
    portraitAsset: 'camp-rooms-v1/rooms/contact-portrait.webp',
    iconAsset: 'camp-rooms-v1/ui/icon-contact@4x.png',
    frameAsset: 'camp-rooms-v1/ui/frame-radio-9slice.png',
    introFx: 'radio-signal',
  },
}

export function roomVariantAsset(section: Section, portrait = false): string {
  const meta = ROOM_META[section]
  return assetUrl(portrait ? meta.portraitAsset : meta.desktopAsset)
}

function defaultDecodeImage(url: string): Promise<void> {
  if (typeof Image === 'undefined') return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`No se pudo cargar ${url}`))
    img.src = url
  })
}

export type RoomStateSnapshot = {
  status: RoomAssetStatus
  url: string
  generation: number
}

export function createRoomLoader(
  decodeImage: (url: string) => Promise<void> = defaultDecodeImage,
  isPortrait: () => boolean = () => typeof window !== 'undefined' && typeof matchMedia === 'function' ? matchMedia('(max-width: 700px)').matches : false,
) {
  const states = new Map<Section, RoomStateSnapshot>()
  const inflight = new Map<Section, Promise<RoomAssetStatus>>()
  const listeners = new Set<(section: Section, snapshot: RoomStateSnapshot) => void>()
  let disposed = false

  const getSnapshot = (section: Section): RoomStateSnapshot => {
    const portrait = isPortrait()
    const url = roomVariantAsset(section, portrait)
    const existing = states.get(section)
    if (existing && existing.url.split('?')[0] === url) return existing
    const initial: RoomStateSnapshot = { status: 'idle', url, generation: existing ? existing.generation : 0 }
    states.set(section, initial)
    return initial
  }

  const notify = (section: Section, snapshot: RoomStateSnapshot) => {
    if (disposed) return
    for (const listener of [...listeners]) listener(section, snapshot)
  }

  const load = (section: Section, forceRetry = false): Promise<RoomAssetStatus> => {
    if (disposed) return Promise.resolve('idle')
    const current = getSnapshot(section)
    if (current.status === 'ready' && !forceRetry) return Promise.resolve('ready')
    if (current.status === 'loading' && !forceRetry) {
      const pending = inflight.get(section)
      if (pending) return pending
    }
    const generation = current.generation + 1
    const url = roomVariantAsset(section, isPortrait())
    const loadingState: RoomStateSnapshot = { status: 'loading', url, generation }
    states.set(section, loadingState)
    notify(section, loadingState)

    const promise = Promise.resolve()
      .then(() => decodeImage(url))
      .then((): RoomAssetStatus => {
        const latest = states.get(section)
        if (disposed || !latest || latest.generation !== generation) return latest?.status ?? 'idle'
        const readyState: RoomStateSnapshot = { status: 'ready', url, generation }
        states.set(section, readyState)
        inflight.delete(section)
        notify(section, readyState)
        return 'ready'
      })
      .catch((): RoomAssetStatus => {
        const latest = states.get(section)
        if (disposed || !latest || latest.generation !== generation) return latest?.status ?? 'idle'
        const failedState: RoomStateSnapshot = { status: 'failed', url, generation }
        states.set(section, failedState)
        inflight.delete(section)
        notify(section, failedState)
        return 'failed'
      })

    inflight.set(section, promise)
    return promise
  }

  return {
    get(section: Section): RoomStateSnapshot {
      return getSnapshot(section)
    },
    prefetch(section: Section): Promise<RoomAssetStatus> {
      return load(section, false)
    },
    retry(section: Section): Promise<RoomAssetStatus> {
      const existing = states.get(section)
      const baseUrl = roomVariantAsset(section, isPortrait()).split('?')[0]!
      const retryUrl = `${baseUrl}?r=${Date.now()}`
      const generation = (existing?.generation ?? 0) + 1
      const loadingState: RoomStateSnapshot = { status: 'loading', url: retryUrl, generation }
      states.set(section, loadingState)
      notify(section, loadingState)
      const promise = Promise.resolve()
        .then(() => decodeImage(retryUrl))
        .then((): RoomAssetStatus => {
          const latest = states.get(section)
          if (disposed || !latest || latest.generation !== generation) return latest?.status ?? 'idle'
          const readyState: RoomStateSnapshot = { status: 'ready', url: retryUrl, generation }
          states.set(section, readyState)
          inflight.delete(section)
          notify(section, readyState)
          return 'ready'
        })
        .catch((): RoomAssetStatus => {
          const latest = states.get(section)
          if (disposed || !latest || latest.generation !== generation) return latest?.status ?? 'idle'
          const failedState: RoomStateSnapshot = { status: 'failed', url: retryUrl, generation }
          states.set(section, failedState)
          inflight.delete(section)
          notify(section, failedState)
          return 'failed'
        })
      inflight.set(section, promise)
      return promise
    },
    subscribe(fn: (section: Section, snapshot: RoomStateSnapshot) => void): () => void {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    dispose() {
      disposed = true
      listeners.clear()
      inflight.clear()
    },
  }
}
export type RoomLoader = ReturnType<typeof createRoomLoader>

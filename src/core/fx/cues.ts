import type { Point, Section } from '../domain'
import type { Surface } from './surface'

/**
 * Every audiovisual reaction hangs off one of these cues. Game state publishes them;
 * visual and audio layers subscribe. Nothing in the game logic depends on a subscriber.
 */
export type CueMap = {
  'prepare-start': Record<string, never>
  'prepare-progress': { completed: number; total: number; task: string }
  'prepare-slow': Record<string, never>
  'prepare-ready': Record<string, never>
  'prepare-failed': { error: string | null }
  'intro-cue': { kind: 'step' | 'greeting' | 'voice' | 'reply' | 'depart' }
  'enter': { reduced: boolean }
  'move-start': { mode: 'route' | 'manual' }
  'move-stop': { reason: 'arrive' | 'cancel' | 'release' | 'pause' | 'open' | 'replace' }
  'step': { foot: 'left' | 'right'; surface: Surface; point: Point }
  'ground-tap': { point: Point }
  'destination-selected': { section: Section; point: Point; path: readonly Point[] }
  'route-cancel': { reason: 'replace' | 'cancel' | 'manual' | 'open' | 'pause' }
  'arrive': { section: Section | null; point: Point }
  'surface-open': { kind: string }
  'surface-close': Record<string, never>
  'page-change': { kind: string }
  'pause': { reason: 'hidden' | 'menu' | 'reading' }
  'resume': { reason: 'visible' | 'menu' | 'reading' }
}
export type CueName = keyof CueMap
export const CUE_NAMES: readonly CueName[] = [
  'intro-cue', 'prepare-start', 'prepare-progress', 'prepare-slow', 'prepare-ready', 'prepare-failed', 'enter',
  'move-start', 'move-stop', 'step', 'ground-tap', 'destination-selected', 'route-cancel', 'arrive',
  'surface-open', 'surface-close', 'page-change', 'pause', 'resume',
]

type Handler<K extends CueName> = (payload: CueMap[K]) => void

export function createCueBus() {
  const handlers = new Map<CueName, Set<(payload: never) => void>>()
  return {
    /** Subscribe; the returned function removes exactly this subscription. */
    on<K extends CueName>(name: K, handler: Handler<K>): () => void {
      const set = handlers.get(name) ?? new Set()
      set.add(handler as (payload: never) => void)
      handlers.set(name, set)
      return () => { set.delete(handler as (payload: never) => void) }
    },
    /** A failing subscriber must never break gameplay or the other subscribers. */
    emit<K extends CueName>(name: K, payload: CueMap[K]): void {
      for (const handler of [...(handlers.get(name) ?? [])]) {
        try { (handler as Handler<K>)(payload) } catch (error) { console.error(`cue ${name}`, error) }
      }
    },
    size(name?: CueName): number {
      return name ? handlers.get(name)?.size ?? 0 : [...handlers.values()].reduce((sum, set) => sum + set.size, 0)
    },
    dispose() { handlers.clear() },
  }
}
export type CueBus = ReturnType<typeof createCueBus>

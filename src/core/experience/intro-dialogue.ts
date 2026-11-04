/** Dialogue never advances on a timer: visitors control their reading pace. */
export type IntroDialogue = 'greeting' | 'camp' | 'work'
export const INTRO_ARRIVAL_MS = 2800
export const INTRO_LINES: Readonly<Record<IntroDialogue, { title: string; text: string; marker: string }>> = {
  greeting: { title: '¡Ey, llegaste!', text: 'Soy Alejo. Este campamento está lleno de ideas hechas software. ¿Qué te gustaría descubrir?', marker: '!' },
  camp: { title: 'Te muestro el camino.', text: 'El taller guarda mis proyectos; la carpa, mi historia. Elegí un lugar y caminamos hasta ahí. ¿Vamos?', marker: '→' },
  work: { title: 'De una idea a algo real.', text: 'Desarrollo productos web, conecto sistemas y automatizo procesos con IA. En el taller podés conocer mi trabajo.', marker: '</>' },
}
/** Limit catch-up after stalls; a hidden tab must never fast-forward the arrival. */
export function advanceIntroArrival(elapsed: number, dt: number, paused: boolean): number {
  return paused ? elapsed : Math.min(INTRO_ARRIVAL_MS, elapsed + Math.max(0, Math.min(dt, 100)))
}
export function visibleDialogue(text: string, elapsed: number, instant: boolean): string {
  return instant ? text : text.slice(0, Math.max(0, Math.floor(elapsed / 22)))
}

/** Dialogue never advances on a timer: visitors control their reading pace. */
const t = (es: string, en: string): string => typeof location !== 'undefined' && new URLSearchParams(location.search).get('lang') === 'en' ? en : es

export type IntroDialogue = 'greeting' | 'camp' | 'work'
export const INTRO_ARRIVAL_MS = 2800
export const INTRO_LINES: Readonly<Record<IntroDialogue, { title: string; text: string; marker: string }>> = {
  greeting: { get title() { return t('¡Ey, llegaste!', 'Hey, you made it!') }, get text() { return t('Este es mi lugar para crear y compartir. Detrás de cada proyecto hay una historia. ¿Por dónde querés empezar?', 'This is my little place for making and sharing things. Every project has a story. Where should we start?') }, marker: '!' },
  camp: { get title() { return t('Te muestro el camino.', 'Let me show you around.') }, get text() { return t('El taller guarda mis proyectos; la carpa, mi historia. Elegí un lugar y caminamos hasta ahí. ¿Vamos?', 'My projects are in the workshop, my story is in the tent. Pick a place and we’ll walk there.') }, marker: '→' },
  work: { get title() { return t('De una idea a algo real.', 'From an idea to something real.') }, get text() { return t('Trabajo en full stack, análisis y automatización con IA. Me gusta conectar una buena idea con una solución que sirva. En el taller te muestro mis proyectos.', 'I work across full stack development, systems analysis and AI automation. I like turning good ideas into things people can use.') }, marker: '</>' },
}
/** Limit catch-up after stalls; a hidden tab must never fast-forward the arrival. */
export function advanceIntroArrival(elapsed: number, dt: number, paused: boolean): number {
  return paused ? elapsed : Math.min(INTRO_ARRIVAL_MS, elapsed + Math.max(0, Math.min(dt, 100)))
}
export function visibleDialogue(text: string, elapsed: number, instant: boolean): string {
  return instant ? text : text.slice(0, Math.max(0, Math.floor(elapsed / 22)))
}

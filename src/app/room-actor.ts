import type { Section } from '../entities'
import { assetUrl } from '../shared'
import { roomForView } from '../core/experience'
import type { RoomContext, View } from './room-types'

type Reaction = { status: string; quote: string }

export const ROOM_ACTOR_DEFAULTS: Record<Section, Reaction> = {
  projects: { status: 'ALEJO · EN EL TALLER', quote: 'Estos planos cuentan dos maneras de resolver una necesidad real.' },
  about: { status: 'ALEJO · EN LA CARPA', quote: 'Primero entiendo el problema. Después pienso cómo construir la solución.' },
  journey: { status: 'ALEJO · EN LA BITÁCORA', quote: 'Cada experiencia deja algo para llevar al próximo proyecto.' },
  contact: { status: 'ALEJO · EN LA RADIO', quote: 'Contame qué tenés en mente y empecemos una conversación.' },
}

const reactions: Record<string, Reaction> = {
  foxmind: { status: 'ALEJO · FOXMIND', quote: 'Aprendizaje e inteligencia artificial, con alcance público limitado antes de pilotos.' },
  flower: { status: 'ALEJO · FLOWER', quote: 'Un sistema que acompaña el trabajo de una librería, con facturación automática mediante ARCA.' },
  recognitions: { status: 'ALEJO · EVIDENCIAS', quote: 'Acá reúno documentos que pueda compartir con su atribución verificada.' },
  laboral: { status: 'ALEJO · EQUIPOS', quote: 'Me interesa aportar a equipos que construyen productos útiles.' },
  proyecto: { status: 'ALEJO · A MEDIDA', quote: 'Podemos empezar por entender la necesidad y definir un alcance.' },
}

export function clearActorTimers(context: RoomContext) {
  if (context.poseTimer !== undefined) window.clearTimeout(context.poseTimer)
  context.poseTimer = undefined
  const actor = context.panel.querySelector<HTMLImageElement>('.room-actor')
  if (actor) actor.src = assetUrl('avatar/idle-down.webp')
}

export function defaultReactionForView(view: Exclude<View, { kind: 'camp' }>): Reaction {
  if (view.kind === 'case') return reactions[view.id]!
  if (view.kind === 'recognitions' || view.kind === 'credential') return reactions.recognitions!
  return ROOM_ACTOR_DEFAULTS[roomForView(view)!]
}

export function updateActorBubble(context: RoomContext, reaction: Reaction, glance = false) {
  const status = context.panel.querySelector<HTMLElement>('.room-actor-status')
  const quote = context.panel.querySelector<HTMLElement>('.room-actor-quote')
  if (status) status.textContent = reaction.status
  if (quote) quote.textContent = reaction.quote
  const actor = context.panel.querySelector<HTMLImageElement>('.room-actor')
  if (!glance || !actor || context.root.dataset.motion === 'reduced') return
  if (context.poseTimer !== undefined) window.clearTimeout(context.poseTimer)
  actor.src = assetUrl('avatar/idle-right.webp')
  context.poseTimer = window.setTimeout(() => {
    if (actor.isConnected) actor.src = assetUrl('avatar/idle-down.webp')
    context.poseTimer = undefined
  }, 400)
}

export function bindRoomInteractions(context: RoomContext, content: HTMLElement, view: Exclude<View, { kind: 'camp' }>) {
  const current = () => content.isConnected && context.current === view
  content.querySelectorAll<HTMLElement>('[data-project-card],[data-intent-card]').forEach(element => {
    const reaction = reactions[element.dataset.projectCard ?? element.dataset.intentCard ?? '']
    if (!reaction) return
    const react = () => { if (current()) updateActorBubble(context, reaction, true) }
    const restore = () => { if (current()) updateActorBubble(context, defaultReactionForView(view)) }
    element.addEventListener('pointerenter', react)
    element.addEventListener('focusin', react)
    element.addEventListener('pointerleave', restore)
    element.addEventListener('focusout', restore)
  })
}

export function copyReaction(context: RoomContext, success: boolean) {
  if (context.current.kind !== 'section' || context.current.section !== 'contact') return
  const reaction = success
    ? { status: 'CORREO COPIADO', quote: 'El correo ya está copiado. Escribime cuando quieras.' }
    : { status: 'COPIA MANUAL', quote: 'Podés seleccionar la dirección que aparece abajo.' }
  updateActorBubble(context, reaction, true)
}

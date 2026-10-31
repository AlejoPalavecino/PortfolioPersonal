import { sections } from '../entities'
import { assetUrl } from '../shared'
import { worldMarkup } from './world-markup'

const labels: Record<string, string> = { projects: 'Taller · Proyectos', about: 'Carpa · Sobre mí', journey: 'Bitácora · Trayectoria', contact: 'Radio · Contacto' }
const links = () => Object.entries(sections).map(([id]) =>
  `<button data-section="${id}"><span>${labels[id]}</span><span class="visited-mark" aria-hidden="true">✓</span></button>`).join('')

function hud(): string {
  return `<div class="hud-left"><button class="brand" data-action="home" aria-label="Volver al campamento"><img src="${assetUrl('emblem.webp')}" alt=""></button>
    <button class="menu-toggle" data-action="menu" aria-expanded="false">☰ <span>Campamento</span></button></div>
    <div class="hud-right"><button data-section="contact">Contacto</button><a href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>CV ↓</a><button data-action="help">Cómo jugar</button></div>
    <nav class="mobile-menu" aria-label="Menú del campamento" hidden><strong>Explorar el campamento</strong>${links()}
      <div class="settings"><button data-action="sound" aria-pressed="false">Sonido apagado</button><button data-action="motion" aria-pressed="false">Reducir movimiento</button></div>
    </nav>`
}
function intro(): string {
  return `<section class="intro" aria-label="Bienvenida"><div class="intro-card"><div class="loading-vignette" aria-hidden="true"><img src="${assetUrl('avatar/idle-down.webp')}" alt=""><span class="loading-lantern"></span></div><span class="intro-kicker">CAMPAMENTO CREATIVO</span><h1>Alejo Palavecino</h1>
    <p class="intro-subtitle">Un portfolio para explorar.</p><p>Full stack · Análisis · Automatización e IA</p>
    <p class="loading-status" role="status">Preparando el campamento…</p><button class="retry-intro" data-action="retry" hidden>Reintentar carga</button>
    <button class="enter-button" data-action="enter" disabled>Entrar al campamento →</button>
    <button class="direct-button" data-action="direct">Ver portfolio sin recorrer</button>
    <div class="intro-links"><button data-section="contact">Contacto</button><a href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>CV ↓</a></div>
  </div></section>`
}
export function shell(): string {
  return `<main id="main"><div class="landscape">${worldMarkup()}</div>${hud()}
    <div class="help-card" role="status"><p class="tutorial-hint" tabindex="-1">Elegí un destino para caminar. También podés explorar con WASD o las flechas.</p><button data-action="dismiss-help" aria-label="Cerrar ayuda">×</button></div>
    <p class="world-hint" role="status" hidden></p><div class="route-controls" hidden><span role="status" aria-live="polite">En camino…</span><button data-action="resume" hidden>Continuar recorrido</button><button data-action="open">Abrir ahora</button><button data-action="cancel">Cancelar recorrido</button></div>
    <section class="panel" hidden></section><p class="scene-status" role="status" hidden>El campamento no pudo cargarse. <button data-action="retry">Reintentar escena</button></p>${intro()}</main>`
}

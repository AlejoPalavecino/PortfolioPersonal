import { sections } from '../entities'
import { assetUrl } from '../shared'
import { worldMarkup } from './world-markup'

const labels: Record<string, string> = { projects: 'Taller · Proyectos', about: 'Carpa · Sobre mí', journey: 'Archivo · Trayectoria', contact: 'Radio · Contacto' }
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

function roomCurtain(): string {
  return `<div class="room-curtain" role="status" aria-live="polite" hidden>
    <div class="room-curtain-box">
      <img class="room-curtain-icon" src="${assetUrl('camp-rooms-v1/ui/icon-projects@4x.png')}" alt="" width="64" height="64">
      <p class="room-curtain-text">Entrando al taller…</p>
      <small class="room-curtain-sub">01 · Taller de soluciones</small>
      <button type="button" class="outline" data-action="force-room" hidden>Abrir contenido ahora →</button>
    </div>
  </div>`
}

function intro(): string {
  return `<section class="intro" aria-label="Bienvenida y presentación inicial">
    <div class="intro-cinematic" aria-hidden="true">
      <div class="intro-backdrop" style="--intro-desktop-url:url('${assetUrl('camp-rooms-v1/intro/mountain-arrival.webp')}');--intro-portrait-url:url('${assetUrl('camp-rooms-v1/intro/mountain-arrival-portrait.webp')}')"></div>
      <div class="intro-story-banner">
        <span class="intro-beat-kicker">LLEGADA AL CAMPAMENTO</span>
        <p class="intro-beat-title">Campamento creativo</p>
        <p class="intro-beat-subtitle">Desarrollo software. Transformo ideas en productos.</p>
      </div>
      <img class="intro-actor" src="${assetUrl('camp-rooms-v1/avatars/idle-right.png')}" width="160" height="288" alt="">
    </div>
    <div class="intro-top-bar" role="toolbar" aria-label="Controles de presentación">
      <button type="button" class="intro-pause-button" data-action="intro-pause" aria-pressed="false">Pausar presentación</button>
      <button type="button" class="intro-skip-button" data-action="skip-intro">Omitir presentación →</button>
    </div>
    <div class="intro-card">
      <div class="loading-vignette" aria-hidden="true"><canvas class="loading-canvas" width="160" height="72"></canvas></div>
      <span class="intro-kicker">CAMPAMENTO CREATIVO</span>
      <h1>Soy Alejo Palavecino</h1>
      <p class="intro-subtitle">Desarrollo software. Transformo ideas en productos.</p>
      <p class="intro-specialties">Full stack · Análisis · Automatización e IA</p>
      <div class="loading-progress" role="progressbar" aria-label="Preparación real de recursos del campamento" aria-valuemin="0" aria-valuemax="28" aria-valuenow="0"><span></span></div>
      <p class="loading-status">Preparando el campamento…</p>
      <button class="retry-intro" data-action="retry" hidden>Reintentar carga</button>
      <div class="intro-primary-actions">
        <button class="enter-button" data-action="enter" disabled>Entrar al campamento →</button>
        <button class="direct-button" data-action="direct">Ver portfolio sin recorrer</button>
      </div>
      <div class="intro-links">
        <button data-section="contact">Contacto</button>
        <a href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>CV ↓</a>
        <button type="button" data-action="sound" aria-pressed="false">Sonido apagado</button>
        <button type="button" data-action="motion" aria-pressed="false">Reducir movimiento</button>
      </div>
    </div>
  </section>`
}

export function shell(): string {
  return `<main id="main"><div class="landscape">${worldMarkup()}</div>${hud()}
    <div class="help-card" role="status"><p class="tutorial-hint" tabindex="-1">Elegí un destino para caminar y visitar su interior. También podés explorar con WASD o las flechas.</p><button data-action="dismiss-help" aria-label="Cerrar ayuda">×</button></div>
    <p class="world-hint" role="status" hidden></p><div class="route-controls" hidden><span role="status" aria-live="polite">En camino…</span><button data-action="resume" hidden>Continuar recorrido</button><button data-action="open">Abrir ahora</button><button data-action="cancel">Cancelar recorrido</button></div>
    ${roomCurtain()}<section class="panel" hidden></section><p class="scene-status" role="status" hidden>El campamento no pudo cargarse. <button data-action="retry">Reintentar escena</button></p>${intro()}</main>`
}

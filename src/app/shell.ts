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
      <div class="intro-campfire-fx" style="--fx-fire:url('${assetUrl('camp-rooms-v1/fx/fire.png')}');--fx-smoke:url('${assetUrl('camp-rooms-v1/fx/smoke.png')}')">
        <span class="intro-fire-glow"></span>
        <span class="intro-fire-smoke"></span>
        <span class="intro-fire-flame"></span>
      </div>
      <div class="intro-motes">${Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    </div>
    <div class="intro-top-bar" role="toolbar" aria-label="Controles de presentación">
      <div class="intro-brand-pill" aria-hidden="true">
        <img src="${assetUrl('emblem.webp')}" alt="" width="28" height="28">
        <span>CAMPAMENTO CREATIVO</span>
      </div>
      <div class="intro-top-actions">
        <button type="button" data-action="sound" aria-pressed="false">Sonido apagado</button>
        <button type="button" data-action="motion" aria-pressed="false">Reducir movimiento</button>
        <button type="button" class="intro-pause-button" data-action="intro-pause" aria-pressed="false">Pausar presentación</button>
        <button type="button" class="intro-replay-button" data-action="intro-replay" hidden>Repetir bienvenida</button>
        <button type="button" class="intro-skip-button" data-action="skip-intro">Omitir presentación →</button>
      </div>
    </div>
    <div class="intro-content">
      <header class="intro-heading">
        <p class="intro-eyebrow">ALEJO PALAVECINO <span aria-hidden="true">/</span> DESARROLLADOR DE SOFTWARE</p>
        <h1>Ideas que cobran <em>vida.</em></h1>
        <p class="intro-lead">Construyo productos digitales. Acá podés conocerlos, explorar mi historia y pensar conmigo lo que viene.</p>
      </header>
      <div class="intro-scene" aria-label="Conversación con Alejo">
      <div class="intro-arrival-note" aria-hidden="true"><span>Tu próxima parada: el campamento.</span><small>Alejo se acerca para darte la bienvenida.</small></div>
      <div class="intro-actor-stage">
        <div class="intro-story-banner" id="intro-conversation" hidden>
          <div class="intro-dialogue-head"><span class="intro-beat-kicker">ALEJO · TU GUÍA</span><span class="intro-beat-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
          <p class="intro-beat-title">¡Ey, llegaste!</p>
          <p class="intro-beat-subtitle" aria-hidden="true"></p>
          <p class="intro-dialogue-accessible sr-only" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="intro-replies" aria-label="Responder a Alejo">
            <button type="button" data-intro-reply="camp">Mostrame el campamento</button>
            <button type="button" data-intro-reply="work">¿Qué construís?</button>
          </div>
          <button type="button" class="intro-dialogue-next" data-action="intro-next" hidden>¡Vamos al campamento! →</button>
          <small class="intro-dialogue-hint">Tu respuesta elige el camino de la charla.</small>
        </div>
        <span class="intro-actor-shadow" aria-hidden="true"></span>
        <span class="intro-emote" aria-hidden="true" hidden>!</span>
        <button type="button" class="intro-character" aria-label="Saludar a Alejo" aria-controls="intro-conversation">
          <img class="intro-actor" src="${assetUrl('camp-rooms-v1/avatars/idle-right.png')}" width="160" height="288" alt="">
        </button>
        <span class="intro-actor-tag" aria-hidden="true">ALEJO · DEV</span>
        <span class="intro-step-dust" aria-hidden="true"></span>
      </div>
    </div>
      <div class="intro-entry" aria-label="Entrar o consultar el portfolio">
      <div class="intro-loader-hud">
        <div class="loading-bar-wrap">
          <div class="loading-progress" role="progressbar" aria-label="Preparación real de recursos del campamento" aria-valuemin="0" aria-valuemax="28" aria-valuenow="0"><span></span></div>
          <p class="loading-status">Preparando el campamento…</p>
        </div>
      </div>
      <button class="retry-intro" data-action="retry" hidden>Reintentar carga</button>
      <div class="intro-primary-actions">
        <button class="enter-button" data-action="enter" disabled>Explorar el campamento <span aria-hidden="true">↗</span></button>
        <button class="direct-button" data-action="direct">Ir directo a proyectos</button>
      </div>
      <div class="intro-links">
        <span class="intro-links-label">¿Tenés algo en mente?</span>
        <button data-section="contact">Conversemos</button>
        <span class="intro-link-divider" aria-hidden="true">/</span>
        <a href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>Descargar CV ↓</a>
      </div>
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

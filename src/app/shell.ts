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
      <div class="settings"><button data-action="help">Cómo jugar</button><button data-action="sound" aria-pressed="false">Sonido apagado</button><button data-action="motion" aria-pressed="false">Reducir movimiento</button></div>
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
      <div class="intro-panorama"><div class="intro-backdrop" style="--intro-desktop-url:url('${assetUrl('camp-rooms-v1/intro/mountain-arrival-clean.webp')}');--intro-portrait-url:url('${assetUrl('camp-rooms-v1/intro/mountain-arrival-clean.webp')}')"></div>
      <div class="intro-campfire-fx" style="--fx-fire:url('${assetUrl('camp-rooms-v1/fx/fire.png')}');--fx-smoke:url('${assetUrl('camp-rooms-v1/fx/smoke.png')}')">
        <span class="intro-fire-glow"></span>
        <span class="intro-fire-smoke"></span>
        <span class="intro-fire-flame"></span>
      </div>
      </div><div class="intro-motes">${Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    </div>
    <div class="intro-top-bar" role="toolbar" aria-label="Controles de presentación">
      <div class="intro-brand-pill" aria-hidden="true">
        <img src="${assetUrl('emblem.webp')}" alt="" width="28" height="28">
        <span>CAMPAMENTO CREATIVO</span>
      </div>
      <div class="intro-top-actions">
        <button type="button" class="icon-control" data-action="sound" aria-label="Activar sonido" title="Activar sonido" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><g class="sound-waves"><path d="M17 8q5 4 0 8M19 4q9 8 0 16"/></g><path class="sound-slash" d="M3 3l18 18"/></svg></button>
        <button type="button" class="icon-control" data-action="motion" aria-label="Reducir movimiento" title="Reducir movimiento" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4" r="1.8"/><g class="walking-person"><path d="m10 8 3-1 2 5 4 1M12 8l-2 7-4 6M10 15l5 2 1 4M10 8l-3 4H4"/></g><path class="motion-slash" d="M3 3l18 18"/></svg></button>
      </div>
    </div>
    <div class="intro-boot" role="status" aria-live="polite">
      <span class="boot-emblem" aria-hidden="true">◈</span><p class="boot-kicker">CAMPAMENTO CREATIVO</p>
      <h2>Preparando tu aventura</h2><p class="boot-task">Cargando el paisaje y los personajes…</p>
      <div class="boot-meter" aria-hidden="true"><span></span></div><small class="boot-count">0 de 28 recursos</small>
    </div>
    <div class="intro-handoff" role="status" aria-live="polite" hidden><span class="boot-emblem" aria-hidden="true">◈</span><h2 class="handoff-title">Entrando al campamento</h2><p class="handoff-detail">Proyectos · Contacto · Trayectoria · Sobre mí</p><span class="handoff-spinner" aria-hidden="true"></span></div>
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
        </div>
        <span class="intro-actor-shadow" aria-hidden="true"></span>
        <span class="intro-emote" aria-hidden="true" hidden>!</span>
        <div class="intro-character">
          <img class="intro-actor" src="${assetUrl('camp-rooms-v1/avatars/idle-right.png')}" width="160" height="288" alt="">
        </div>
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
      <div class="intro-primary-actions" style="--adventure-button:url('${assetUrl('camp-rooms-v1/ui/adventure-button.webp')}')">
        <button class="enter-button" data-action="enter" disabled>Explorar el campamento <span aria-hidden="true">↗</span></button>
        <button class="direct-button" data-action="direct">Ir directo a proyectos</button>
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

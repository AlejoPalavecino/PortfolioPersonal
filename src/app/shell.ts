import { sections } from '../entities'
import { assetUrl } from '../shared'

const links = () => Object.entries(sections)
  .map(([id, label]) => `<button data-section="${id}">${label}</button>`).join('')

function header(): string {
  return `<header class="header">
    <button class="brand" data-action="home" aria-label="Volver al campamento">
      <img src="${assetUrl('emblem.webp')}" alt="">
    </button>
    <nav class="desktop-nav" aria-label="Navegación principal">${links()}</nav>
    <div class="header-actions">
      <button class="mobile-contact" data-section="contact">Contacto</button>
      <a class="cv" href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download
        aria-label="Descargar CV original, pendiente de revisión">CV ↓</a>
      <button class="menu-toggle" data-action="menu" aria-expanded="false">Menú ☰</button>
    </div>
    <nav class="mobile-menu" aria-label="Menú" hidden>${links()}</nav>
  </header>`
}

function hero(): string {
  return `<section class="hero" aria-label="Presentación">
    <h1>Alejo<br>Palavecino</h1>
    <p class="hero-line">Desarrollo software.<br>Transformo ideas en productos.</p>
    <p class="hero-detail">Full stack · Análisis · Automatización e IA</p>
    <div class="hero-actions">
      <button class="primary" data-section="projects">Ver proyectos →</button>
      <button class="outline" data-section="contact">Contactar</button>
      <button class="text-button" data-action="explore">Explorar el campamento ↓</button>
    </div>
  </section>`
}

function world(): string {
  const objects = Object.keys(sections).map(id =>
    `<img class="poi poi-${id}" data-poi="${id}" src="${assetUrl(`poi-${id}.webp`)}" alt="">`).join('')
  const labels = Object.entries(sections).map(([id, label]) =>
    `<button class="world-label label-${id}" data-section="${id}">${label}</button>`).join('')
  return `<div class="world-scroll"><div class="world" tabindex="0" role="application"
    aria-label="Campamento interactivo. Usá las flechas para caminar y Enter para explorar.">
    <img class="ground" src="${assetUrl('camp-ground.webp')}" alt="">
    ${objects}${labels}
    <img class="avatar" width="131" height="255" src="${assetUrl('avatar/idle-down.webp')}" alt="">
    <span class="world-hint">Usá flechas para caminar y Enter cerca de una entrada</span>
  </div></div>`
}

function controls(): string {
  return `<p class="scene-status" role="status" hidden>El campamento no pudo cargarse. Podés abrir las secciones desde la navegación. <button data-action="retry">Reintentar escena</button></p>
    <div class="route-controls" hidden><span role="status" aria-live="polite">En camino…</span>
      <button data-action="resume" hidden>Continuar recorrido</button>
      <button data-action="open">Abrir ahora</button>
      <button data-action="cancel">Cancelar recorrido</button>
    </div>
    <div class="settings">
      <button data-action="sound" aria-pressed="false" aria-label="Activar sonido">Sonido apagado</button>
      <button data-action="motion" aria-pressed="false">Reducir movimiento</button>
    </div>`
}

export function shell(): string {
  return `<a class="skip" href="#main">Ir al contenido</a>${header()}
    <main id="main"><div class="landscape">${hero()}${world()}</div>
      <section class="panel" hidden></section>
      ${controls()}
    </main>`
}

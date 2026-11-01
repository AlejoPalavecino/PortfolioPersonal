import { cases, email, services, type CaseId, type Section } from '../entities'
import { assetUrl } from '../shared'
import { journeyTabs } from './credentials'

export { credentialMarkup, recognitionsMarkup } from './credentials'

const mail = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`
const back = '<button class="text-button" data-action="back">← Salir al campamento</button>'

function projectCard(id: CaseId): string {
  const item = cases[id]
  return `<article class="project-card" data-project-card="${id}">
    <div class="project-card-top">
      <span class="badge-status">${item.status}</span>
      <span class="project-role">${item.role}</span>
    </div>
    <h3>${item.title}</h3>
    <p class="project-summary">${item.description}</p>
    <p class="project-stack">${item.stack}</p>
    <button class="primary project-cta" data-case="${id}">Explorar el caso →</button>
  </article>`
}

function projects(): string {
  return `<span class="eyebrow">TALLER DE SOLUCIONES · PROYECTOS</span><h2>Proyectos</h2>
    <p class="lead">Dos contextos distintos. Desarrollo integral para resolver problemas concretos.</p>
    <div class="project-grid">${projectCard('foxmind')}${projectCard('flower')}</div>
    <p class="review-note">Casos en revisión. Las capturas reales se incorporarán cuando estén disponibles; las pantallas del fondo del taller son decorativas y no representan los productos.</p>
    <div class="room-inline-actions">
      <button class="outline" data-section="contact">Consultar en el Puesto de radio →</button>
      <a class="outline" href="${mail('Consulta sobre proyectos')}">Escribir por correo ↗</a>
    </div>`
}

function about(): string {
  return `<span class="eyebrow">CARPA PERSONAL · PERFIL Y FORMA DE TRABAJO</span><h2>Sobre mí</h2>
    <div class="about-layout"><div>
      <p class="lead">Soy Alejo Palavecino, estudiante de Ingeniería en Sistemas de Información (UTN) y desarrollador de software.</p>
      <p>Me interesa entender primero una necesidad real, definir una solución clara y construir un producto que se pueda usar. Soy cofundador de FoxMind y desarrollador de sistemas a medida en producción como Flower.</p>
      <h3>Forma de trabajar e intereses</h3>
      <p>Trabajo en desarrollo full stack, análisis funcional, automatización e inteligencia artificial aplicada. También me interesan oportunidades compatibles con producto y coordinación técnica.</p>
    </div><img src="${assetUrl('portrait.webp')}" width="480" height="480" alt="Retrato ilustrado de Alejo"></div>
    <h3>En qué puedo ayudarte</h3><p>Desarrollo a medida y servicios profesionales con alcance definido para cada necesidad.</p>
    <div class="services-grid">${services.map(service => `<article class="service-card"><h4>${service.title}</h4><p>${service.description}</p></article>`).join('')}</div>
    <div class="room-inline-actions">
      <button class="outline" data-section="projects">Ver casos en el Taller →</button>
      <button class="outline" data-section="contact">Ir a Contacto →</button>
      <a class="outline" href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>Descargar CV ↓</a>
    </div>`
}

function journey(): string {
  return `<span class="eyebrow">ARCHIVO DE EXPEDICIÓN · BITÁCORA</span><h2>Trayectoria</h2>
    ${journeyTabs('journey')}
    <p class="lead">Recorrido académico, construcción de productos y registro verificable de evidencias.</p>
    <div class="archive-spread">
      <div class="timeline">
        <article>
          <span class="timeline-tag">Formación en curso · UTN</span>
          <h3>Ingeniería en Sistemas de Información</h3>
          <p>Formación universitaria orientada al análisis de sistemas, diseño de software y resolución estructurada de problemas.</p>
        </article>
        <article>
          <span class="timeline-tag">Previo a pruebas piloto</span>
          <h3>FoxMind · Cofundador y desarrollador</h3>
          <p>Plataforma educativa con inteligencia artificial. Responsable del desarrollo completo hasta la etapa actual, incluida la integración de IA.</p>
        </article>
        <article>
          <span class="timeline-tag">En producción</span>
          <h3>Flower · Desarrollo a medida</h3>
          <p>Desarrollo integral individual de un sistema de control de stock y facturación para una librería (React, Node.js, PostgreSQL y facturación automática con ARCA).</p>
        </article>
        <article>
          <span class="timeline-tag">Proyección profesional</span>
          <h3>Mirando hacia adelante</h3>
          <p>Abierto a oportunidades en desarrollo full stack, análisis funcional, automatización e IA aplicada, así como colaboración en producto y coordinación técnica.</p>
        </article>
      </div>
      <aside class="archive-sidebar">
        <h3>Archivo de evidencias</h3>
        <p>Las constancias se organizan en cuatro categorías verificables:</p>
        <ul class="archive-categories">
          <li><strong>Certificados de formación</strong></li>
          <li><strong>Certificaciones profesionales</strong></li>
          <li><strong>Premios</strong></li>
          <li><strong>Menciones especiales</strong></li>
        </ul>
        <p class="review-note">Cada registro requiere documento original legible, emisor y atribución explícita (persona, equipo o proyecto) antes de su publicación.</p>
        <div class="room-inline-actions">
          <button class="outline" data-action="recognitions">Abrir Certificados y reconocimientos →</button>
          <a class="outline" href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>Descargar CV ↓</a>
        </div>
      </aside>
    </div>`
}

function contact(): string {
  return `<span class="eyebrow">PUESTO DE RADIO · COMUNICACIONES</span><h2>Contacto</h2>
    <p class="lead">¿Tenés una oportunidad laboral o un desarrollo a medida en mente? Elegí una intención para comunicarnos.</p>
    <div class="correspondence-sheet">
      <div class="intent-grid">
        <article class="intent-card" data-intent-card="laboral">
          <span class="badge-status">Intención 01 · Empleo y equipos</span>
          <h3>Tengo una oportunidad laboral</h3>
          <p>Para roles full stack, análisis funcional, automatización o IA aplicada.</p>
          <a class="primary" href="${mail('Oportunidad laboral')}">Abrir cliente de correo · Oportunidad →</a>
        </article>
        <article class="intent-card" data-intent-card="proyecto">
          <span class="badge-status">Intención 02 · Servicios y proyectos</span>
          <h3>Necesito un desarrollo a medida</h3>
          <p>Para aplicaciones web, sistemas de gestión, integraciones (como ARCA) o IA.</p>
          <a class="outline" href="${mail('Proyecto de desarrollo a medida')}">Abrir cliente de correo · Desarrollo →</a>
        </article>
      </div>
      <div class="channel-box">
        <p><strong>Canal directo de correo:</strong> <a href="${mail('Hola Alejo')}" class="mail-address">${email}</a> <small>(correo en revisión)</small></p>
        <p class="review-note">Los enlaces anteriores abren tu aplicación de correo configurada; no se utiliza un formulario de envío simulado sin servidor.</p>
        <div class="contact-actions">
          <button type="button" class="outline" data-action="copy-email" data-email="${email}">Copiar correo</button>
          <a class="outline" href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>Descargar CV original (PDF) ↓</a>
        </div>
        <p class="copy-status" role="status" aria-live="polite" hidden></p>
        <label class="copy-fallback-wrap" hidden>
          <span>Si tu navegador bloqueó el portapapeles, copiá el correo desde aquí:</span>
          <input type="text" class="copy-fallback" value="${email}" readonly aria-label="Correo electrónico para copia manual">
        </label>
      </div>
    </div>`
}

export function sectionMarkup(section: Section): string {
  const content: Record<Section, () => string> = { projects, about, journey, contact }
  return `<div class="panel-nav">${back}</div>${content[section]()}`
}

export function caseMarkup(id: CaseId): string {
  const item = cases[id]
  return `<div class="panel-nav"><button class="text-button" data-action="projects">← Volver a Proyectos</button>${back}</div>
    <span class="eyebrow">TALLER DE SOLUCIONES · CASO DE PROYECTO</span><h2>${item.title}</h2><p class="lead">${item.subtitle}</p>
    <div class="case-layout">
      <div class="case-main">
        <div class="case-copy">
          <h3>El proyecto</h3>
          <p>${item.description}</p>
          <h3>Mi participación y alcance</h3>
          <p>${item.contribution}</p>
        </div>
        <div class="placeholder"><span aria-hidden="true">▧</span>
          <strong>Evidencia visual en preparación</strong>
          <small>Se incorporarán capturas reales de ${item.shortTitle} cuando estén autorizadas. Las pantallas ilustradas del fondo del taller son decorativas.</small>
        </div>
      </div>
      <aside class="case-aside">
        <span class="badge-status">${item.status}</span>
        <h3>Mi rol</h3><p>${item.role}</p>
        <h3>Tecnologías y alcance</h3><p>${item.stack}</p>
        <div class="case-actions">
          <a class="primary" href="${mail(`Consulta sobre ${item.shortTitle}`)}">Consultar por un proyecto →</a>
          <button class="outline" data-section="contact">Ir al Puesto de radio →</button>
        </div>
      </aside>
    </div>`
}

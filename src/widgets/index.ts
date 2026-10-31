export { credentialMarkup, recognitionsMarkup } from './credentials'

import { cases, email, services, type CaseId, type Section } from '../entities'
import { assetUrl } from '../shared'

const mail = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`
const back = '<button class="text-button" data-action="back">← Volver al campamento</button>'

function projectCard(id: CaseId): string {
  const item = cases[id]
  return `<article class="project-card">
    <span class="eyebrow">${item.status}</span><h3>${item.title}</h3><p>${item.subtitle}</p>
    <button class="outline" data-case="${id}">Conocer el proyecto →</button>
  </article>`
}

function projects(): string {
  return `<span class="eyebrow">EL TALLER</span><h2>Proyectos</h2>
    <p class="lead">Ideas que toman forma en productos de software.</p>
    <p class="review-note">Casos en revisión. Las capturas reales se incorporarán después de su selección.</p>
    <div class="project-grid">${projectCard('foxmind')}${projectCard('flower')}</div>`
}

function about(): string {
  return `<span class="eyebrow">LA CARPA</span><h2>Sobre mí</h2>
    <div class="about-layout"><div>
      <p class="lead">Desarrollo software para conectar necesidades concretas con soluciones claras.</p>
      <p>Trabajo en desarrollo full stack, análisis funcional, automatización e inteligencia artificial aplicada. Soy cofundador de FoxMind, una plataforma educativa orientada a personalizar el aprendizaje y acompañar el trabajo docente.</p>
      <h3>Lo que me interesa</h3>
      <p>Construir productos, comprender problemas y colaborar en la evolución de ideas.</p>
    </div><img src="${assetUrl('portrait.webp')}" alt="Retrato ilustrado de Alejo"></div>
    <h3>Cómo puedo ayudarte</h3><p>Desarrollo a medida y servicios relacionados, con alcance definido para cada proyecto.</p>
    <div class="services-grid">${services.map(service => `<article><h4>${service.title}</h4><p>${service.description}</p></article>`).join('')}</div>`
}

function journey(): string {
  return `<span class="eyebrow">LA BITÁCORA</span><h2>Trayectoria</h2>
    <p class="lead">Un recorrido entre el desarrollo, el análisis y los productos.</p>
    <div class="timeline">
      <article><h3>FoxMind</h3><p>Cofundador y responsable del desarrollo hasta la etapa actual, incluida la integración de IA. El producto se encuentra previo a pruebas piloto.</p></article>
      <article><h3>Flower</h3><p>Desarrollo integral de un sistema de stock y facturación para una librería, actualmente en producción.</p></article>
      <article><h3>Mirando hacia adelante</h3><p>Me interesan oportunidades en desarrollo full stack, análisis y automatización, así como roles vinculados a producto y coordinación técnica.</p></article>
    </div>`
}

function contact(): string {
  return `<span class="eyebrow">LA RADIO</span><h2>Contacto</h2>
    <p class="lead">¿Tenés una idea o una oportunidad? Conversemos.</p>
    <p>Podés escribirme a <a href="${mail('Hola Alejo')}">${email}</a> <small>(correo provisional, pendiente de revisión)</small>.</p>
    <div class="contact-actions">
      <a class="primary" href="${mail('Oportunidad laboral')}">Conversar sobre una oportunidad →</a>
      <a class="outline" href="${mail('Proyecto de desarrollo')}">Contarme sobre un proyecto →</a>
    </div>
    <p><a href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>Descargar CV original (pendiente de revisión) ↓</a></p>`
}

export function sectionMarkup(section: Section): string {
  const content: Record<Section, () => string> = { projects, about, journey, contact }
  return `<div class="panel-nav">${back}</div>${content[section]()}`
}

export function caseMarkup(id: CaseId): string {
  const item = cases[id]
  return `<div class="panel-nav"><button class="text-button" data-action="projects">← Volver a Proyectos</button>${back}</div>
    <span class="eyebrow">PROYECTO DESTACADO</span><h2>${item.title}</h2><p class="lead">${item.subtitle}</p>
    <div class="case-layout">
      <div class="placeholder"><span aria-hidden="true">▧</span>
        <strong>Evidencia visual en preparación</strong>
        <small>Se incorporarán capturas reales de ${id === 'foxmind' ? 'FoxMind' : 'Flower'} seleccionadas para este caso. Versión de revisión.</small>
      </div>
      <aside><h3>Mi rol</h3><p>${item.role}</p><h3>Estado</h3><p>${item.status}</p>
        <a class="primary" href="${mail('Consulta sobre un proyecto')}">Conversemos →</a>
      </aside>
    </div>
    <div class="case-copy"><h3>El proyecto</h3><p>${item.description}</p><h3>Mi aporte</h3><p>${item.contribution}</p></div>`
}

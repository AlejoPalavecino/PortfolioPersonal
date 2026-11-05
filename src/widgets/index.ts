import { cases, email, services, type CaseId, type Section } from '../entities'
import { assetUrl } from '../shared'
import { campIcon } from '../shared/camp-icons'
import { journeyTabs } from './credentials'

export { credentialMarkup, recognitionsMarkup } from './credentials'
const mail = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`

function projects(): string {
  const plans = (['foxmind', 'flower'] as const).map((id, index) => {
    const item = cases[id]
    return `<button class="project-plan" data-project-card="${id}" data-case="${id}">
      <span class="plan-code">PLANO 0${index + 1}</span>
      <span class="plan-sketch" aria-hidden="true">${campIcon('projects')}<i></i><i></i><i></i></span>
      <strong>${item.shortTitle}</strong><span>${item.subtitle}</span>
      <small class="plan-state">${item.status}</small>
      <span class="object-action">Abrir el caso <span aria-hidden="true">↗</span></span>
    </button>`
  }).join('')
  return `<h2>Taller de soluciones</h2>
    <p class="room-invitation">Cada proyecto empieza con una pregunta. Abrí un plano para conocer lo que construí.</p>
    <div class="blueprint-desk">${plans}</div>`
}

const notebook = [
  { id: 'profile', label: 'Quién soy', title: 'Construir algo que sirva.', body: `
    <p>Soy Alejo Palavecino, estudiante de Ingeniería en Sistemas de Información (UTN) y desarrollador de software.</p>
    <p>Soy cofundador de FoxMind y construyo sistemas a medida en producción como Flower. Me interesa transformar una necesidad concreta en un producto que se pueda usar.</p>` },
  { id: 'method', label: 'Cómo trabajo', title: 'Entender, definir, construir.', body: `
    <ol class="method-list">
      <li><strong>Escuchar el problema.</strong> Entender a las personas y su contexto.</li>
      <li><strong>Definir una solución clara.</strong> Modelar requisitos, datos y flujos.</li>
      <li><strong>Llevarla a la práctica.</strong> Desarrollar, integrar y acompañar la puesta en producción.</li>
    </ol><p>También me interesan oportunidades de producto y coordinación técnica.</p>` },
  { id: 'skills', label: 'Qué aporto', title: 'De la idea al producto.', body: `
    <dl class="capability-list">${services.map(service => `<div><dt>${service.title}</dt><dd>${service.description}</dd></div>`).join('')}</dl>
    <button class="text-button" data-section="projects">Ver estas capacidades en mis proyectos ↗</button>` },
]

function about(): string {
  const tabs = notebook.map(({ id, label }, index) => `<button role="tab" id="tab-${id}" aria-controls="page-${id}"
    aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-notebook="${id}">${label}</button>`).join('')
  const pages = notebook.map(({ id, label, title, body }, index) => `<section id="page-${id}" role="tabpanel"
    aria-labelledby="tab-${id}" tabindex="0" data-notebook-page="${id}"${index ? ' hidden' : ''}>
    <p class="page-number">0${index + 1} / ${label.toUpperCase()}</p><h3>${title}</h3>${body}
  </section>`).join('')
  return `<h2>Mi cuaderno</h2><p class="room-invitation">Un poco de mi historia y de cómo trabajo.</p>
    <div class="notebook-spread">
      <figure class="notebook-portrait">
        <img src="${assetUrl('portrait.webp')}" width="480" height="480" alt="Retrato ilustrado de Alejo">
        <figcaption>Alejo Palavecino<small>Desarrollador de software · Argentina</small></figcaption>
      </figure>
      <div class="notebook-pages"><div class="notebook-tablist" role="tablist" aria-label="Páginas del cuaderno">${tabs}</div>${pages}</div>
    </div>`
}

const milestones = [
  { id: 'utn', tag: 'Formación en curso', title: 'Ingeniería en Sistemas de Información', text: 'Estudio en la UTN, con formación en análisis de sistemas, diseño de software y resolución estructurada de problemas.' },
  { id: 'foxmind', tag: 'Previo a pruebas piloto', title: 'FoxMind', text: 'Cofundador y responsable del desarrollo completo de una plataforma educativa con inteligencia artificial, hasta su etapa actual.' },
  { id: 'flower', tag: 'En producción', title: 'Flower', text: 'Desarrollo integral individual de un sistema de stock y facturación para una librería, con React, Node.js, PostgreSQL y facturación automática con ARCA.' },
  { id: 'next', tag: 'Lo que viene', title: 'Seguir construyendo', text: 'Abierto a oportunidades en desarrollo full stack, análisis funcional, automatización e IA aplicada, y a colaborar en producto y coordinación técnica.' },
]

function journey(): string {
  const index = milestones.map((m, i) => `<button data-milestone="${m.id}" aria-controls="entry-${m.id}" aria-expanded="${i === 0}">
    <span>0${i + 1}</span><strong>${m.title}</strong><small>${m.tag}</small></button>`).join('')
  const pages = milestones.map((m, i) => {
    const link = m.id === 'foxmind' || m.id === 'flower'
      ? `<button class="text-button" data-case="${m.id}">Abrir el caso de ${m.title} ↗</button>` : ''
    return `<article id="entry-${m.id}" data-journal-page="${m.id}"${i ? ' hidden' : ''} tabindex="-1">
      <p class="page-number">ENTRADA 0${i + 1} · ${m.tag}</p><h3>${m.title}</h3><p>${m.text}</p>${link}
    </article>`
  }).join('')
  return `<h2>Bitácora de expedición</h2>
    <p class="room-invitation">Formación, productos y próximos pasos. Elegí una entrada.</p>${journeyTabs('journey')}
    <div class="journal-spread"><nav class="journal-index" aria-label="Entradas de la bitácora">${index}</nav>
      <div class="journal-pages">${pages}</div>
    </div>`
}

function contact(): string {
  return `<h2>Una conversación empieza acá.</h2>
    <p class="room-invitation">Elegí el motivo y abrí tu aplicación de correo.</p>
    <div class="radio-console"><span class="radio-dial" aria-hidden="true"><i></i></span>
      <div class="radio-channels" role="group" aria-label="Motivo de contacto">
        <button data-intent-card="laboral" data-contact-intent="laboral" aria-pressed="true"><span>CANAL 01</span><strong>Oportunidad laboral</strong><small>Para sumarme a un equipo</small></button>
        <button data-intent-card="proyecto" data-contact-intent="proyecto" aria-pressed="false"><span>CANAL 02</span><strong>Desarrollo a medida</strong><small>Para construir un producto</small></button>
      </div>
      <div class="radio-message">
        <p class="radio-intent-description">Desarrollo full stack, análisis funcional, automatización e IA aplicada.</p>
        <a class="primary radio-send" href="${mail('Oportunidad laboral')}">Abrir correo · Oportunidad laboral ↗</a>
        <p class="radio-honesty">El mensaje se envía desde tu aplicación de correo.</p>
      </div>
    </div>
    <div class="direct-channel">
      <span>También podés escribirme directamente</span><a class="mail-address" href="${mail('Hola Alejo')}">${email}</a>
      <button class="text-button" data-action="copy-email" data-email="${email}">Copiar correo</button>
      <small>Dirección pendiente de revisión editorial.</small>
    </div>
    <p class="copy-status" role="status" aria-live="polite" hidden></p>
    <label class="copy-fallback-wrap" hidden><span>Copiá el correo manualmente:</span>
      <input type="text" class="copy-fallback" value="${email}" readonly aria-label="Correo electrónico para copia manual">
    </label>`
}

export function sectionMarkup(section: Section): string {
  return ({ projects, about, journey, contact })[section]()
}

export function caseMarkup(id: CaseId): string {
  const item = cases[id]
  const other = id === 'foxmind' ? 'flower' : 'foxmind'
  return `<div class="panel-nav">
      <button class="text-button" data-action="projects">← Volver a Proyectos</button>
      <button class="text-button" data-case="${other}">Cambiar a ${cases[other].shortTitle} →</button>
    </div>
    <h2>${item.title}</h2><p class="case-facts">${item.role} · ${item.status}</p>
    <div class="dossier-copy">
      <section><p class="page-number">01 / EL PROYECTO</p><h3>${item.subtitle}</h3><p>${item.description}</p></section>
      <section><p class="page-number">02 / MI PARTICIPACIÓN</p><h3>Lo que construí</h3><p>${item.contribution}</p></section>
      <details class="case-technical"><summary>Tecnologías y alcance</summary><p>${item.stack}</p></details>
      <aside class="evidence-note"><strong>Evidencia visual en preparación</strong>
        <p>Las capturas reales de ${item.shortTitle} se incorporarán cuando estén autorizadas. La ilustración del taller es decorativa.</p>
      </aside>
      <button class="primary" data-section="contact">Conversemos sobre un proyecto ↗</button>
    </div>`
}

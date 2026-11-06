import { cases, email, linkedin, services, type CaseId, type Section } from '../entities'
import { t, language } from '../shared/i18n'
import { assetUrl } from '../shared'
import { campIcon } from '../shared/camp-icons'

export { credentialMarkup, recognitionsMarkup } from './credentials'
const mail = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`

function projects(): string {
  const plans = (['foxmind', 'flower', 'agrotech', 'irrigacion', 'herbario', 'art'] as const).map((id, index) => {
    const item = cases[id]
    return `<button class="project-plan" data-project-card="${id}" data-case="${id}">
      <span class="plan-code">${t('PLANO','BLUEPRINT')} ${String(index + 1).padStart(2, '0')}</span>
      <span class="plan-sketch" aria-hidden="true">${campIcon('projects')}<i></i><i></i><i></i></span>
      <strong>${item.shortTitle}</strong><span>${item.subtitle}</span>
      <small class="plan-state">${item.status}</small>
      <span class="object-action">${t('Abrir el caso','Open case')} <span aria-hidden="true">↗</span></span>
    </button>`
  }).join('')
  return `<h2>${t('Taller de soluciones','Solutions workshop')}</h2>
    <p class="room-invitation">${t('Detrás de cada proyecto hay un problema real. Elegí un plano para conocer cómo lo abordé.','Every project begins with a real problem. Choose a blueprint to see how I approached it.')}</p>
    <div class="blueprint-desk">${plans}</div>`
}

const notebook = () => [
  { id: 'profile', label: 'Quién soy', title: 'Construir algo que sirva.', body: `
    <p>${t('Soy Alejo, estudiante de Ingeniería en Sistemas de Información en la UTN Mendoza y desarrollador de software.','I’m Alejo, a Systems Engineering student at UTN Mendoza and a software developer.')}</p>
    <p>${t('Soy cofundador y líder de FoxMind. También construí software para empresas y proyectos propios. Me gusta escuchar, proponer, desarrollar y colaborar para transformar ideas en productos que sirvan.','I co-founded FoxMind and lead its product development. I’ve also built software for businesses and independent projects. I enjoy listening, designing, building and collaborating to turn ideas into useful products.')}</p>` },
  { id: 'method', label: 'Cómo trabajo', title: 'Entender, definir, construir.', body: `
    <ol class="method-list">
      <li><strong>Escuchar el problema.</strong> Entender a las personas y su contexto.</li>
      <li><strong>Definir una solución clara.</strong> Modelar requisitos, datos y flujos.</li>
      <li><strong>Llevarla a la práctica.</strong> Desarrollar, integrar y acompañar la puesta en producción.</li>
    </ol><p>${t('Estoy abierto a puestos de análisis de sistemas, frontend, backend, full stack y automatización con IA. Me interesa crecer dentro de un equipo tech.','I’m open to systems analysis, frontend, backend, full stack and AI automation roles. I want to grow as part of a tech team.')}</p>` },
  { id: 'skills', label: 'Qué aporto', title: 'De la idea al producto.', body: `
    <dl class="capability-list">${services.map(service => `<div><dt>${service.title}</dt><dd>${service.description}</dd></div>`).join('')}</dl>
    <button class="text-button" data-section="projects">Ver estas capacidades en mis proyectos ↗</button>` },
]

function about(): string {
  const tabs = notebook().map(({ id, label }, index) => `<button role="tab" id="tab-${id}" aria-controls="page-${id}"
    aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-notebook="${id}">${label}</button>`).join('')
  const pages = notebook().map(({ id, label, title, body }, index) => `<section id="page-${id}" role="tabpanel"
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

const milestones = () => [
  { id: 'ilan', tag: t('Premio · 2026','Award · 2026'), title: t('Premio ILAN a la Innovación Universitaria','ILAN University Innovation Award'), text: t('Con FoxMind obtuvimos el primer puesto y conocimos el ecosistema tecnológico y emprendedor de Israel.','FoxMind earned first place, which opened the door to learning from Israel’s technology and entrepreneurship ecosystem.') },
  { id: 'agrotech', tag: t('Emprender · 2021','Entrepreneurship · 2021'), title: 'Agrotech', text: t('Creé un proyecto de prevención de heladas que obtuvo el segundo puesto en Emprende U 2021.','I created a frost prevention project that won second place at Emprende U 2021.') },
  { id: 'reconocimiento', tag: t('Reconocimiento','Recognition'), title: t('Interés provincial','Provincial interest'), text: t('FoxMind fue declarado de interés provincial por las cámaras legislativas de Mendoza. También obtuvo el segundo puesto en UTN Emprende 30 y fue semifinalista de Emprende U 2025.','FoxMind was declared of provincial interest by Mendoza’s legislative chambers. It also earned second place at UTN Emprende 30 and became a semifinalist at Emprende U 2025.') },
  { id: 'utn', tag: 'Formación en curso', title: 'Ingeniería en Sistemas de Información', text: 'Estudio en la UTN, con formación en análisis de sistemas, diseño de software y resolución estructurada de problemas.' },
  { id: 'foxmind', tag: 'Previo a pruebas piloto', title: 'FoxMind', text: 'Cofundador y responsable del desarrollo completo de una plataforma educativa con inteligencia artificial, hasta su etapa actual.' },
  { id: 'flower', tag: 'En producción', title: 'Flower', text: 'Desarrollo integral individual de un sistema de stock y facturación para una librería, con React, Node.js, PostgreSQL y facturación automática con ARCA.' },
  { id: 'next', tag: 'Lo que viene', title: 'Seguir construyendo', text: 'Busco sumar experiencia en equipos de tecnología. Estoy abierto a análisis de sistemas, full stack, frontend, backend y automatización con IA; trabajo presencial o híbrido en Mendoza y remoto a nivel internacional.' },
]

function journey(): string {
  const entries = milestones()
  const index = entries.map((m, i) => `<button data-milestone="${m.id}" aria-controls="entry-${m.id}" aria-expanded="${i === 0}">
    <span>0${i + 1}</span><strong>${m.title}</strong><small>${m.tag}</small></button>`).join('')
  const pages = entries.map((m, i) => {
    const link = m.id === 'foxmind' || m.id === 'flower' || m.id === 'agrotech'
      ? `<button class="text-button" data-case="${m.id}">${t('Abrir el proyecto','Open project')} ${m.title} ↗</button>` : ''
    return `<article id="entry-${m.id}" data-journal-page="${m.id}"${i ? ' hidden' : ''} tabindex="-1">
      <p class="page-number">ENTRADA 0${i + 1} · ${m.tag}</p><h3>${m.title}</h3><p>${m.text}</p>${link}
    </article>`
  }).join('')
  return `<h2>Bitácora de expedición</h2>
    <p class="room-invitation">${t('Mis proyectos, reconocimientos y próximos pasos. Elegí una entrada.','Projects, milestones and what comes next. Choose an entry.')}</p>
    <div class="journal-spread"><nav class="journal-index" aria-label="Entradas de la bitácora">${index}</nav>
      <div class="journal-pages">${pages}</div>
    </div>`
}

function contact(): string {
  return `<h2>Una conversación empieza acá.</h2>
    <p class="room-invitation">${t('¿Querés sumarme a tu equipo o tenés un proyecto para construir? Me encantará escucharte.','Hiring for your team or planning a project? I would love to hear from you.')}</p>
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
      <span>${t('Contactame directamente','Contact me directly')}</span><a class="mail-address" href="${mail('Hola Alejo')}">${email}</a>
      <button class="text-button" data-action="copy-email" data-email="${email}">Copiar correo</button>
      <a class="mail-address" href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><small>${t('Solo LinkedIn y correo. No publico mi número personal.','LinkedIn and email only. I do not publish my personal number.')}</small>
    </div>
    <p class="copy-status" role="status" aria-live="polite" hidden></p>
    <label class="copy-fallback-wrap" hidden><span>Copiá el correo manualmente:</span>
      <input type="text" class="copy-fallback" value="${email}" readonly aria-label="Correo electrónico para copia manual">
    </label>`
}


function localizeMarkup(html: string): string {
  if (language() !== 'en') return html
  const phrases: readonly [string, string][] = [
    ['Quién soy', 'About me'],
    ['CANAL 01', 'CHANNEL 01'], ['CANAL 02', 'CHANNEL 02'],
    ['Busco sumar experiencia en equipos de tecnología. Estoy abierto a análisis de sistemas, full stack, frontend, backend y automatización con IA; trabajo presencial o híbrido en Mendoza y remoto a nivel internacional.', 'I’m looking to gain experience on technology teams. I’m open to systems analysis, full stack, frontend, backend and applied AI automation roles; on-site or hybrid in Mendoza, or remote worldwide.'], ['Cómo trabajo', 'How I work'], ['Qué aporto', 'What I bring'],
    ['Construir algo que sirva.', 'Building something useful.'],
    ['Entender, definir, construir.', 'Understand, define, build.'],
    ['De la idea al producto.', 'From idea to product.'],
    ['Escuchar el problema.', 'Listen to the problem.'],
    ['Entender a las personas y su contexto.', 'Understand people and their context.'],
    ['Definir una solución clara.', 'Design a clear solution.'],
    ['Modelar requisitos, datos y flujos.', 'Model requirements, data and workflows.'],
    ['Llevarla a la práctica.', 'Put it into practice.'],
    ['Desarrollar, integrar y acompañar la puesta en producción.', 'Build, integrate and deliver.'],
    ['Mi cuaderno', 'My notebook'], ['Un poco de mi historia y de cómo trabajo.', 'My story and how I work.'],
    ['Retrato ilustrado de Alejo', 'Illustrated portrait of Alejo'],
    ['Páginas del cuaderno', 'Notebook pages'],
    ['Desarrollador de software · Argentina', 'Software developer · Argentina'],
    ['Ver estas capacidades en mis proyectos', 'See these skills in my projects'],
    ['Formación en curso', 'Currently studying'],
    ['Ingeniería en Sistemas de Información', 'Systems Engineering'],
    ['Estudio en la UTN, con formación en análisis de sistemas, diseño de software y resolución estructurada de problemas.', 'Studying Systems Engineering at UTN, with an emphasis on analysis, software design and problem solving.'],
    ['Previo a pruebas piloto', 'Before pilot testing'],
    ['Cofundador y responsable del desarrollo completo de una plataforma educativa con inteligencia artificial, hasta su etapa actual.', 'Co-founder and product developer of an AI-powered education platform, currently preparing for pilot tests.'],
    ['En producción', 'In production'],
    ['Desarrollo integral individual de un sistema de stock y facturación para una librería, con React, Node.js, PostgreSQL y facturación automática con ARCA.', 'Designed and built a production inventory and invoicing system with React, Node.js, PostgreSQL and ARCA integration.'],
    ['Lo que viene', 'What comes next'], ['Seguir construyendo', 'Keep building'],
    ['Bitácora de expedición', 'Adventure journal'], ['ENTRADA', 'ENTRY'],
    ['Una conversación empieza acá.', 'Every great project starts with a conversation.'],
    ['Motivo de contacto', 'Reason for contacting me'],
    ['Oportunidad laboral', 'Job opportunity'], ['Desarrollo a medida', 'Custom software'],
    ['Para sumarme a un equipo', 'To join a team'], ['Para construir un producto', 'To build a product'],
    ['Desarrollo full stack, análisis funcional, automatización e IA aplicada.', 'Full stack development, systems analysis, automation and applied AI.'],
    ['Aplicaciones web, sistemas de gestión, integraciones e inteligencia artificial con un alcance definido.', 'Web apps, management systems, integrations and practical AI.'],
    ['Abrir correo · ', 'Send email · '], ['El mensaje se envía desde tu aplicación de correo.', 'Your email app opens; nothing is sent automatically.'],
    ['Copiar correo', 'Copy email'], ['Copiá el correo manualmente:', 'Copy the email manually:'],
    ['Correo electrónico para copia manual', 'Email address for manual copying'],
    ['Volver a Proyectos', 'Back to Projects'], ['Lo que construí', 'What I built'],
    ['Taller de soluciones', 'Solutions workshop'], ['Conversemos sobre un proyecto', 'Let’s talk about a project'],
  ]
  for (const [es, en] of phrases) html = html.replaceAll(es, en)
  return html
}

export function sectionMarkup(section: Section): string {
  return localizeMarkup(({ projects, about, journey, contact })[section]())
}

export function caseMarkup(id: CaseId): string {
  const item = cases[id]
  const ids = ['foxmind', 'flower', 'agrotech', 'irrigacion', 'herbario', 'art'] as const satisfies readonly CaseId[]
  const other = ids[(ids.indexOf(id) + 1) % ids.length]!
  return localizeMarkup(`<div class="panel-nav">
      <button class="text-button" data-action="projects">← Volver a Proyectos</button>
      <button class="text-button" data-case="${other}">${t('Siguiente caso','Next case')}: ${cases[other].shortTitle} →</button>
    </div>
    <h2>${item.title}</h2><p class="case-facts">${item.role} · ${item.status}</p>
    <div class="dossier-copy">
      <section><p class="page-number">01 / ${t('EL PROBLEMA','THE PROBLEM')}</p><h3>${item.subtitle}</h3><p>${item.description}</p></section>
      <section><p class="page-number">02 / ${t('MI PARTICIPACIÓN','MY CONTRIBUTION')}</p><h3>${t('Lo que construí','What I built')}</h3><p>${item.contribution}</p></section>
      <section><p class="page-number">03 / ${t('LO DESTACADO','HIGHLIGHT')}</p><h3>${item.highlight}</h3></section>
      <details class="case-technical"><summary>${t('Tecnologías y alcance','Technology & scope')}</summary><p>${item.stack}</p></details>
      ${id === 'art' ? '<aside class="evidence-note">' + t('El cliente y cualquier dato de pacientes permanecen confidenciales.','Client and patient information remains confidential.') + '</aside>' : ''}
      ${id === 'foxmind' ? '<aside class="evidence-note">' + t('Proyecto en desarrollo: la validación de resultados llegará con los pilotos.','Development in progress: outcomes will be assessed during pilot testing.') + '</aside>' : ''}
      <button class="primary" data-section="contact">${t('Conversemos sobre un proyecto','Let’s talk about a project')} ↗</button>
    </div>`)
}

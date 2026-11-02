import { cases, email, services, type CaseId, type Section } from '../entities'
import { assetUrl } from '../shared'
import { journeyTabs } from './credentials'

export { credentialMarkup, recognitionsMarkup } from './credentials'

const mail = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`
const back = '<button class="text-button" data-action="back">← Salir al campamento</button>'

const PROJECT_META: Readonly<Record<CaseId, {
  questCode: string
  category: string
  led: 'amber' | 'green'
  nodes: readonly [string, string, string]
  highlights: readonly [string, string]
  modules: readonly { code: string; name: string; detail: string }[]
}>> = {
  foxmind: {
    questCode: 'CASO #01 · EDTECH & IA',
    category: 'Plataforma Educativa con IA',
    led: 'amber',
    nodes: ['👩‍🏫 Docentes y Alumnos', '🦊 Motor IA Adaptativo', '📊 Rutas de Aprendizaje'],
    highlights: [
      'Cofundador y responsable de todo el desarrollo técnico de la plataforma.',
      'Integración de inteligencia artificial aplicada para personalizar contenidos y asistir al docente.',
    ],
    modules: [
      { code: 'MOD-01', name: 'Aprendizaje Personalizado', detail: 'Adaptación de actividades y seguimiento según el avance de cada estudiante.' },
      { code: 'MOD-02', name: 'Asistente Docente con IA', detail: 'Herramientas prácticas con IA para agilizar la planificación y el acompañamiento.' },
      { code: 'MOD-03', name: 'Desarrollo End-to-End', detail: 'Diseño funcional, arquitectura full stack e integración de modelos de IA.' },
    ],
  },
  flower: {
    questCode: 'CASO #02 · GESTIÓN & ARCA',
    category: 'Sistema en Producción Real',
    led: 'green',
    nodes: ['🏪 Stock y Ventas', '⚙️ React · Node · PG', '🧾 Facturación ARCA'],
    highlights: [
      'Desarrollo individual completo de punta a punta, operando diariamente en producción.',
      'Conexión directa con ARCA para emitir comprobantes fiscales de forma automática.',
    ],
    modules: [
      { code: 'MOD-01', name: 'Control de Stock e Inventario', detail: 'Gestión ágil de catálogo, movimientos y disponibilidad en tiempo real para la librería.' },
      { code: 'MOD-02', name: 'Punto de Venta y Caja', detail: 'Flujo rápido de mostrador diseñado sobre React, Node.js y base relacional PostgreSQL.' },
      { code: 'MOD-03', name: 'Facturación Automática ARCA', detail: 'Integración directa con servicios fiscales de ARCA para facturar ventas sin carga manual.' },
    ],
  },
}

function stackChips(stack: string): string {
  return stack.split('·').map(part => `<span class="pixel-chip">${part.trim()}</span>`).join('')
}

function projectCard(id: CaseId): string {
  const item = cases[id]
  const meta = PROJECT_META[id]
  return `<article class="project-card" data-project-card="${id}" data-led="${meta.led}">
    <div class="project-card-top">
      <span class="project-quest-code">${meta.questCode}</span>
      <span class="badge-status" data-led="${meta.led}"><i class="status-led" aria-hidden="true"></i>${item.status}</span>
    </div>
    <div class="project-title-row">
      <img class="project-card-icon" src="${assetUrl('camp-rooms-v1/ui/icon-projects@4x.png')}" alt="" width="28" height="28">
      <div>
        <h3>${item.title}</h3>
        <span class="project-role">Rol: ${item.role}</span>
      </div>
    </div>
    <div class="project-schematic" aria-label="Esquema funcional de ${item.shortTitle}">
      <span class="schematic-label">ESQUEMA DEL SISTEMA · ${meta.category.toUpperCase()}</span>
      <div class="schematic-flow">
        <span class="schematic-node">${meta.nodes[0]}</span>
        <span class="schematic-arrow" aria-hidden="true">──►</span>
        <span class="schematic-node is-core">${meta.nodes[1]}</span>
        <span class="schematic-arrow" aria-hidden="true">──►</span>
        <span class="schematic-node">${meta.nodes[2]}</span>
      </div>
    </div>
    <p class="project-summary">${item.description}</p>
    <ul class="project-highlights">
      <li>${meta.highlights[0]}</li>
      <li>${meta.highlights[1]}</li>
    </ul>
    <div class="project-stack-chips" aria-hidden="true">${stackChips(item.stack)}</div>
    <p class="project-stack sr-only">${item.stack}</p>
    <div class="project-card-footer">
      <button class="primary project-cta" data-case="${id}">Explorar el caso →</button>
    </div>
  </article>`
}

function projects(): string {
  return `<span class="eyebrow">TALLER DE SOLUCIONES · PROYECTOS</span><h2>Proyectos</h2>
    <p class="lead">Dos contextos distintos. Desarrollo integral para resolver problemas concretos.</p>
    <div class="workshop-hud-bar" aria-label="Resumen de proyectos del taller">
      <span class="hud-stat-pill">🛠️ <strong>2 Sistemas Reales</strong></span>
      <span class="hud-stat-pill">🟢 <strong>1 en Producción (ARCA)</strong></span>
      <span class="hud-stat-pill">🦊 <strong>1 Plataforma EdTech con IA</strong></span>
    </div>
    <div class="project-grid">${projectCard('foxmind')}${projectCard('flower')}</div>
    <p class="review-note">Casos en revisión. Las capturas reales se incorporarán cuando estén disponibles; las pantallas del fondo del taller son decorativas y no representan los productos.</p>
    <div class="room-inline-actions">
      <button class="outline" data-section="contact">Consultar en el Puesto de radio →</button>
      <a class="outline" href="${mail('Consulta sobre proyectos')}">Escribir por correo ↗</a>
    </div>`
}

function about(): string {
  return `<span class="eyebrow">CARPA PERSONAL · PERFIL Y FORMA DE TRABAJO</span><h2>Sobre mí</h2>
    <div class="about-layout">
      <div class="about-bio-card">
        <div class="character-sheet-tags" aria-hidden="true">
          <span class="pixel-chip">🎓 Ing. en Sistemas (UTN)</span>
          <span class="pixel-chip">💻 Full Stack &amp; IA</span>
          <span class="pixel-chip">📍 Argentina</span>
        </div>
        <p class="lead">Soy Alejo Palavecino, estudiante de Ingeniería en Sistemas de Información (UTN) y desarrollador de software.</p>
        <p>Me interesa entender primero una necesidad real, definir una solución clara y construir un producto que se pueda usar. Soy cofundador de FoxMind y desarrollador de sistemas a medida en producción como Flower.</p>
        <h3>Forma de trabajar e intereses</h3>
        <p>Trabajo en desarrollo full stack, análisis funcional, automatización e inteligencia artificial aplicada. También me interesan oportunidades compatibles con producto y coordinación técnica.</p>
      </div>
      <aside class="about-portrait-card">
        <img src="${assetUrl('portrait.webp')}" width="480" height="480" alt="Retrato ilustrado de Alejo">
        <div class="portrait-caption">
          <strong>Alejo Palavecino</strong>
          <span>Desarrollador de Software · UTN</span>
        </div>
      </aside>
    </div>
    <h3>En qué puedo ayudarte</h3><p>Desarrollo a medida y servicios profesionales con alcance definido para cada necesidad.</p>
    <div class="services-grid">${services.map((service, idx) => `<article class="service-card"><span class="service-num">HABILIDAD 0${idx + 1}</span><h4>${service.title}</h4><p>${service.description}</p></article>`).join('')}</div>
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
    <p class="lead">¿Tenés una oportunidad laboral o un desarrollo a medida en mente? Elegí un contrato o frecuencia para comunicarnos.</p>
    <div class="radio-console-bar" aria-label="Estado del puesto de comunicaciones">
      <span class="radio-freq-pill"><i class="status-led" aria-hidden="true"></i> <strong>FRECUENCIA 142.8 MHz · EN LÍNEA</strong></span>
      <span class="radio-freq-pill">📡 <strong>2 modalidades activas:</strong> Equipos &amp; Contratos a medida</span>
    </div>
    <div class="correspondence-sheet">
      <div class="intent-grid">
        <article class="intent-card" data-intent-card="laboral">
          <div class="intent-card-top">
            <span class="contract-code">CONTRATO #01 · CANAL EQUIPO</span>
            <span class="badge-status" data-led="green"><i class="status-led" aria-hidden="true"></i>Intención 01 · Empleo y equipos</span>
          </div>
          <div class="intent-title-row">
            <img class="intent-card-icon" src="${assetUrl('camp-rooms-v1/ui/icon-contact@4x.png')}" alt="" width="28" height="28">
            <h3>Tengo una oportunidad laboral</h3>
          </div>
          <p>Para roles full stack, análisis funcional, automatización o IA aplicada.</p>
          <ul class="contract-specs">
            <li><strong>Enfoque:</strong> Desarrollo de producto, arquitectura web e integración de IA.</li>
            <li><strong>Aporte:</strong> Código de punta a punta, relevamiento funcional y trabajo en equipo.</li>
          </ul>
          <div class="contract-chips" aria-hidden="true">
            <span class="pixel-chip">Full Stack</span>
            <span class="pixel-chip">Análisis Funcional</span>
            <span class="pixel-chip">Automatización</span>
            <span class="pixel-chip">IA Aplicada</span>
          </div>
          <a class="primary contract-cta" href="${mail('Oportunidad laboral')}">Abrir cliente de correo · Oportunidad →</a>
        </article>
        <article class="intent-card" data-intent-card="proyecto">
          <div class="intent-card-top">
            <span class="contract-code">CONTRATO #02 · CANAL PROYECTO</span>
            <span class="badge-status" data-led="amber"><i class="status-led" aria-hidden="true"></i>Intención 02 · Servicios y proyectos</span>
          </div>
          <div class="intent-title-row">
            <img class="intent-card-icon" src="${assetUrl('camp-rooms-v1/ui/icon-projects@4x.png')}" alt="" width="28" height="28">
            <h3>Necesito un desarrollo a medida</h3>
          </div>
          <p>Para aplicaciones web, sistemas de gestión, integraciones (como ARCA) o IA.</p>
          <ul class="contract-specs">
            <li><strong>Alcance:</strong> Desde el relevamiento y diseño hasta la puesta en producción.</li>
            <li><strong>Soluciones:</strong> Sistemas de stock y ventas, facturación ARCA, apps web e IA.</li>
          </ul>
          <div class="contract-chips" aria-hidden="true">
            <span class="pixel-chip">Software a Medida</span>
            <span class="pixel-chip">React · Node · SQL</span>
            <span class="pixel-chip">Facturación ARCA</span>
            <span class="pixel-chip">IA</span>
          </div>
          <a class="outline contract-cta" href="${mail('Proyecto de desarrollo a medida')}">Abrir cliente de correo · Desarrollo →</a>
        </article>
      </div>
      <div class="channel-box">
        <div class="channel-box-header">
          <img src="${assetUrl('camp-rooms-v1/ui/icon-mail@4x.png')}" alt="" width="22" height="22">
          <strong>TERMINAL DE TRANSMISIÓN DIRECTA · CORREO Y CV</strong>
        </div>
        <p class="channel-readout"><strong>Canal directo de correo:</strong> <a href="${mail('Hola Alejo')}" class="mail-address">${email}</a> <small>(correo en revisión)</small></p>
        <p class="review-note">Los enlaces anteriores abren tu aplicación de correo configurada; no se utiliza un formulario de envío simulado sin servidor.</p>
        <div class="contact-actions">
          <button type="button" class="primary" data-action="copy-email" data-email="${email}">Copiar correo</button>
          <a class="outline" href="${assetUrl('cv-alejo-palavecino-es.pdf')}" download>Descargar CV original (PDF) ↓</a>
          <button type="button" class="outline" data-section="projects">Ver casos en el Taller →</button>
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
  const meta = PROJECT_META[id]
  const otherId: CaseId = id === 'foxmind' ? 'flower' : 'foxmind'
  const otherItem = cases[otherId]
  return `<div class="panel-nav"><button class="text-button" data-action="projects">← Volver a Proyectos</button><button class="text-button" data-case="${otherId}">Cambiar a ${otherItem.shortTitle} →</button>${back}</div>
    <span class="eyebrow">TALLER DE SOLUCIONES · ${meta.questCode}</span><h2>${item.title}</h2><p class="lead">${item.subtitle}</p>
    <div class="case-metrics-strip" aria-label="Ficha rápida del caso">
      <div class="case-metric-box">
        <span class="metric-label">ESTADO DEL SISTEMA</span>
        <strong class="metric-value"><span class="badge-status" data-led="${meta.led}"><i class="status-led" aria-hidden="true"></i>${item.status}</span></strong>
      </div>
      <div class="case-metric-box">
        <span class="metric-label">ROL Y RESPONSABILIDAD</span>
        <strong class="metric-value">${item.role}</strong>
      </div>
      <div class="case-metric-box">
        <span class="metric-label">FLUJO PRINCIPAL</span>
        <strong class="metric-value">${meta.nodes[0]} → ${meta.nodes[1]} → ${meta.nodes[2]}</strong>
      </div>
    </div>
    <div class="case-layout">
      <div class="case-main">
        <div class="case-copy">
          <div class="case-block">
            <span class="case-step-tag">01 · CONTEXTO Y PROBLEMA</span>
            <h3>El proyecto</h3>
            <p>${item.description}</p>
          </div>
          <div class="case-block">
            <span class="case-step-tag">02 · EJECUCIÓN TÉCNICA</span>
            <h3>Mi participación y alcance</h3>
            <p>${item.contribution}</p>
          </div>
          <div class="case-block">
            <span class="case-step-tag">03 · MÓDULOS CLAVE DEL SISTEMA</span>
            <div class="case-modules-grid">
              ${meta.modules.map(m => `<div class="case-module-card"><span class="module-code">${m.code}</span><strong>${m.name}</strong><p>${m.detail}</p></div>`).join('')}
            </div>
          </div>
        </div>
        <div class="placeholder"><span aria-hidden="true">▧</span>
          <strong>Evidencia visual en preparación</strong>
          <small>Se incorporarán capturas reales de ${item.shortTitle} cuando estén autorizadas. Las pantallas ilustradas del fondo del taller son decorativas.</small>
        </div>
      </div>
      <aside class="case-aside">
        <span class="project-quest-code">${meta.questCode}</span>
        <span class="badge-status" data-led="${meta.led}"><i class="status-led" aria-hidden="true"></i>${item.status}</span>
        <h3>Mi rol</h3><p>${item.role}</p>
        <h3>Tecnologías y alcance</h3>
        <div class="project-stack-chips" aria-hidden="true">${stackChips(item.stack)}</div>
        <p>${item.stack}</p>
        <div class="case-actions">
          <a class="primary" href="${mail(`Consulta sobre ${item.shortTitle}`)}">Consultar por un proyecto →</a>
          <button class="outline" data-section="contact">Ir al Puesto de radio →</button>
          <button class="outline" data-case="${otherId}">Ver caso: ${otherItem.shortTitle} →</button>
        </div>
      </aside>
    </div>`
}

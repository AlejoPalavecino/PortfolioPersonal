import { credentialById, publishedCredentials, type Credential, type CredentialKind } from '../entities'
import { assetUrl } from '../shared'

const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
const kinds: Record<CredentialKind, string> = {
  training: 'Certificados de formación', certification: 'Certificaciones profesionales', award: 'Premios', mention: 'Menciones',
}
const back = '<button class="text-button" data-action="back">← Volver al campamento</button>'
const sourceUrl = (url: string) => /^https:\/\//i.test(url) ? url : assetUrl(url)

export function journeyTabs(selected: 'journey' | 'recognitions'): string {
  return `<nav class="journey-tabs" aria-label="Páginas de la Bitácora">
    <button class="text-button" data-action="journey"${selected === 'journey' ? ' aria-current="page"' : ''}>Recorrido</button>
    <button class="text-button" data-action="recognitions"${selected === 'recognitions' ? ' aria-current="page"' : ''}>Certificados y reconocimientos</button>
  </nav>`
}

function credentialCard(item: Credential): string {
  return `<article class="project-card"><span class="eyebrow">${kinds[item.kind]}</span>
    <h3>${escape(item.title)}</h3><p>${escape(item.issuer ?? '')}</p><p>${escape(item.description)}</p>
    <button class="outline" data-credential="${escape(item.id)}">Ver documento y evidencia →</button></article>`
}

export function recognitionsMarkup(): string {
  const published = publishedCredentials()
  const collection = published.length ? (Object.keys(kinds) as CredentialKind[]).map(kind => {
    const records = published.filter(item => item.kind === kind)
    return records.length ? `<section><h3>${kinds[kind]}</h3><div class="credential-grid">${records.map(credentialCard).join('')}</div></section>` : ''
  }).join('') : '<p class="review-note">La colección se está preparando. Los documentos originales y su atribución se revisarán antes de incorporarlos.</p>'
  return `<div class="panel-nav">${back}</div><span class="eyebrow">LA BITÁCORA</span>
    <h2>Certificados y reconocimientos</h2>${journeyTabs('recognitions')}
    <p class="lead">Formación, premios y menciones con acceso a su evidencia original.</p>${collection}`
}

function dateLabel(date: Credential['date']): string {
  if (!date) return ''
  if (date.precision === 'year') return date.value
  const value = new Date(`${date.value}${date.precision === 'month' ? '-01' : ''}T00:00:00Z`)
  return new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'long',
    ...(date.precision === 'day' ? { day: 'numeric' } : {}), timeZone: 'UTC' }).format(value)
}

function originalEvidence(item: Credential): string {
  const evidence = item.evidence!
  const url = escape(sourceUrl(evidence.url))
  const original = `<a class="outline" href="${url}" target="_blank" rel="noopener noreferrer">Abrir evidencia original ↗</a>`
  if (evidence.kind === 'image') return `<figure class="credential-evidence"><img src="${url}" alt="${escape(evidence.alt)}"><figcaption>${original}</figcaption></figure>`
  if (evidence.kind === 'pdf') return `<div class="credential-evidence"><iframe src="${url}" title="${escape(evidence.alt)}" loading="lazy"></iframe>${original}</div>`
  return `<p>${escape(evidence.alt)}</p>${original}`
}

export function credentialMarkup(id: string): string {
  const item = credentialById(id)
  const navigation = `<div class="panel-nav"><button class="text-button" data-action="recognitions">← Volver a certificados y reconocimientos</button>${back}</div>`
  if (!item) return `${navigation}<h2>Documento no disponible</h2><p>Podés consultar la colección de documentos publicados desde la Bitácora.</p>`
  const date = dateLabel(item.date)
  const recipient = item.recipient!
  const recipients = { person: 'Persona', team: 'Equipo', project: 'Proyecto' }
  const verification = item.verification ? `<p><a href="${escape(item.verification.url)}" target="_blank" rel="noopener noreferrer">${escape(item.verification.label)} ↗</a></p>` : ''
  return `${navigation}<span class="eyebrow">${kinds[item.kind]}</span><h2>${escape(item.title)}</h2>
    <p class="lead">${escape(item.issuer!)}</p><p>${recipients[recipient.kind]}: ${escape(recipient.name)}${date ? ` · ${escape(date)}` : ''}</p>
    <p>${escape(item.description)}</p>${originalEvidence(item)}${verification}`
}

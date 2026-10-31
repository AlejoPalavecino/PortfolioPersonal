export type CredentialKind = 'training' | 'certification' | 'award' | 'mention'
export type EditorialState = 'draft' | 'published'
export type Credential = Readonly<{
  id: string
  kind: CredentialKind
  title: string
  issuer: string | null
  date: { value: string; precision: 'year' | 'month' | 'day' } | null
  recipient: { kind: 'person' | 'team' | 'project'; name: string } | null
  description: string
  evidence: { kind: 'pdf' | 'image' | 'link'; url: string; alt: string } | null
  verification: { url: string; label: string } | null
  editorial: EditorialState
}>

export const credentials: readonly Credential[] = [
  {
    id: 'ilan-foxmind', kind: 'award', title: 'Premio ILAN con FoxMind',
    issuer: null, date: null, recipient: null,
    description: 'Antecedente mencionado en el CV. Evidencia original y atribución exacta pendientes.',
    evidence: null, verification: null, editorial: 'draft',
  },
  {
    id: 'egg-full-stack', kind: 'training', title: 'Programación Web Full Stack',
    issuer: 'Egg Corporation', date: null, recipient: null,
    description: 'Formación mencionada en el CV. Documento original, fecha y atribución pendientes de revisión.',
    evidence: null, verification: null, editorial: 'draft',
  },
  {
    id: 'ucm-mobile', kind: 'training', title: 'Desarrollo de Apps Móviles',
    issuer: 'Universidad Complutense de Madrid', date: null, recipient: null,
    description: 'Formación mencionada en el CV. Documento original, fecha y atribución pendientes de revisión.',
    evidence: null, verification: null, editorial: 'draft',
  },
]

export function credentialAssetIsSafe(url: string): boolean {
  if (/^https:\/\//i.test(url)) {
    try { const parsed = new URL(url); return parsed.protocol === 'https:' && !!parsed.hostname && !parsed.username && !parsed.password }
    catch { return false }
  }
  return /^(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:pdf|png|jpe?g|webp)$/i.test(url)
}

function validDate(date: Credential['date']): boolean {
  if (!date) return true
  const patterns = { year: /^\d{4}$/, month: /^\d{4}-(0[1-9]|1[0-2])$/, day: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/ }
  if (!patterns[date.precision].test(date.value)) return false
  if (date.precision !== 'day') return true
  const parsed = new Date(`${date.value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date.value
}

function publishable(item: Credential): boolean {
  return item.editorial === 'published' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)
    && !!item.title.trim() && !!item.issuer?.trim() && !!item.recipient?.name.trim()
    && !!item.description.trim() && !!item.evidence?.alt.trim()
    && credentialAssetIsSafe(item.evidence.url) && validDate(item.date)
    && (!item.verification || (/^https:\/\//i.test(item.verification.url)
      && credentialAssetIsSafe(item.verification.url) && !!item.verification.label.trim()))
}

export function publishedCredentials(): readonly Credential[] {
  return credentials.filter(publishable)
}

export function credentialById(id: string): Credential | undefined {
  return publishedCredentials().find(item => item.id === id)
}

export { credentials, credentialById, publishedCredentials, credentialAssetIsSafe } from './credentials'
export type { Credential, CredentialKind, EditorialState } from './credentials'

export const sections = {
  projects: 'Proyectos', about: 'Sobre mí', journey: 'Trayectoria', contact: 'Contacto',
} as const
export type Section = keyof typeof sections
export const email = 'alejopalavecino12@gmail.com'
export const cases = {
  foxmind: {
    title: 'FoxMind',
    shortTitle: 'FoxMind',
    subtitle: 'Plataforma educativa con inteligencia artificial.',
    role: 'Cofundador y desarrollador',
    stack: 'Desarrollo integral · Integración de IA · Alcance público limitado',
    description: 'Plataforma educativa orientada a personalizar el aprendizaje y acompañar el trabajo docente con inteligencia artificial.',
    contribution: 'Responsable del desarrollo completo hasta la etapa actual, incluida la integración de IA. Alcance público limitado previo a pilotos.',
    status: 'Previo a pruebas piloto',
  },
  flower: {
    title: 'Sistema de stock y facturación para Flower',
    shortTitle: 'Flower',
    subtitle: 'Control de stock y facturación automática para una librería.',
    role: 'Desarrollo integral individual',
    stack: 'React · Node.js · PostgreSQL · Facturación ARCA',
    description: 'Sistema de control de stock y facturación para la librería Flower. La conexión con ARCA automatiza la facturación de las ventas.',
    contribution: 'Desarrollo individual completo de punta a punta con React, Node.js y PostgreSQL, actualmente en producción.',
    status: 'En producción',
  },
} as const
export type CaseId = keyof typeof cases

export const services = [
  { title: 'Software a medida', description: 'Aplicaciones y sistemas adaptados a una necesidad concreta, desde el diseño hasta la puesta en marcha.' },
  { title: 'Análisis funcional', description: 'Relevamiento de necesidades, definición de requisitos, modelado de datos y flujos de trabajo.' },
  { title: 'Integraciones y automatización', description: 'Conexión de herramientas, servicios externos (como facturación ARCA) y automatización de tareas operativas.' },
  { title: 'IA aplicada', description: 'Incorporación de inteligencia artificial en productos y procesos con una utilidad práctica y definida.' },
] as const

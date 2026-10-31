export const sections = {
  projects: 'Proyectos', about: 'Sobre mí', journey: 'Trayectoria', contact: 'Contacto',
} as const
export type Section = keyof typeof sections
export const email = 'alejopalavecino12@gmail.com'
export const cases = {
  foxmind: { title: 'FoxMind', subtitle: 'Plataforma educativa con inteligencia artificial.', role: 'Cofundador y desarrollador', description: 'Una plataforma educativa orientada a personalizar el aprendizaje y acompañar el trabajo docente.', contribution: 'Desarrollo completo hasta la etapa actual, incluida la integración de IA.', status: 'Previo a pruebas piloto' },
  flower: { title: 'Sistema de stock y facturación para Flower', subtitle: 'Software para una librería en producción.', role: 'Desarrollo integral individual', description: 'Sistema de control de stock y facturación para una librería. La conexión con ARCA automatiza la facturación de las ventas.', contribution: 'Desarrollo completo con React, Node.js y PostgreSQL.', status: 'En producción' },
} as const
export type CaseId = keyof typeof cases

export const services = [
  { title: 'Software a medida', description: 'Sistemas y herramientas adaptados a una necesidad concreta.' },
  { title: 'Análisis funcional', description: 'Relevamiento de necesidades, requisitos y definición de flujos.' },
  { title: 'Integraciones y automatización', description: 'Conectar herramientas y automatizar tareas según el alcance del proyecto.' },
  { title: 'IA aplicada', description: 'Incorporar inteligencia artificial en productos y procesos con una función definida.' },
] as const

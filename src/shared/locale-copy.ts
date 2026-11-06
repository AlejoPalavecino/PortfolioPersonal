import { language } from './i18n'

/**
 * Runtime labels that are not authored through t(): loader messages, scene hints,
 * accessible names and legacy deep links. Keep pairs explicit and reversible.
 */
const copy: Readonly<Record<string, string>> = {
  'CAMPAMENTO CREATIVO': 'CREATIVE CAMP',
  'Campamento interactivo': 'Interactive camp',
  'Lugares del campamento': 'Places around the camp',
  'Bienvenida y presentación inicial': 'Welcome and introduction',
  'Controles de presentación': 'Introduction controls',
  'Preparando el campamento…': 'Preparing the camp…',
  'Preparando el campamento': 'Preparing the camp',
  'Preparación real de recursos del campamento': 'Real camp asset loading progress',
  'Entrar o consultar el portfolio': 'Enter or browse the portfolio',
  'Conversación con Alejo': 'Conversation with Alejo',
  'Tu próxima parada: el campamento.': 'Your next stop: the camp.',
  'Alejo se acerca para darte la bienvenida.': 'Alejo is here to welcome you.',
  'ALEJO · TU GUÍA': 'ALEJO · YOUR GUIDE',
  '¡Ey, llegaste!': 'Hey, you made it!',
  'Proyectos · Contacto · Trayectoria · Sobre mí': 'Projects · Contact · Journey · About me',
  'Preparando el taller de proyectos': 'Preparing the project workshop',
  'Cargando el interior del taller…': 'Loading the workshop…',
  'El taller está tardando. Abriendo el contenido…': 'The workshop is taking longer. Opening the content…',
  'Taller listo. Abriendo proyectos…': 'Workshop ready. Opening projects…',
  'Abriendo proyectos con fondo alternativo…': 'Opening projects with a fallback background…',
  'Entrando al campamento': 'Entering the camp',
  'Entrando al taller…': 'Entering the workshop…',
  '01 · Taller de soluciones': '01 · Solutions workshop',
  'Abrir contenido ahora →': 'Open content now →',
  'El campamento no pudo cargarse.': 'The camp could not be loaded.',
  'Reintentar escena': 'Retry scene',
  'Elegí un destino para caminar y visitar su interior. También podés explorar con WASD o las flechas.': 'Choose a destination to walk to and explore inside. You can also use WASD or the arrow keys.',
  'Elegí un destino para caminar. También podés explorar con WASD o las flechas.': 'Choose a destination to start walking. You can also explore with WASD or the arrow keys.',
  'Tocá un destino para caminar hasta él. También podés tocar un punto del camino.': 'Tap a destination to walk there. You can also tap a point along the path.',
  'Cerrar ayuda': 'Close help',
  'En camino…': 'On the way…',
  'Continuar recorrido': 'Resume journey',
  'Abrir ahora': 'Open now',
  'Cancelar recorrido': 'Cancel route',
  'Recorrido en pausa': 'Journey paused',
  'Caminando…': 'Walking…',
  'Lugar visitado': 'Visited location',
  'Lugar por explorar': 'Location to explore',
  'Activar sonido': 'Enable sound',
  'Apagar sonido': 'Mute sound',
  'Sonido apagado': 'Sound off',
  'No se pudo activar sonido': 'Sound could not be enabled',
  'Continuar sonido': 'Resume sound',
  'Reducir movimiento': 'Reduce motion',
  'Activar movimiento': 'Enable motion',
  'Movimiento reducido por el sistema': 'Motion reduced by system preference',
  'Movimiento reducido: sistema y preferencia': 'Motion reduced by system and personal preferences',
  'El sistema solicita reducir movimiento.': 'Your system requests reduced motion.',
  'Preferencia de movimiento del portfolio.': 'Portfolio motion preference.',
  'Listo para explorar': 'Ready to explore',
  'No se pudo preparar el campamento. Podés consultar el portfolio.': 'The camp could not be prepared. You can still browse the portfolio.',
  'Está tardando. Podés consultar el portfolio mientras tanto.': 'Loading is taking longer. You can browse the portfolio in the meantime.',
  'No se pudo cargar la imagen.': 'The image could not be loaded.',
  'Reintentar': 'Retry',
  'Contenido de': 'Content of',
  'No se pudo cargar la ilustración. El contenido sigue disponible.': 'The illustration could not be loaded. The content is still available.',
  'Reintentar fondo': 'Retry background',
  'Comentario de Alejo': 'Comment from Alejo',
  'Cargando el paisaje': 'Loading the landscape',
  'Cargando el paisaje y los personajes…': 'Loading scenery and characters…',
  'CANAL 01': 'CHANNEL 01',
  'CANAL 02': 'CHANNEL 02',
  'Motivo de contacto': 'Reason for contacting me',
  'Copiar correo': 'Copy email',
  'Correo copiado ✓': 'Email copied ✓',
  'Correo copiado al portapapeles:': 'Email copied to clipboard:',
  'No se pudo copiar automáticamente. El correo quedó listo para copiar manualmente:': 'Automatic copying failed. The email is ready to copy manually:',
  'Copiá el correo manualmente:': 'Copy the email manually:',
  'Correo electrónico para copia manual': 'Email address for manual copying',
  'Para sumarme a un equipo': 'To join a team',
  'Para construir un producto': 'To build a product',
  'El mensaje se envía desde tu aplicación de correo.': 'Your email app opens; no message is sent automatically.',
  'En producción': 'In production',
  'Formación en curso': 'Currently studying',
  'Previo a pruebas piloto': 'Before pilot testing',
  'Lo que viene': 'What comes next',
  'Seguir construyendo': 'Keep building',
  'Bitácora de expedición': 'Adventure journal',
  'Entradas de la bitácora': 'Journal entries',
  'Páginas del cuaderno': 'Notebook pages',
  'Mi cuaderno': 'My notebook',
  'Una conversación empieza acá.': 'Every great project starts with a conversation.',
  'Una conversación empieza acá': 'Every great project starts with a conversation',
  'Taller de soluciones': 'Solutions workshop',
  'Ver estas capacidades en mis proyectos': 'See these skills in my projects',
  'Abrir correo · Oportunidad laboral ↗': 'Send email · Job opportunity ↗',
  'Oportunidad laboral': 'Job opportunity',
  'Desarrollo a medida': 'Custom software',
  'Desarrollo full stack, análisis funcional, automatización e IA aplicada.': 'Full stack development, systems analysis, automation and applied AI.',
  'Sobre mí': 'About me',
  'Trayectoria': 'Journey',
  'Proyectos': 'Projects',
  'Contacto': 'Contact',
  'Campamento': 'Camp',
  'El cliente y cualquier dato de pacientes permanecen confidenciales.': 'Client and patient information remains confidential.',
  'ARCHIVO DE EXPEDICIÓN · EVIDENCIAS': 'ADVENTURE ARCHIVE · EVIDENCE',
  'Recorrido': 'Journey',
  'Certificados y reconocimientos': 'Certificates and recognitions',
  'Certificados de formación': 'Training certificates',
  'Certificaciones profesionales': 'Professional certifications',
  'Premios': 'Awards',
  'Menciones': 'Mentions',
  'Ver documento y evidencia →': 'View document and evidence →',
  'Las próximas páginas se están preparando.': 'The next pages are being prepared.',
  'Los documentos originales y su atribución se revisan antes de publicarse. Los registros en borrador permanecen fuera de la colección.': 'Original documents and attribution are reviewed before publication. Draft records stay outside the public collection.',
  'Formación, premios y menciones con acceso a su evidencia original verificable.': 'Training, awards and mentions with links to verifiable original evidence.',
  'Abrir evidencia original ↗': 'Open original evidence ↗',
  '← Volver a certificados y reconocimientos': '← Back to certificates and recognitions',
  'Documento no disponible': 'Document not available',
  'Podés consultar la colección de documentos publicados desde la Bitácora.': 'You can browse published documents in the Journal.',
  'ALEJO · EN EL TALLER': 'ALEJO · IN THE WORKSHOP',
  'ALEJO · EN LA CARPA': 'ALEJO · IN THE TENT',
  'ALEJO · EN LA BITÁCORA': 'ALEJO · IN THE JOURNAL',
  'ALEJO · EN LA RADIO': 'ALEJO · AT THE RADIO',
  'ALEJO · AGUA': 'ALEJO · WATER',
  'ALEJO · PROCESOS': 'ALEJO · WORKFLOWS',
  'ALEJO · EVIDENCIAS': 'ALEJO · EVIDENCE',
  'ALEJO · EQUIPOS': 'ALEJO · TEAMS',
  'ALEJO · A MEDIDA': 'ALEJO · CUSTOM SOFTWARE',
  'Estos planos muestran distintas maneras de resolver problemas reales.': 'These blueprints show different ways to solve real problems.',
  'Primero entiendo el problema. Después pienso cómo construir la solución.': 'I first understand the problem, then work out how to build a solution.',
  'Cada experiencia deja algo para llevar al próximo proyecto.': 'Every experience teaches me something for the next project.',
  'Contame qué tenés en mente y empecemos una conversación.': 'Tell me what you have in mind and let’s start a conversation.',
  'Aprendizaje e inteligencia artificial, con alcance público limitado antes de pilotos.': 'Learning and AI, with limited public details before pilot testing.',
  'Un sistema que acompaña el trabajo de una librería, con facturación automática mediante ARCA.': 'A stationery shop system with automated ARCA invoicing.',
  'Anticipar heladas para decidir mejor cuándo actuar.': 'Predict frost to make better decisions about when to act.',
  'Medir para entender mejor la distribución del agua.': 'Measure water flow to better understand its distribution.',
  'Organizar conocimiento también es resolver un problema.': 'Organizing knowledge is another way to solve a problem.',
  'Automatizar tareas repetitivas para ganar tiempo.': 'Automate repetitive work to save time.',
  'Acá reúno documentos que pueda compartir con su atribución verificada.': 'I collect documents here once their attribution is verified.',
  'Me interesa aportar a equipos que construyen productos útiles.': 'I want to contribute to teams building useful products.',
  'Podemos empezar por entender la necesidad y definir un alcance.': 'We can begin by understanding your needs and defining the scope.',
  'CORREO COPIADO': 'EMAIL COPIED',
  'COPIA MANUAL': 'COPY MANUALLY',
  'El correo ya está copiado. Escribime cuando quieras.': 'The email is copied. Reach out whenever you like.',
  'Podés seleccionar la dirección que aparece abajo.': 'You can select the address shown below.'
}
const reverse = new Map(Object.entries(copy).map(([es,en]) => [en,es]))

export function localizeText(value: string): string {
  const normalized = value.trim()
  if (!normalized) return value
  const replacement = language() === 'en' ? copy[normalized] : reverse.get(normalized)
  if (replacement) return value.replace(normalized, replacement)
  const match = normalized.match(/^(\d+) de (\d+) recursos$/) || normalized.match(/^(\d+) of (\d+) assets$/)
  if (match) return value.replace(normalized, language() === 'en' ? match[1] + ' of ' + match[2] + ' assets' : match[1] + ' de ' + match[2] + ' recursos')
  return value
}

/** Only edits human-visible copy. Never touches icon SVGs, data attributes, user values, URLs or game state. */
export function localizeVisibleUi(root: HTMLElement): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script,style,svg')) continue
    const original = node.nodeValue || ''
    const next = localizeText(original)
    if (next !== original) node.nodeValue = next
  }
  root.querySelectorAll<HTMLElement>('[aria-label],[aria-description],[title],[placeholder]').forEach(element => {
    for (const attribute of ['aria-label','aria-description','title','placeholder']) {
      const value = element.getAttribute(attribute)
      if (value) {
        const translated = localizeText(value)
        if (translated !== value) element.setAttribute(attribute, translated)
      }
    }
  })
}

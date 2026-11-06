import { t } from '../shared/i18n'

export { credentials, credentialById, publishedCredentials, credentialAssetIsSafe } from './credentials'
export type { Credential, CredentialKind, EditorialState } from './credentials'

export const sections = {
  projects: t('Proyectos', 'Projects'),
  about: t('Sobre mí', 'About me'),
  journey: t('Trayectoria', 'Journey'),
  contact: t('Contacto', 'Contact'),
} as const
export type Section = keyof typeof sections
export const email = 'alejopalavecino12@gmail.com'
export const linkedin = 'https://www.linkedin.com/in/alejo-palavecino/'

export const cases = {
  foxmind: {
    title: 'FoxMind', shortTitle: 'FoxMind',
    subtitle: t('Tecnología educativa que se adapta a cada estudiante.', 'Educational technology that adapts to each learner.'),
    role: t('Cofundador, líder y desarrollador del producto', 'Co-founder, product lead and developer'),
    stack: t('Producto web · React · Node.js · PostgreSQL · IA aplicada', 'Web product · React · Node.js · PostgreSQL · Applied AI'),
    description: t('Nació de dos problemas reales: las barreras de aprendizaje que enfrentan estudiantes con distintas necesidades y las horas extra que muchos docentes dedican a planificar y adaptar materiales. La idea es que la tecnología se adapte a las personas y no al revés.', 'FoxMind tackles two real problems: learning barriers for students with different needs and the extra hours teachers spend planning and adapting materials. Technology should adapt to people, not the other way around.'),
    contribution: t('Soy cofundador, lidero el producto y participo en el análisis, el diseño y el desarrollo de la plataforma. Trabajamos en personalización educativa, adaptaciones por software y herramientas asistidas por IA. Todavía estamos preparando las pruebas piloto: no presento resultados de impacto que aún no medimos.', 'I co-founded FoxMind and lead the product, contributing to analysis, UX and software development. We are building software-based learning adaptations and AI-assisted teaching tools. The pilot phase is still being prepared, so I do not claim measured outcomes yet.'),
    status: t('En desarrollo · previo a pilotos', 'In development · pre-pilot'),
    highlight: t('1.er puesto · Premio ILAN a la Innovación Universitaria 2026', '1st place · ILAN University Innovation Award 2026'),
  },
  flower: {
    title: t('Sistema de stock y facturación para Flower', 'Inventory and invoicing system for Flower'),
    shortTitle: 'Flower',
    subtitle: t('Gestión de stock y facturación para una librería.', 'Inventory and invoicing for a stationery shop.'),
    role: t('Creador y desarrollador integral', 'Sole product developer'),
    stack: t('React · Node.js · PostgreSQL · Integración ARCA', 'React · Node.js · PostgreSQL · ARCA integration'),
    description: t('Un negocio necesitaba conectar el control de productos con las ventas y su facturación, sin depender de tareas repetitivas.', 'A business needed inventory, sales and invoicing to work together instead of relying on repetitive manual steps.'),
    contribution: t('Diseñé y desarrollé el sistema completo. Integra gestión de stock y automatización de facturación de ventas mediante ARCA. Es un desarrollo real que está en producción.', 'I designed and built the system end to end. It combines inventory management and automated sales invoicing through ARCA. The software is currently in production.'),
    status: t('En producción', 'In production'),
    highlight: t('Software real para una operación comercial', 'Real-world software for business operations'),
  },
  agrotech: {
    title: 'Agrotech', shortTitle: 'Agrotech',
    subtitle: t('Anticipar heladas para actuar cuando hace falta.', 'Predict frost and act only when needed.'),
    role: t('Creador y único desarrollador', 'Creator and sole developer'),
    stack: t('Prototipado · Arduino · Sensores · Automatización', 'Prototyping · Arduino · Sensors · Automation'),
    description: t('En el campo, una helada detectada tarde puede causar pérdidas; activar sistemas preventivos sin necesidad también consume recursos.', 'On a farm, detecting frost too late can cause losses; triggering prevention systems unnecessarily also wastes resources.'),
    contribution: t('Ideé y desarrollé una propuesta para anticipar heladas mediante predicciones y activar sistemas de prevención antiheladas de forma oportuna. Obtuve el segundo puesto en Emprende U 2021.', 'I created and developed a solution designed to predict frost and trigger prevention systems at the right moment. The project won second place at Emprende U 2021.'),
    status: t('Proyecto de innovación', 'Innovation project'),
    highlight: t('2.º puesto · Emprende U 2021', '2nd place · Emprende U 2021'),
  },
  irrigacion: {
    title: t('Automatización de aforo', 'Irrigation flow measurement'),
    shortTitle: t('Aforo e Irrigación', 'Water flow'),
    subtitle: t('Medir caudales para repartir mejor el agua.', 'Measure water flow for fairer distribution.'),
    role: t('Creador del proyecto', 'Project creator'),
    stack: t('Arduino · Medición de caudal · Automatización', 'Arduino · Flow measurement · Automation'),
    description: t('Las filtraciones en canales e hijuelas de tierra reducen el caudal disponible a lo largo del recorrido. Eso dificulta una distribución equitativa del riego entre productores.', 'Seepage along earthen irrigation channels reduces available water downstream and makes equitable distribution harder for growers.'),
    contribution: t('Propuse y desarrollé un dispositivo para comparar caudales en distintos puntos del canal y aportar datos para una distribución más equitativa. El proyecto contó con participación vinculada a Irrigación.', 'I proposed and developed a device to compare water flow at different channel points, providing data to support fairer irrigation. The work involved collaboration linked to the local irrigation authority.'),
    status: t('Proyecto de medición', 'Measurement project'),
    highlight: t('Tecnología aplicada a una necesidad de Mendoza', 'Technology addressing a local challenge in Mendoza'),
  },
  herbario: {
    title: t('Herbario Digital', 'Digital Herbarium'),
    shortTitle: t('Herbario Digital', 'Digital Herbarium'),
    subtitle: t('Información botánica organizada y accesible.', 'Making botanical knowledge easy to explore.'),
    role: t('Creador y desarrollador', 'Creator and developer'),
    stack: t('Desarrollo web · Google Sites · Organización de contenido', 'Web development · Google Sites · Content architecture'),
    description: t('La información sobre especies vegetales, incluidas plantas autóctonas de Mendoza, necesitaba un lugar simple para consultarse.', 'Information about plant species, including native plants of Mendoza, needed an accessible home.'),
    contribution: t('Creé una web con fichas por especie: nombre científico, clasificación, características y otros datos botánicos.', 'I built a website with species records covering scientific names, classification, characteristics and other botanical details.'),
    status: t('Proyecto web', 'Web project'),
    highlight: t('Organización de información especializada', 'Structured access to specialist information'),
  },
  art: {
    title: t('Automatización de gestión para ART', 'Insurance workflow automation'),
    shortTitle: t('Gestión ART', 'Insurance workflows'),
    subtitle: t('Menos carga manual, más tiempo para trabajar.', 'Less duplicate data entry, more useful work.'),
    role: t('Creador y único desarrollador', 'Creator and sole developer'),
    stack: t('Software a medida · Integraciones · Automatización de procesos', 'Custom software · Integrations · Process automation'),
    description: t('Un centro necesitaba registrar fichas de pacientes en su sistema y volver a cargarlas en una plataforma de ART.', 'A care provider had to enter patient records in its own system and re-enter them in an insurance platform.'),
    contribution: t('Desarrollé una solución para que, al cargar una ficha, se automatice también el registro correspondiente en ART. El cliente permanece confidencial y no se muestran datos clínicos ni privados.', 'I built a workflow that automates the corresponding insurance-platform entry when a record is created. The client remains confidential; no patient or private information is shown.'),
    status: t('Desarrollo para cliente', 'Client project'),
    highlight: t('Caso anónimo por confidencialidad', 'Anonymized for client confidentiality'),
  },
} as const
export type CaseId = keyof typeof cases

export const services = [
  { title: t('Software a medida', 'Custom software'), description: t('Desarrollo sistemas y aplicaciones para resolver necesidades concretas de emprendedores y pymes.', 'I build systems and applications around the real needs of founders and small businesses.') },
  { title: t('Integraciones y automatización', 'Integrations & automation'), description: t('Conecto herramientas, reduzco tareas repetitivas y simplifico procesos de trabajo.', 'I connect tools, eliminate repetitive steps and simplify business workflows.') },
  { title: t('IA aplicada', 'Applied AI'), description: t('Integro inteligencia artificial cuando tiene una utilidad clara para las personas que van a usarla.', 'I integrate AI when it creates practical value for the people using the product.') },
  { title: t('Experiencias web únicas', 'Unique web experiences'), description: t('Creo webs con identidad, interacción y una experiencia memorable: como este portfolio que se recorre jugando.', 'I build distinctive, interactive websites that people remember—like this playable portfolio.') },
  { title: t('Análisis funcional', 'Systems analysis'), description: t('Escucho, relevo requisitos y transformo problemas en soluciones que se pueden diseñar y construir.', 'I gather requirements and turn business problems into solutions teams can design and build.') },
] as const

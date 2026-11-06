import { t } from '../shared/i18n'

export { credentials, credentialById, publishedCredentials, credentialAssetIsSafe } from './credentials'
export type { Credential, CredentialKind, EditorialState } from './credentials'

export const sections = {
  get projects() { return t('Proyectos', 'Projects') },
  get about() { return t('Sobre mí', 'About me') },
  get journey() { return t('Trayectoria', 'Journey') },
  get contact() { return t('Contacto', 'Contact') },
} as const
export type Section = keyof typeof sections
export const email = 'alejopalavecino12@gmail.com'
export const linkedin = 'https://www.linkedin.com/in/alejo-palavecino/'

export const cases = {
  foxmind: {
    title: 'FoxMind', shortTitle: 'FoxMind',
    get subtitle() { return t('Tecnología educativa que se adapta a cada estudiante.', 'Educational technology that adapts to each learner.') },
    get role() { return t('Cofundador, líder y desarrollador del producto', 'Co-founder, product lead and developer') },
    get stack() { return t('Producto web · React · Node.js · PostgreSQL · IA aplicada', 'Web product · React · Node.js · PostgreSQL · Applied AI') },
    get description() { return t('Nació de dos problemas reales: las barreras de aprendizaje que enfrentan estudiantes con distintas necesidades y las horas extra que muchos docentes dedican a planificar y adaptar materiales. La idea es que la tecnología se adapte a las personas y no al revés.', 'FoxMind tackles two real problems: learning barriers for students with different needs and the extra hours teachers spend planning and adapting materials. Technology should adapt to people, not the other way around.') },
    get contribution() { return t('Soy cofundador, lidero el producto y participo en el análisis, el diseño y el desarrollo de la plataforma. Trabajamos en personalización educativa, adaptaciones por software y herramientas asistidas por IA. Todavía estamos preparando las pruebas piloto: no presento resultados de impacto que aún no medimos.', 'I co-founded FoxMind and lead the product, contributing to analysis, UX and software development. We are building software-based learning adaptations and AI-assisted teaching tools. The pilot phase is still being prepared, so I do not claim measured outcomes yet.') },
    get status() { return t('En desarrollo · previo a pilotos', 'In development · pre-pilot') },
    get highlight() { return t('1.er puesto · Premio ILAN a la Innovación Universitaria 2026', '1st place · ILAN University Innovation Award 2026') },
  },
  flower: {
    get title() { return t('Sistema de stock y facturación para Flower', 'Inventory and invoicing system for Flower') },
    shortTitle: 'Flower',
    get subtitle() { return t('Gestión de stock y facturación para una librería.', 'Inventory and invoicing for a stationery shop.') },
    get role() { return t('Creador y desarrollador integral', 'Sole product developer') },
    get stack() { return t('React · Node.js · PostgreSQL · Integración ARCA', 'React · Node.js · PostgreSQL · ARCA integration') },
    get description() { return t('Un negocio necesitaba conectar el control de productos con las ventas y su facturación, sin depender de tareas repetitivas.', 'A business needed inventory, sales and invoicing to work together instead of relying on repetitive manual steps.') },
    get contribution() { return t('Diseñé y desarrollé el sistema completo. Integra gestión de stock y automatización de facturación de ventas mediante ARCA. Es un desarrollo real que está en producción.', 'I designed and built the system end to end. It combines inventory management and automated sales invoicing through ARCA. The software is currently in production.') },
    get status() { return t('En producción', 'In production') },
    get highlight() { return t('Software real para una operación comercial', 'Real-world software for business operations') },
  },
  agrotech: {
    title: 'Agrotech', shortTitle: 'Agrotech',
    get subtitle() { return t('Anticipar heladas para actuar cuando hace falta.', 'Predict frost and act only when needed.') },
    get role() { return t('Creador y único desarrollador', 'Creator and sole developer') },
    get stack() { return t('Prototipado · Arduino · Sensores · Automatización', 'Prototyping · Arduino · Sensors · Automation') },
    get description() { return t('En el campo, una helada detectada tarde puede causar pérdidas; activar sistemas preventivos sin necesidad también consume recursos.', 'On a farm, detecting frost too late can cause losses; triggering prevention systems unnecessarily also wastes resources.') },
    get contribution() { return t('Ideé y desarrollé una propuesta para anticipar heladas mediante predicciones y activar sistemas de prevención antiheladas de forma oportuna. Obtuve el segundo puesto en Emprende U 2021.', 'I created and developed a solution designed to predict frost and trigger prevention systems at the right moment. The project won second place at Emprende U 2021.') },
    get status() { return t('Proyecto de innovación', 'Innovation project') },
    get highlight() { return t('2.º puesto · Emprende U 2021', '2nd place · Emprende U 2021') },
  },
  irrigacion: {
    get title() { return t('Automatización de aforo', 'Irrigation flow measurement') },
    get shortTitle() { return t('Aforo e Irrigación', 'Water flow') },
    get subtitle() { return t('Medir caudales para repartir mejor el agua.', 'Measure water flow for fairer distribution.') },
    get role() { return t('Creador del proyecto', 'Project creator') },
    get stack() { return t('Arduino · Medición de caudal · Automatización', 'Arduino · Flow measurement · Automation') },
    get description() { return t('Las filtraciones en canales e hijuelas de tierra reducen el caudal disponible a lo largo del recorrido. Eso dificulta una distribución equitativa del riego entre productores.', 'Seepage along earthen irrigation channels reduces available water downstream and makes equitable distribution harder for growers.') },
    get contribution() { return t('Propuse y desarrollé un dispositivo para comparar caudales en distintos puntos del canal y aportar datos para una distribución más equitativa. El proyecto contó con participación vinculada a Irrigación.', 'I proposed and developed a device to compare water flow at different channel points, providing data to support fairer irrigation. The work involved collaboration linked to the local irrigation authority.') },
    get status() { return t('Proyecto de medición', 'Measurement project') },
    get highlight() { return t('Tecnología aplicada a una necesidad de Mendoza', 'Technology addressing a local challenge in Mendoza') },
  },
  herbario: {
    get title() { return t('Herbario Digital', 'Digital Herbarium') },
    get shortTitle() { return t('Herbario Digital', 'Digital Herbarium') },
    get subtitle() { return t('Información botánica organizada y accesible.', 'Making botanical knowledge easy to explore.') },
    get role() { return t('Creador y desarrollador', 'Creator and developer') },
    get stack() { return t('Desarrollo web · Google Sites · Organización de contenido', 'Web development · Google Sites · Content architecture') },
    get description() { return t('La información sobre especies vegetales, incluidas plantas autóctonas de Mendoza, necesitaba un lugar simple para consultarse.', 'Information about plant species, including native plants of Mendoza, needed an accessible home.') },
    get contribution() { return t('Creé una web con fichas por especie: nombre científico, clasificación, características y otros datos botánicos.', 'I built a website with species records covering scientific names, classification, characteristics and other botanical details.') },
    get status() { return t('Proyecto web', 'Web project') },
    get highlight() { return t('Organización de información especializada', 'Structured access to specialist information') },
  },
  art: {
    get title() { return t('Automatización de gestión para ART', 'Insurance workflow automation') },
    get shortTitle() { return t('Gestión ART', 'Insurance workflows') },
    get subtitle() { return t('Menos carga manual, más tiempo para trabajar.', 'Less duplicate data entry, more useful work.') },
    get role() { return t('Creador y único desarrollador', 'Creator and sole developer') },
    get stack() { return t('Software a medida · Integraciones · Automatización de procesos', 'Custom software · Integrations · Process automation') },
    get description() { return t('Un centro necesitaba registrar fichas de pacientes en su sistema y volver a cargarlas en una plataforma de ART.', 'A care provider had to enter patient records in its own system and re-enter them in an insurance platform.') },
    get contribution() { return t('Desarrollé una solución para que, al cargar una ficha, se automatice también el registro correspondiente en ART. El cliente permanece confidencial y no se muestran datos clínicos ni privados.', 'I built a workflow that automates the corresponding insurance-platform entry when a record is created. The client remains confidential; no patient or private information is shown.') },
    get status() { return t('Desarrollo para cliente', 'Client project') },
    get highlight() { return t('Caso anónimo por confidencialidad', 'Anonymized for client confidentiality') },
  },
} as const
export type CaseId = keyof typeof cases

export const services = [
  { get title() { return t('Software a medida', 'Custom software') }, get description() { return t('Desarrollo sistemas y aplicaciones para resolver necesidades concretas de emprendedores y pymes.', 'I build systems and applications around the real needs of founders and small businesses.') } },
  { get title() { return t('Integraciones y automatización', 'Integrations & automation') }, get description() { return t('Conecto herramientas, reduzco tareas repetitivas y simplifico procesos de trabajo.', 'I connect tools, eliminate repetitive steps and simplify business workflows.') } },
  { get title() { return t('IA aplicada', 'Applied AI') }, get description() { return t('Integro inteligencia artificial cuando tiene una utilidad clara para las personas que van a usarla.', 'I integrate AI when it creates practical value for the people using the product.') } },
  { get title() { return t('Experiencias web únicas', 'Unique web experiences') }, get description() { return t('Creo webs con identidad, interacción y una experiencia memorable: como este portfolio que se recorre jugando.', 'I build distinctive, interactive websites that people remember—like this playable portfolio.') } },
  { get title() { return t('Análisis funcional', 'Systems analysis') }, get description() { return t('Escucho, relevo requisitos y transformo problemas en soluciones que se pueden diseñar y construir.', 'I gather requirements and turn business problems into solutions teams can design and build.') } },
] as const

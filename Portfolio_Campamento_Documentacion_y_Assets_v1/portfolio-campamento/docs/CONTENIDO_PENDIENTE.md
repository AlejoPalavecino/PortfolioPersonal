# Contenido pendiente para publicar el portfolio

**Fecha de revisión:** 29 de octubre de 2026.

El contenido inicial de `content/portfolio.es.json` procede del CV aportado y del concepto de portfolio acordado. La fecha de actualización del CV no está indicada. Sus datos se conservan como información declarada en ese documento; la preparación del kit no verifica el estado actual de los proyectos ni la disponibilidad laboral de Alejo.

## 1. FoxMind: caso principal

Faltan capturas reales de la versión que se mostrará. Conviene seleccionar dos o tres vistas que permitan entender el producto y la contribución de Alejo: una vista general, un flujo representativo y un detalle relevante. Deben identificarse como prototipo o producto según corresponda, usando datos de demostración cuando sea necesario.

También faltan una descripción precisa del problema abordado, las decisiones que Alejo quiera explicar, la distribución de responsabilidades del equipo y los resultados que puedan respaldarse. Las métricas permanecen vacías hasta contar con evidencia.

El CV describe FoxMind como una plataforma en etapa previa a pruebas piloto y menciona React, Node.js, PostgreSQL y modelos de IA. Hay que confirmar el estado y la arquitectura que correspondan a la versión pública. No presentar automáticamente esa descripción como estado actual.

El CV menciona el primer puesto del Premio ILAN a la Innovación Universitaria, con fecha 15 de abril de 2026. El JSON conserva esa atribución a la fuente. Para acompañarla visualmente, falta una imagen o un enlace del reconocimiento que Alejo decida publicar.

## 2. Otros dos proyectos

Los espacios `project-02` y `project-03` quedan sin título ni resultados inventados. Hay que elegir los dos casos que mejor acompañen a FoxMind para el objetivo de empleo y clientes.

El CV aporta como candidatos la automatización de una sección de aforo con Arduino, Agrotech y Herbario Digital. También describe experiencia freelance en sitios, catálogos y formularios. Estos antecedentes no sustituyen la selección de un caso concreto.

Para cada proyecto elegido, completar nombre, contexto, problema, participación de Alejo, fecha o período, herramientas, estado, enlace y material visual real. Si un proyecto no tiene interfaz web, pueden utilizarse fotografías, un diagrama propio o documentación del trabajo, identificados de manera clara.

## 3. Identidad oficial de FoxMind

Faltan el logo oficial que se utilizará y la referencia oficial de Foxy. Los intentos de obtenerlos desde los repositorios públicos conocidos y el sitio de FoxMind no permitieron recuperar archivos oficiales. El detalle de los accesos está documentado en `assets/brand/official/README.md`. Las ilustraciones generadas para el campamento no reemplazan estos materiales; se incorporarán los originales cuando se disponga de ellos.

## 4. Perfil y propuesta profesional

Confirmar qué datos del CV siguen vigentes: año de carrera, formación, experiencia actual, nivel de inglés, ubicación y disponibilidad. La graduación de 2028 figura como estimación del CV y debe conservar ese carácter.

La propuesta de servicios es un texto editorial inicial basado en las áreas del CV. Antes de publicarla, definir qué encargos se quieren recibir, qué tipo de oportunidades laborales interesan y qué canal se usará para cada consulta. No se incluyen tarifas, plazos de entrega ni promesas de resultados.

## 5. Enlaces y CV descargable

El correo, LinkedIn, GitHub y el dominio de FoxMind se transcriben del CV. El acceso al sitio de FoxMind no permitió revisar su contenido actual; los resultados se registran en `assets/brand/official/README.md`. La funcionalidad de los otros canales de contacto no se verificó en esta tarea.

El CV original aportado ya está incluido en `content/cv-alejo-palavecino-es.pdf`, y el JSON apunta a esa ruta desde la raíz del paquete. Durante la implementación se deberá conservar ese recurso o ajustar el enlace a la ruta pública elegida. La inclusión del archivo no modifica los pendientes de actualización de sus datos.

El teléfono del CV no se muestra en la ficha de contacto del JSON; el PDF incluido conserva la información original del documento aportado. El contacto principal propuesto en la interfaz es el correo. Esta selección editorial puede cambiarse si Alejo decide mostrar otro canal.

## Cómo completar el JSON

Los valores `null`, las cadenas vacías y los arrays vacíos representan información todavía no provista; no deben aparecer como texto literal en la web. Los campos de verificación indican si un dato fue transcrito del CV o si requiere confirmación actual. Los textos marcados como propuesta editorial pueden ajustarse sin alterar los hechos.

La web debe ocultar los casos sin completar, los botones sin destino y las métricas sin respaldo. El arte puede estar listo antes que estos contenidos; ambos estados se documentan por separado.

## Fuente

CV aportado por Alejo: `CV_Alejo_Palavecino_ES.pdf`, página 1; incluido en el paquete como `content/cv-alejo-palavecino-es.pdf`. Se utilizó para redactar el perfil inicial, las competencias, la trayectoria, la formación y los antecedentes de proyectos. No se realizó verificación externa de los hechos del documento en esta tarea.


Quiero evolucionar mi portfolio hacia una experiencia que se perciba
desde el primer momento como un videojuego de exploración en pixel art,
con mi contenido profesional integrado dentro de ese mundo.

Trabajá sobre el proyecto existente:
https://github.com/AlejoPalavecino/PortfolioPersonal

Versión pública de referencia:
https://alejopalavecino.github.io/PortfolioPersonal/

La revisión que origina este encargo corresponde al commit:
57e2ed8dfaf53ef4da779f7fed28c782ba417404

Si el repositorio avanzó, inspeccioná primero los cambios posteriores.
Conservá las mejoras válidas que ya existan.

Actuá con criterio de diseño de videojuegos, experiencia de usuario,
accesibilidad y desarrollo frontend. Analizá la implementación actual,
definí un plan breve y llevá los cambios hasta una versión revisable.


1. OBJETIVO Y NUEVA DIRECCIÓN

El portfolio debe sentirse como entrar a un pequeño videojuego:
una pantalla inicial con identidad propia, un mundo persistente,
un personaje reconocible, controles comprensibles y transiciones
coherentes entre exploración y lectura.

La finalidad profesional sigue siendo conseguir empleo y atraer
clientes de desarrollo full stack, análisis, automatización e IA.

Esta instrucción reemplaza las decisiones anteriores que exigían:
- Navbar convencional por encima del escenario.
- Hero profesional antes del mapa.
- Distribución vertical que obliga a desplazar la página para jugar.
- Mostrar siempre la isla completa en celular, aunque el personaje
  termine siendo demasiado pequeño.

Se conservan:
- El campamento pixel art con identidad andina.
- El personaje de Alejo y los recursos visuales existentes.
- Los cuatro destinos y su organización relativa.
- La caminata manual.
- Seleccionar una sección, caminar hasta ella y abrir al llegar.
- Las fichas integradas y el contenido profesional.
- El acceso directo al contenido cuando corresponda.

Actualizá la documentación afectada para que esta nueva dirección
quede clara y no conviva con instrucciones contradictorias.


2. DIAGNÓSTICO QUE DEBÉS RESOLVER

Inspeccioná especialmente:
- src/app/shell.ts
- src/app/index.ts
- src/app/load-scene.ts
- src/app/views.ts
- src/app/events.ts
- src/app/controller.ts
- src/app/rendering.ts
- src/app/keyboard.ts
- src/styles/base.css
- src/styles/layout.css
- src/styles/panel.css
- src/styles/responsive.css
- src/core/domain/
- src/shared/

En la versión revisada:
- La estructura monta cabecera, hero y mundo como una composición web.
- Hay alturas mínimas y márgenes que hacen crecer el documento.
- El menú móvil ocupa flujo y empuja el escenario.
- Abrir contenido o iniciar recorridos utiliza scroll de la ventana.
- La escala del personaje depende del ancho del bloque del mundo.
- La carga de terreno y objetos no garantiza que las animaciones
  del personaje estén preparadas.

La solución debe reorganizar arranque, escenario, cámara, controles
y lectura como un conjunto.


3. PANTALLA DE INICIO

Crear una pantalla inicial que ocupe el área visible del navegador
y pertenezca visualmente al mismo mundo que se explorará después.

Reutilizar el paisaje, el campamento y el personaje disponibles.
La composición puede mostrar una vista del campamento con ambiente
sutil, siempre respetando movimiento reducido.

Contenido inicial propuesto:

ALEJO PALAVECINO
Un portfolio para explorar.
Full stack · Análisis · Automatización e IA.

Acción principal:
“Entrar al campamento”.

Acción secundaria:
“Ver portfolio sin recorrer”.

Accesos discretos y claros:
“Contacto” y “CV”.

Evitar repetir mi nombre en varios elementos de esa misma pantalla.
La presentación debe ser breve y legible, sin un bloque extenso
de texto ni un carrusel de mensajes.

Mientras se preparan los recursos, mostrar su estado dentro de esta
pantalla. Cuando estén listos, habilitar la entrada.

Si la carga termina inmediatamente, permitir entrar inmediatamente.
No retirar automáticamente la presentación mientras alguien la lee.
No exigir completar un video, una animación o un tutorial.

En visitas posteriores dentro de la misma sesión, permitir volver
al campamento sin repetir toda la introducción.

Una URL directa a una sección o proyecto debe abrir ese contenido
sin obligar a pasar por la pantalla inicial.


4. CARGA REAL Y RECUPERACIÓN

Definir explícitamente qué recursos necesita la primera experiencia
jugable y cuáles pueden cargarse después.

Antes de declarar listo el campamento, preparar:
- Terreno y objetos necesarios para el primer encuadre.
- Recursos de fondo necesarios para esa presentación.
- Avatar inicial.
- Metadatos y frames necesarios para sus primeros desplazamientos.
- Información de navegación y puntos de interacción.

No esperar al audio, al PDF del CV ni a todas las capturas de proyectos
para habilitar la exploración.

El indicador de carga debe reflejar operaciones reales.
Usar progreso por recursos preparados o un indicador indeterminado
si no existe una medición fiable. No fabricar porcentajes con timers.

Mensajes posibles:
“Preparando el campamento…”
“Listo para explorar”.

Si un recurso crítico falla:
- Explicar el problema de manera breve.
- Permitir reintentar.
- Mantener disponible “Ver portfolio sin recorrer”.
- Evitar una pantalla de carga infinita.

Como umbral inicial de diseño, a los 8 segundos sin completar la
preparación mostrar una alternativa clara para continuar con el
contenido. Esto no debe convertirse en una espera mínima.

La interfaz inicial y el acceso profesional deben poder aparecer
antes de terminar de cargar todos los recursos del juego.


5. ESCENARIO QUE OCUPE LA PANTALLA

Durante exploración, el área visible del navegador es el área de juego.

Crear capas diferenciadas:
- Fondo ambiental.
- Mundo y cámara.
- Personaje y objetos.
- Interfaz superpuesta del juego.
- Paneles de lectura, ayuda y ajustes.

Eliminar la necesidad de hacer scroll de página para encontrar
al personaje, ver controles o alcanzar el campamento.

Adaptar la altura al viewport disponible, incluyendo los cambios
de las barras del navegador móvil y los márgenes seguros del dispositivo.

Eliminar las alturas mínimas rígidas y los márgenes negativos que
actualmente intentan encajar hero y mapa.

El control del desbordamiento debe depender del estado:
- Exploración: sin desplazamiento accidental del documento.
- Lectura: contenido desplazable dentro de su panel.
- Vista directa: contenido profesional completamente accesible.

No recortar texto o controles para conseguir artificialmente
que desaparezca la barra de scroll.

No requerir la API de pantalla completa del navegador.
No bloquear orientación ni zoom del usuario.


6. CÁMARA, ESCALA Y ADAPTACIÓN MÓVIL

Separar:
- Coordenadas lógicas del mundo.
- Escala y desplazamiento de cámara.
- Coordenadas de pantalla.
- Interfaz del juego.

Aplicar una transformación coherente al terreno, los objetos,
el avatar y los puntos de interacción. Conservar las proporciones
y el apoyo de los pies del personaje.

En escritorio:
- Mostrar una vista amplia y equilibrada del campamento.
- Dar presencia al personaje.
- Evitar que la escena quede debajo de contenido de presentación.

En celular:
- Priorizar una escala legible del personaje y los objetos.
- Usar un encuadre más cercano.
- Permitir que la cámara acompañe al personaje dentro de límites.
- Mantener los controles fuera de las zonas importantes del recorrido.

No es obligatorio mostrar las cuatro entradas simultáneamente
en una pantalla estrecha. Los cuatro destinos deben seguir
accesibles desde el menú y tener una orientación comprensible.

La cámara debe:
- Evitar tirones y movimientos innecesarios.
- Conservar un encuadre estable cuando el personaje está quieto.
- Respetar límites del escenario.
- Detenerse durante la lectura.
- Evitar que el personaje quede tapado por la interfaz.
- Adaptarse al cambio de tamaño sin reiniciar la visita.

Al cambiar escala o cámara, actualizar correctamente la conversión
de clics y toques a coordenadas del mundo. El punto pulsado debe
corresponder al suelo que la persona ve.

Mantener los caminos, colisiones y accesos alineados con la
ilustración real.


7. INTERFAZ DE JUEGO

Reemplazar el navbar por una interfaz compacta superpuesta al mundo.

Propuesta funcional:
- Menú del campamento.
- Contacto.
- CV.
- Ayuda y ajustes.

El menú contiene los cuatro destinos, identificados con claridad:
- Taller · Proyectos.
- Carpa · Sobre mí.
- Bitácora · Trayectoria.
- Radio · Contacto.

Diseñar estos controles como parte de la experiencia del campamento:
marcos, iconos y materiales coherentes con el pixel art.

Evitar una barra horizontal idéntica al navbar anterior simplemente
colocada encima del escenario.

Mantener nombres comprensibles, foco visible y áreas cómodas
de interacción. Los iconos solos no deben ocultar la función.

Abrir el menú debe superponer una interfaz estable, sin empujar
el escenario ni cambiar la altura del documento.

La descarga del CV debe ser inmediata.
Contacto debe ser fácil de encontrar.
No exigir visitar otros lugares ni completar acciones para acceder
a información profesional.

Si se muestran destinos visitados, sus indicadores no deben cambiar
el tamaño de los botones ni provocar saltos de composición.


8. PRIMEROS SEGUNDOS Y CÓMO JUGAR

Al entrar:
- Mostrar al personaje en una posición clara.
- Presentar un encuadre que permita entender el entorno.
- Mostrar una instrucción breve adaptada al dispositivo.
- Permitir interactuar en cuanto la escena esté lista.

Escritorio:
“Elegí un destino para caminar. También podés explorar con WASD
o las flechas”.

Celular:
“Tocá un destino para caminar hasta él. También podés tocar
un punto del camino”.

En exploración manual, al acercarse a una entrada:
“E / Enter para abrir”.

La ayuda debe:
- Estar visible en la primera entrada.
- Poder descartarse.
- Poder recuperarse desde “Cómo jugar”.
- No tapar al personaje ni al destino.
- Reducirse después de una interacción significativa.

No crear un tutorial obligatorio de varias pantallas.

Al entrar mediante teclado, entregar el foco a un punto claro
desde el que se pueda explorar. Tab debe permitir salir hacia
los controles de la interfaz.

Las teclas del juego actúan únicamente en el contexto de exploración.
No interceptar flechas, espacio o Enter mientras se lee, se utiliza
un menú o se edita un campo.

En móvil, mantener toque sobre destinos y suelo transitable.
No agregar un joystick virtual por defecto.


9. RECORRIDOS Y RESPUESTA VISUAL

Al seleccionar una sección desde un objeto, cartel o menú:
1. Señalar el destino elegido.
2. Iniciar el recorrido desde la posición actual.
3. Acompañar el desplazamiento con la cámara cuando sea necesario.
4. Detener al personaje en una entrada coherente.
5. Abrir el contenido una sola vez al llegar.

Durante el recorrido mostrar de forma compacta:
“Yendo a Proyectos…”
“Abrir ahora”
“Cancelar recorrido”.

Mantener estas reglas:
- La última selección reemplaza la anterior.
- No acumular una cola de destinos.
- La caminata manual puede interrumpir la automática.
- Abrir ahora abre únicamente el destino vigente.
- Cancelar conserva la posición alcanzada por el personaje
  y devuelve un contexto útil de vista, cámara y foco.
- Una llegada antigua nunca abre un contenido abandonado.
- Si el personaje ya está en la entrada, abrir sin recorrido artificial.

Ajustar distancias y velocidad para recorridos breves.
Usar 1–2 segundos como objetivo inicial para los desplazamientos
habituales, comprobándolo sobre la escena real.

La duración no debe depender de un temporizador que abra contenido
antes de que el personaje llegue.

Abrir un menú durante una ruta debe pausar la exploración de manera
coherente. Elegir otro destino reemplaza la intención anterior.
Una ruta pausada debe ofrecer una reanudación explícita.

Al ocultar la pestaña, pausar movimiento y audio. No ejecutar
movimientos retenidos ni completar una navegación inesperada
al regresar.


10. FICHAS COMO INTERFACES DEL MUNDO

Conservar los proyectos y secciones como contenido HTML legible,
integrado visualmente mediante cuadernos, fichas o paneles del juego.

En escritorio:
- Conservar contexto del campamento alrededor cuando haya espacio.
- Priorizar una lectura cómoda.

En móvil:
- Usar casi toda el área disponible para el contenido.
- Mantener el título y el control de regreso accesibles.
- Desplazar el contenido dentro del panel.

Abrir una ficha no debe desplazar la ventana hasta otra zona
de la página.

Mantener separados:
- Posición del personaje.
- Cámara.
- Vista abierta.
- Desplazamiento de lectura.
- Foco de origen.

Al cerrar una ficha, recuperar el contexto de exploración.
Al volver de un proyecto a la lista, conservar su posición de lectura.

Personaje y cámara permanecen quietos mientras se lee.

Conservar enlaces directos y navegación Atrás/Adelante.
El historial representa vistas, no cada paso del personaje.

Utilizar semántica accesible acorde al comportamiento real de cada
panel. Si se implementa un diálogo modal, gestionar su foco,
su cierre y el fondo inactivo correctamente.

Los textos largos deben mantener una tipografía cómoda.
Reservar el tratamiento pixel art más marcado para títulos,
marcos y controles.


11. PULIDO DEL JUEGO

Priorizar estas mejoras perceptibles:
- Apoyo estable del personaje sobre el suelo.
- Animación consistente con dirección y desplazamiento.
- Transiciones claras entre quieto, caminando y llegada.
- Profundidad correcta al pasar delante o detrás de objetos.
- Respuesta visible al señalar y seleccionar un destino.
- Controles que respondan sin saltos de composición.
- Transiciones breves y coherentes entre inicio, mundo y fichas.

Como referencia inicial, usar transiciones de aproximadamente
200–350 ms cuando aporten continuidad. Omitirlas o reducirlas
con movimiento reducido.

Incorporar ambiente moderado si los recursos lo permiten:
fuego, agua o vegetación. Debe acompañar la escena y permitir
que el personaje y los destinos sigan siendo el centro de atención.

Mantener el sonido apagado inicialmente.
Su activación debe ser explícita.
El juego debe entenderse completamente sin audio.

Preparar las imágenes de animación antes de necesitarlas.
Evitar solicitudes de recursos imprescindibles disparadas
por primera vez durante una caminata.

Separar las actualizaciones visuales por frame de las actualizaciones
de texto, botones y avisos accesibles.
Actualizar el HUD cuando cambia el estado.
No reescribir un anuncio accesible en cada frame de movimiento.

Medir la fluidez en los entornos de prueba disponibles y reportar
las limitaciones concretas. No afirmar un rendimiento que no
se haya medido.


12. ACCESO DIRECTO Y MOVIMIENTO REDUCIDO

“Ver portfolio sin recorrer” abre el contenido profesional mediante
una interfaz clara, sin exigir caminata.

Debe permitir acceder a:
- Proyectos.
- Sobre mí y servicios.
- Trayectoria.
- Contacto.
- CV.

El contenido debe provenir de las mismas fuentes que las fichas
del juego para evitar versiones diferentes de mi información.

Respetar la preferencia del sistema de movimiento reducido
y ofrecer un ajuste dentro de la experiencia.

Con movimiento reducido:
- Abrir destinos directamente.
- Detener desplazamientos y ambiente continuo.
- Evitar movimientos de cámara decorativos.
- Mantener todas las funciones profesionales.

Conservar una alternativa útil si la escena falla.
El fallo de un recurso gráfico no debe impedir conocer mis proyectos
o encontrar mi contacto.

Escape debe respetar el contexto activo y resolver una sola acción.
Evitar que una pulsación cierre un menú, cancele una ruta y además
abandone una ficha.


13. CONTENIDO PROFESIONAL Y ALCANCE

Conservar los hechos confirmados:

FoxMind:
- Plataforma educativa con IA.
- Previo a pruebas piloto.
- Soy cofundador y responsable del desarrollo hasta la etapa actual,
  incluida la integración de IA.
- Presentar descripción general, rol, aporte, estado y capturas
  seleccionadas.
- Respetar el alcance público limitado del proyecto.

Flower:
- Sistema de stock y facturación para una librería.
- Desarrollo integral individual.
- React + Node.js + PostgreSQL.
- En producción.
- La conexión con ARCA automatiza la facturación de las ventas.

Corregir cualquier texto que afirme que ARCA “automatiza las ventas”.

Mantener una presentación comprensible de mis servicios:
software a medida, análisis funcional, integraciones,
automatización e IA aplicada.

No inventar métricas, testimonios, cargos, disponibilidad,
capturas ni resultados.

Mantener identificados los contenidos de revisión hasta contar
con material real y revisión editorial.

La exploración puede ser entretenida, pero la información profesional
no debe quedar bloqueada por misiones, logros, puntuaciones,
coleccionables ni visitas obligatorias.


14. IMPLEMENTACIÓN Y MANTENIMIENTO

Priorizar la reutilización de TypeScript, Vite, los assets existentes
y la lógica de navegación que ya funciona.

Introducir un motor de juegos únicamente si resuelve una limitación
concreta y su costo está justificado. La calidad debe surgir de la
composición, el control, la cámara y la continuidad de la experiencia.

Separar responsabilidades de:
- Estado general de la aplicación.
- Carga de recursos.
- Mundo y navegación.
- Cámara.
- Entrada del usuario.
- Interfaz del juego.
- Lectura del contenido.

Podés adaptar esta organización a la arquitectura del repositorio.
Evitar concentrar todo el comportamiento en un componente o archivo.

Preservar:
- Identificadores de ruta y protección contra llegadas antiguas.
- Enlaces directos.
- Recuperación del foco.
- Descarga del CV.
- Contenido accesible.
- Funcionamiento bajo la subruta /PortfolioPersonal/.

Usar la resolución de recursos existente mediante assetUrl
o una solución equivalente compatible con la base de Vite.
Comprobar el loader, los sprites y las descargas en la subruta real.

Trabajar en una rama de revisión. Cada push a main publica el sitio;
la nueva experiencia debe pasar por el flujo de revisión y publicación
autorizado para este proyecto.


15. CRITERIOS DE ACEPTACIÓN

La entrega debe demostrar:

A. La primera pantalla comunica una experiencia explorable y presenta
   quién soy y a qué me dedico.

B. Entrar lleva a un campamento jugable sin scroll de documento
   para encontrar personaje o controles.

C. El personaje se reconoce y su recorrido puede seguirse en celular.

D. Abrir el menú no empuja el escenario ni cambia su altura.

E. Los cuatro destinos son accesibles aunque alguno quede fuera
   del encuadre de cámara.

F. Seleccionar → caminar → llegar → abrir funciona y se entiende.

G. Abrir ahora, cancelar, sustituir destino y pausar no producen
   aperturas tardías ni pérdida de contexto.

H. Las fichas largas se pueden leer completas y volver al juego
   recupera posición, cámara y foco.

I. Contacto y CV son fáciles de encontrar durante toda la experiencia.

J. Carga rápida, caché, carga lenta y error tienen estados coherentes,
   sin esperas artificiales ni bloqueos permanentes.

K. Movimiento reducido y lectura directa permiten acceder a todo
   el contenido profesional.

L. Enlaces directos, recarga y Atrás/Adelante mantienen una vista
   coherente sin repetir innecesariamente la introducción.

M. La aplicación funciona con la subruta publicada.

Revisar composición en:
- 1366 × 768.
- 1280 × 720.
- 390 × 844.
- 360 × 640.
- 320 × 568.
- Una pantalla móvil en horizontal.

Comprobar también ampliación de texto y navegación por teclado.

Ejecutar el recorrido funcional completo al menos en escritorio
y móvil emulado. Si no hay un teléfono físico disponible, indicarlo
como pendiente en lugar de darlo por comprobado.

Añadir pruebas dirigidas a los riesgos nuevos:
carga y recuperación, transformación de coordenadas,
transiciones entre estados, foco, historial e interrupciones.

Ejecutar las pruebas existentes, lint y build.
Una compilación correcta no sustituye la revisión visual.


16. ENTREGA ESPERADA

Entregar:
1. Resumen de los cambios y las decisiones tomadas.
2. Referencia al commit y una preview revisable.
3. Capturas de inicio, exploración, recorrido y ficha en escritorio
   y móvil.
4. Un registro breve del flujo:
   inicio → entrar → elegir destino → caminar → leer → volver.
5. Resultado de las comprobaciones automáticas.
6. Criterios comprobados, parciales y pendientes.
7. Documentación actualizada de la nueva estructura.

La entrega debe permitir evaluar una experiencia completa y coherente,
desde la primera entrada hasta el regreso de una ficha al campamento.
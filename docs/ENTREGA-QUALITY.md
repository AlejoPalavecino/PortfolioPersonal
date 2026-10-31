# Revisión de calidad 0.3.0-review.1

> Integración posterior autorizada: Alejo solicitó integrar esta versión en `main`, hacer push y eliminar la rama de revisión. Se conserva la entrega siguiente como registro del estado previo a esa autorización. La versión se integra mediante fast-forward; la rama `codex/portfolio-quality` se elimina y el workflow de Pages publica desde `main`. Los pendientes editoriales y límites de pruebas siguen vigentes.

Iteración local del 31 de octubre de 2026, sobre `2ec496ef7cb5e003dbae5f5ecade7f6e14a8a15a`. Al comenzar, `main` y `origin/main` coincidían con la referencia auditada y el árbol estaba limpio: no existían correcciones posteriores para conservar. Esta entrega usa `codex/portfolio-quality`; no altera Pages ni amplía el alcance público de FoxMind.

## Abrir y revisar

```sh
npm ci
npm run dev
```

Para comprobar la subruta de publicación:

```sh
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/ --port 4181
```

Preview navegable activa: http://127.0.0.1:4181/PortfolioPersonal/ mientras el servidor permanezca ejecutándose. El encargo original está archivado en [brief](briefs/2026-10-31-quality.md); las decisiones en [plan](PLAN-QUALITY.md), [geometría](ASSETS-QUALITY.md), [credenciales](CREDENTIALS.md) y [producción artística](ART-QUALITY.md).

También se generó `artifacts/portfolio-quality-0.3.0-review.1.zip` (4.671.636 bytes), ignorado por Git: contiene `PortfolioPersonal/` y un README para servirlo con HTTP. Es la misma build comprobada, no una publicación.

## Hallazgos y cambios materiales

| Grupo | Implementación |
| --- | --- |
| Profundidad y selección | Cuatro contratos explícitos; huellas y selección poligonales; entradas fuera de muebles; imágenes decorativas no capturan clics; selección por coordenadas del mundo. Profundidad normal por pies y silueta localizada en pasos posteriores. |
| Navegación | Regreso explícito cancela el destino y limpia hash aun si la vista lógica ya era campamento; cancelación y ayuda recuperan foco visible. |
| Ayuda | Tutorial descartable separado de la instrucción de proximidad; menú conserva los cuatro destinos. |
| Movimiento | Preferencia efectiva sistema OR control interno; aplicada al dominio, cámara, CSS y animaciones Web Animations; activarla cancela animaciones en curso. |
| Adaptación | Introducción sin desborde horizontal a 320; cabecera compacta por altura en horizontal y una zona principal de lectura; títulos completos. |
| Contraste | Texto blanco del CTA y entrada sobre #a93529: 6,51:1; hover/foco #81281f: 9,31:1. El umbral normal es [4,5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). |
| Paisaje | Terraza asentada en ladera, llegada desde borde y drenaje continuo, compartiendo cámara. Construcciones separadas, sin superponer `camp-foreground` como máscara incorrecta. |
| Señales | Madera en tablillas de taller/radio, placa de mesa y poste de carpa; texto HTML, estados sin cambios de anclaje. |
| Ventanas | Tablero de proyectos, ficha de perfil, Bitácora y radio compacta; región no modal con HUD activo; abrir/cambiar/cerrar a 200 ms y 8 px; tokens invalidan cierres antiguos. |
| Preparación | Viñeta ligera de avatar/farol, estática con movimiento reducido; progreso de 28 operaciones reales, entrada sin espera mínima, acceso directo, demora, fallo y reintento. |
| Credenciales | Modelo con tipo, emisor, fecha/precisión, receptor, evidencia, verificación, texto alternativo y estado editorial; colección y documentos con rutas propias, agrupación sin filtros vacíos. |
| Fidelidad | Flower y FoxMind mantienen los hechos autorizados; exportar gráficos ya no reemplaza el CV. |

## Evidencia y comprobaciones

La reproducción previa usó el renderer real con posiciones inyectadas: desaparición completa en taller `(575,245)`, `(730,242)` y mesa `(360,414)`; parcial en `(560,240)` y `(345,400)`. El clic real en `(500,260)` inició Proyectos. Las capturas de antes se conservan en `evidence/quality/before/`.

Después, los tres puntos del taller son pasos posteriores con silueta visible; los dos de mesa son sólidos y el movimiento legítimo ya no entra. La inyección forzada de posiciones se utiliza solo para observar renderizado: no demuestra por sí sola una caminata válida. Los puntos sólidos nuevos `(650,300)`, `(345,435)` y `(765,395)` están cubiertos por pruebas. Las cuatro entradas y sus 16 combinaciones de conexión son transitables.

Comprobaciones automatizadas: **66/66 pruebas** (10 suites), ESLint con fronteras y compilación TypeScript/Vite correctos. Hubo RED previo para las API de geometría, movimiento efectivo, hash de regreso y exclusión editorial; las tres nuevas muestras sólidas se añadieron cuando el ajuste ya estaba en GREEN, sin declarar RED para ellas. Las regresiones de credenciales incluyen URLs inseguras, restauración y descarte de llegadas antiguas.

### Navegador: ego(lite), Space quality-portfolio-20261031

| Prueba | Resultado y alcance |
| --- | --- |
| Cinco puntos auditados | Capturas antes/después observadas. Taller conserva silueta, mesa bloquea posiciones. Silueta tenue pero reconocible en 575,245. |
| Suelo 500,260 | Clic real anuncia «Caminando…», sin seleccionar Proyectos. |
| Cuatro destinos | Rutas reales desde menú llegan a sus nuevas entradas y abren sección/hash correctos. |
| Aproximaciones | 14 muestras transitables (4 taller, 3 carpa, 4 mesa, 3 radio); `moveSafely` hacia sólido no entra en huella. Se observaron capturas representativas por destino. No se encontró candidato transitable en la muestra posterior de carpa ni frontal de radio; no se afirma imposibilidad global. Harness, no barrido manual continuo. |
| Intro 320×568 | Documento 320/320 e intro 305/305: sin scroll horizontal ni recorte; scroll vertical para contenido completo. |
| Flower / cuatro tamaños | 1366×768, 390×844, 320×568, 844×390 sin desborde horizontal. En horizontal cabecera 60/60, overflow visible; cuerpo 230/680 y una zona principal de scroll. |
| Regreso durante ruta | Proyectos → Contacto → menú → Home: hash vacío, ruta cancelada, mundo no inerte; recarga mantiene campamento. Foco vuelve a marca visible. |
| Foco y teclado | Cancelar enfoca mundo; cerrar ayuda enfoca Cómo jugar. ArrowLeft mueve con foco de mundo. Título de panel no parece input. No se certifica una auditoría exhaustiva con lector de pantalla. |
| Tutorial/proximidad | Tutorial cerrado y aviso «Cerca de Proyectos. E / Enter para abrir» visible en entrada; posición por harness. |
| Motion | Sistema y control interno por separado y ambos activos: cero animaciones activas, CSS animation none/transition 0s. Ambas activas muestran «Movimiento reducido: sistema y preferencia». Cancelación de animaciones activas y etiqueta de sistema integradas. Preferencia interna por montaje, no persistente tras recarga. |
| Transiciones | Cierre inmediato y cambios Proyectos→Contacto→Home no dejan panel resucitado ni foco en contenido inerte. Mundo disponible al comenzar salida; cámara espera ocultación. |
| Lectura/restauración | Lista→Flower→lista conserva scroll 206,4, botón Flower, posición 510,350 y cámara 329,4,-65,7,1,08. |
| Reconocimientos | Deep-link de borrador normaliza a colección sin filtrar el registro; Atrás/Adelante actualiza URL y título entre Recorrido y colección. |
| Carga rápida/fallida | 28 operaciones reales listas; bloqueo CDP de camp-hillside produce fallo, consulta directa y reintento; desbloquear recupera Listo y foco en botón directo. |
| Carga lenta | Latencia CDP 9000 ms, caché desactivada: aviso de demora en 1/28; consulta directa abre Proyectos y enfoca título. La finalización tardía no se completó en la ventana de prueba y la navegación siguiente la canceló: no se declara comprobada esa última conservación de foco. |
| Preview de producción | `/PortfolioPersonal/` carga campamento y enlace Flower; sin imágenes rotas detectadas y URL del CV con base correcta. |

Capturas representativas: [campamento escritorio](evidence/quality/after-prod-world-1366x768.png), [lectura móvil](evidence/quality/after-prod-mobile-390x844.png), [intro 320](evidence/quality/after-intro-320x568.png), [Flower horizontal](evidence/quality/after-flower-844x390.png), [Contacto](evidence/quality/after-contact-1366x768.png). El resto de muestras está en `evidence/quality/`. No se declara certificación de accesibilidad ni rendimiento por una compilación correcta.

## Material pendiente de Alejo

- Capturas reales seleccionadas/autorizadas de Flower y FoxMind; no se inventaron métricas ni evidencia visual. Los casos conservan su aviso de revisión. Para cierre editorial se puede publicar solo el caso completo.
- CV definitivo y confirmación de canales/contacto. El PDF vigente no se modificó; su importación futura es explícita e independiente de los gráficos.
- Originales, fechas con precisión disponible y atribución exacta de ILAN/FoxMind, Egg y UCM. Están modelados como borradores y excluidos de colección/detalles publicados; no se agregaron menciones ficticias ni diplomas regenerados.

## Límites

No hay teléfono físico disponible para esta ejecución. Las pruebas en Chromium emulado no equivalen a dispositivos reales ni a todos los navegadores. Los documentos publicados no pueden comprobarse visualmente contra originales aún no aportados; el circuito está preparado, sin presentar un documento de ejemplo como credencial real. La mezcla de audio y una medición estable de FPS no forman parte de la evidencia obtenida.

La integración y publicación siguen el flujo vigente: commits locales para revisión y autorización explícita antes de push/PR. Este encargo no publica la nueva iteración.

## Unidades locales

| Commit | Unidad y frontera de rollback |
| --- | --- |
| `7a75e63` | Geometría pura, helpers de escena, terreno y exportador/CV independiente; 204 líneas cambiadas. Tests de geometría y evidencia de puntos. |
| `f14417e` | Catálogo editorial y vistas originales preparadas, tipos/restauración y pruebas; 199 líneas cambiadas. No habilita borradores. |
| `ac12a22` | Integración UI/escena/historial/motion/superficies/carga y regresiones; 307 líneas cambiadas. Revertir integración conserva módulos puros/assets. |
| `d65dde6` | Archivo del brief aportado, 376 líneas de fuente del usuario. |

El commit documental de cierre incorpora versiones, contratos, evidencia, backlog y dictamen. Todas las unidades respetan 400 líneas; las capturas y el WebP son binarios. Antes de cada commit se ejecutó Gitleaks staged sin filtraciones. No se agregó ninguna dependencia. El código final coincide, salvo normalización de finales de línea, con el árbol `4827bfaa65715d93fd0e7a93a2955b0afa22dfe7` aprobado por ambos jueces; actualizaciones posteriores solo registran resultados.

# Revisión game-first

## Auditoría temprana de módulos puros y loader

Alcance: brief del 30/10/2026, `src/core/camera`, `src/core/experience`, `src/shared/scene-loader` y sus tres suites. La UI permanece en implementación; su auditoría se difiere hasta el candidato congelado. `docs/PLAN-GAME-FIRST.md` todavía no existía durante esta lectura.

Dictamen de este alcance: `LGTM_SIN_HALLAZGOS`.

- El loader contabiliza 28 operaciones reales: seis imágenes de escenario, navegación, metadatos y veinte frames validados. Exige las cuatro direcciones de reposo y los dieciséis frames de caminata, sin duplicados ni medidas/anclajes inválidos. Audio, CV y capturas quedan fuera de la preparación crítica.
- Fallos críticos pasan a `failed`; los callbacks antiguos y las respuestas posteriores a `dispose` no publican estado. Un reintento inicia una generación nueva. A los ocho segundos se activa la alternativa de carga lenta, sin inventar progreso ni imponer una espera mínima; una preparación tardía todavía puede terminar correctamente.
- Cámara: transformación directa/inversa coherente, límites por eje y centrado cuando sobra viewport. El seguimiento puede bloquearse para lectura o movimiento reducido. El recálculo por tamaño conserva las coordenadas lógicas.
- Experiencia: la primera preparación lista no retira la introducción; entrar requiere preparación lista. Una sesión ya iniciada puede recuperar exploración. Los enlaces directos conservan lectura cuando termina la carga. La generación vigente protege las respuestas de carga.
- Los módulos no dependen de DOM, infraestructura ni UI. El loader utiliza puertos explícitos para metadatos, imágenes y navegación.

Verificación propia: 15/15 pruebas nuevas pasaron y ESLint de esos módulos y suites terminó con código 0. Las 22 pruebas previas no se repitieron en este pase temprano, porque la UI sigue cambiando.

## Límites y comprobaciones para el candidato congelado

Las pruebas del loader usan puertos simulados: no acreditan por sí solas la decodificación de imágenes en el navegador, la resolución bajo `/PortfolioPersonal/` ni la permanencia en caché de los sprites. Se revisará el adaptador real para confirmar que `image` resuelve después de `decode`, que los metadatos alimentan el renderer y que el fallo o la carga lenta mantienen alternativa y reintento accesibles.

La quietud real de cámara/avatar, su conversión de toque, el recálculo al cambiar tamaño y el foco de lectura/enlaces directos dependen de la integración. Este pase tampoco acredita que un overlay pause las rutas, que cerrar una ficha recupere cámara/lectura/foco, ni que el contenido profesional permanezca accesible antes de terminar la carga.

La revisión visual y funcional corresponde al responsable de QA en su Space dedicado. Esta auditoría no abre un segundo navegador, no modifica código ni pruebas, no crea commits y no publica.

## Cierre de la evolución

El candidato integrado fue sometido a revisión dual independiente y dos rondas focalizadas, documentadas en [JUDGMENT-GAME-FIRST.md](JUDGMENT-GAME-FIRST.md). Ambos jueces aprobaron el último delta sin hallazgos pendientes severos. Se corrigieron el menú recortado en horizontal y la restauración del historial desde modo directo. Quedó una recomendación informativa sobre mostrar reintento durante una demora sin fallo, sin bloquear el acceso directo existente.

La suite final tiene40/40 casos y conserva los22 originales. Lint, tipos y build de la subruta se verificaron. Las evidencias visuales/funcionales y los límites de medición se registran en [ENTREGA-GAME-FIRST.md](ENTREGA-GAME-FIRST.md); no se afirman teléfono físico, zoom nativo exhaustivo, FPS garantizados ni pausa real de pestaña comprobada en esta ronda. El control de secretos staged corresponde al coordinador antes de cada commit.

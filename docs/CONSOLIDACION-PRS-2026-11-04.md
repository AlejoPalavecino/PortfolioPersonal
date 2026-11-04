# Consolidación de PRs · 4/11/2026

La PR #2 proponía una presentación lineal de cinco momentos sobre una versión anterior del inicio. La PR #3, ya fusionada, implementó un diálogo voluntario que espera la respuesta del visitante y mantiene la carga real independiente del relato. La PR #4 moderniza esa experiencia y unifica el nombre, el personaje, la burbuja y el acceso al portfolio en una sola composición.

## Resultado de la revisión

- **PR #4:** se conserva como base de la integración definitiva, sin reemplazar mapa, salas ni contenidos profesionales.
- **PR #2:** no se puede fusionar literalmente sin volver a una versión previa y perder el diálogo ramificado. Se rescata su opción de **repetir la introducción** en la PR #4 y se agrega una regresión de foco, diálogo y entrada voluntaria.
- **Accesibilidad y carga:** sonido voluntario, pausa, preferencia de movimiento, botones reales, acceso directo, loader de progreso real, fallo y reintento se mantienen.
- **Evidencia visual:** los controles de CI prueban funcionalidad y compilación, pero no sustituyen una revisión de la composición pixel a pixel en navegador y teléfono físico.

La publicación definitiva se realiza únicamente desde main a través del workflow de GitHub Pages. Las PRs antiguas se conservan como registro de decisiones; los refs de sus ramas se pueden eliminar por separado sin alterar el código publicado.

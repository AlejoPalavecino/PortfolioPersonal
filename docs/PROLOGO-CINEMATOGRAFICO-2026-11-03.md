# Prólogo cinematográfico del portfolio — revisión

## Objetivo

Transformar la pantalla inicial en una presentación narrativa sobria que conecte identidad, enfoque profesional y una entrada voluntaria al mundo interactivo. Reutiliza pixel art, fondos y animaciones actuales sin incorporar un motor ni recursos pesados nuevos.

## Guion (7,8 segundos; independiente de la descarga)

1. El punto de partida (0–1,2 s): «Las ideas necesitan un camino».
2. El proceso (1,2–3,3 s): Alejo camina y explica su enfoque de análisis.
3. Quién soy (3,3–5,1 s): desarrollador Full Stack y estudiante de Sistemas en UTN.
4. Lo que construyo (5,1–6,7 s): análisis funcional, desarrollo y tecnologías de IA.
5. Invitación (6,7–7,8 s): «Te invito a recorrer mi trabajo». La secuencia termina en pantalla estable y NO entra automáticamente.

El visitante puede pausar, omitir o repetir. Omitir termina la secuencia sin entrar al mundo. La entrada requiere una acción explícita y que los recursos realmente estén listos; ver proyectos, CV y contacto no requiere jugar ni completar la carga.

## Dirección visual

Paisaje con acercamiento de cámara mínimo y parallax atmosférico; panel narrativo editorial en Lexend; identidad profesional y acciones sobre fondo oscuro con contraste; acentos cálidos moderados, sin emojis ni porcentajes simulados. El progreso narrativo no pretende medir descargas; el indicador del loader conserva sus 28 tareas reales.

La transición de «Entrar al portfolio» es un fundido de 420 ms, que termina con el foco sobre el mundo jugable. La reducción de movimiento mantiene el último fotograma sin animaciones y entra inmediatamente.

## QA

Checks remotos: npm test, npm run lint y npm run build -- --base=/PortfolioPersonal/.

Inspección visual pendiente: 1440×900, 1366×768, 390×844, 320×568 y 844×390. Verificar pantalla inicial, la historia completa, reproducir/pausar/omitir, carga rápida/lenta/fallida, entrada voluntaria, acceso directo, botón de contacto/CV, foco al entrar y movimiento reducido. Revisar además contraste en teléfonos físicos antes de aprobar un merge.

La rama permanece separada de main para permitir revisión sin alterar la versión publicada.

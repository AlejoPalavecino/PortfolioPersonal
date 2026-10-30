# Auditoría de revisión local 0.1.0

Revisión de fuentes y contratos del Dossier 1.0, realizada el 29/10/2026. Esta auditoría no acredita publicación ni sustituye las evidencias de navegador.

## Evidencia comprobada

- Dominio independiente del DOM y de infraestructura; consumo de otros módulos mediante sus barriles públicos. La proyección editorial de `src/entities/` omite notas, fuentes, stack y enlaces internos de FoxMind; Flower conserva únicamente los datos confirmados.
- `.env.example` declara correctamente una aplicación estática sin variables ni secretos requeridos. No hay migraciones, esquema de base de datos ni nuevos requisitos para GitHub Environments.
- `npm run build` pasó durante la revisión. Sobre el candidato congelado también pasaron `npx vitest run tests/navigation.test.ts tests/geometry.test.ts --silent` (15/15) y `npx eslint src tests/navigation.test.ts tests/geometry.test.ts`. La ejecución general inicial de test/lint encontró scripts temporales de ego mezclados con suites Vitest. El coordinador debe repetir ambos comandos después de retirar esos temporales.
- Se probó la frontera con un import adversarial por stdin, sin escribir archivos: dominio → app. La configuración inicial no resolvía TypeScript; tras corregir el resolver, ESLint rechazó el import mediante `boundaries/element-types`. Los imports desconocidos también quedan prohibidos.
- El responsable de pruebas confirmó RED inicial por dominio todavía inexistente y RED adicionales de `manual`, `arrived:true` y fallo de escena, seguidos de 15 GREEN. No se observaron cambios del implementador a las pruebas. El repositorio no tiene un commit anterior, por lo que Git no permite demostrar integridad contra una línea base.

## Correcciones revisadas en las fuentes

Se corrigieron la pérdida del identificador en enlaces directos a proyectos, la duplicación inicial del historial, las entradas de historial al cancelar, los cambios de hash, la captura de Enter en botones de la escena, los regresos inmediatos al campamento, Escape de detalle a lista, el contexto de scroll/foco por vista, el foco tras cerrar el menú móvil o repetir la sección activa, el menú dentro del flujo y sus ajustes, la indicación de visitas/proximidad, el aviso de fallo de escena, su reintento y la sincronización del error de reproducción de audio. La escena aísla sus capas de profundidad; el control de movimiento se sincroniza con el sistema y la exploración manual se desactiva cuando no está disponible.

Dictamen sobre las fuentes revisadas: `LGTM_SIN_HALLAZGOS`. No equivale al dictamen global DoD y seguridad que debe cerrar el coordinador con los pasos siguientes.

## Revisión final del delta antes del commit

Se releen `controller`, `keyboard`, `events`, `actions`, `views`, `rendering` y `load-scene`. El teclado mantiene un conjunto de teclas activas, normaliza la diagonal y calcula movimiento por tiempo; libera las teclas al perder foco, ocultar la pestaña o dejar la escena habilitada. Enter/E respeta la autoruta vigente. Las transiciones que no desplazan dejan el avatar en reposo. El enlace para saltar al contenido enfoca la lectura existente sin modificar su hash. No se detectaron defectos nuevos en este delta.

Sobre este candidato, `npx eslint src` y `npm run build` terminaron con código 0. El coordinador informó QA de producción con rutas de 1,19–1,96 s, última selección, apertura/cancelación, historial estable, enlaces directos tras recarga, fallo y reintento, PDF, pausa/reanudación, menú móvil, foco y audio/contacto. Son resultados del responsable de QA; esta auditoría no los repitió en otro navegador. La comprobación final de teclas mantenidas seguía en curso al revisar el delta.

## Cierre pendiente del candidato

El dictamen global requiere la ejecución final de test/lint/build sobre fuentes congeladas, las evidencias funcionales y visuales del responsable de QA, y `gitleaks protect --staged` ejecutado por el coordinador. Esta revisión no ejecutó un segundo navegador ni Gitleaks.

Los módulos finales `views`, `rendering`, `events`, `keyboard` y `load-scene` mantienen las dependencias hacia barriles públicos y preservan los tokens de rutas del dominio. No marcar E2/E3 completas basándose únicamente en esta lectura.

Capturas reales de FoxMind/Flower, revisión editorial final, canales y CV definitivo siguen pendientes de Alejo; son límites de publicación documentados, no defectos de la estructura local. No hubo commit, push ni creación de PR desde esta auditoría.

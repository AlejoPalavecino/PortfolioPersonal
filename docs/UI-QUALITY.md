# Explorar, leer y volver sin perder contexto

La aplicación integra las huellas y selección lógica con el mundo, y las páginas de reconocimientos con la Bitácora. No cambia el stack ni introduce motor, backend o dependencias.

| Responsabilidad | Implementación |
| --- | --- |
| Movimiento efectivo | `bindPreferences`: sistema OR usuario, CSS/WAAPI/cámara/dominio sincronizados; selección interna dura el montaje. |
| Vista e historial | `views.ts`: rutas reconocimientos/documentos, hash de campamento aun si ya es vista actual, scroll/foco por vista, cierre con token. |
| Controles | Foco visible tras cancelar/ayuda, bienvenida separada de proximidad, mundo inerte durante lectura. |
| Adaptación | Intro320 sin desborde, ficha horizontal con cabecera compacta, encuadre desktop cover y móvil1.08. |
| Superficies | Región no modal con HUD activo; variantes por función, transiciones200ms/8px, Contacto ajustado al contenido. |
| Carga | Viñeta avatar/farol CSS independiente del mundo; 28 operaciones reales incluyen el terreno de ladera. |

Verificación: 66/66 pruebas, ESLint y build `/PortfolioPersonal/` correctos. QA de Chromium en cuatro tamaños y revisión de dos jueces; [entrega](ENTREGA-QUALITY.md) contiene capturas, matriz y límites. Durante la salida200ms el panel es inerte y el mundo ya admite exploración; la cámara queda bloqueada hasta ocultarlo. Rollback de esta unidad: revertir sus módulos de aplicación/estilos e integración, conservando catálogos puros y assets preparados.

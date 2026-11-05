# Campamento de un creador

Implementación de la [issue #10](https://github.com/AlejoPalavecino/PortfolioPersonal/issues/10), agrupada en la [PR #11](https://github.com/AlejoPalavecino/PortfolioPersonal/pull/11). La rama parte de la versión publicada por la PR #9.

| Lugar | Interacción |
| --- | --- |
| Taller | Dos planos abren los dossiers de FoxMind y Flower. Volver recupera el foco en el plano y el desplazamiento de la lista. |
| Carpa | El cuaderno tiene tres páginas que se pueden cambiar con clic, flechas, Inicio y Fin. |
| Trayectoria | La bitácora abre un hito a la vez y enlaza los casos correspondientes. La colección muestra su estado editorial actual. |
| Radio | Dos motivos preparan el asunto del correo. La copia se confirma tras la respuesta del portapapeles y ofrece una alternativa manual. |

Los enlaces directos, el historial y la navegación rápida siguen disponibles. El cargador trae una ilustración por sala y por variante. Si tarda más de ocho segundos, permite leer y reintentar. Los fondos y las superficies de lectura usan Lexend, contrastes definidos y una cabecera compacta. La misma familia se aplica a las señales exteriores.

## Escena y arte

Los sprites exteriores conservan sus dimensiones y el taller usa su soporte de madera para el nombre. El catálogo concentra ubicación, tamaño, anclaje del cartel, umbral y profundidad. Las áreas sólidas, interactivas y de oclusión siguen siendo independientes. Se recalibró el poste de Sobre mí y se conservan las entradas. Las poses de umbral comparten el juego de sprites exterior.

Ejecutar `npm run dev` y abrir la URL de desarrollo con `?calibrate` muestra el perímetro, sólidos, interacciones, oclusión, rutas y pies. Los campos de posición del cartel y de entrada generan un borrador exportable. Incorporar las coordenadas al catálogo y correr la regresión de rutas para probar una calibración nueva. La compilación de producción elimina el módulo de calibración.

Las ocho composiciones se guardan en `public/assets/camp-rooms-v2/`. Cada sala tiene un WebP de escritorio de 1536×1024 y un retrato recompuesto de 1024×1536. La [procedencia y los prompts](CAMP-ART-V2.md) acompañan los recursos. Cada imagen pesa entre 404 y 651 KB y se carga cuando hace falta.

## Validación

- 130 pruebas en 23 archivos. Incluyen geometría, rutas, interacción de las salas, conservación de foco y lectura, fallo de portapapeles y variantes de fondo.
- Lint, compilación con base de GitHub Pages y revisión de espacios del diff aprobados.
- Revisión en navegador durante el desarrollo con escritorio 1363×936 y encuadres de 390×844, 320×568 y 844×390. Se recorrieron el taller, el cuaderno, la bitácora y la radio. En la versión recuperada se volvió a comprobar el taller, su dossier y el retorno de foco al plano.
- El prototipo en 390×844 mostró carteles de aproximadamente 45 px efectivos de alto y accesos inferiores de 44 px. El encuadre de Contacto muestra su acción de correo dentro de la primera pantalla.
- Quedan pendientes la validación táctil en teléfono físico, la medición comparativa de cuadros por segundo y la mezcla audible en dispositivos reales. Los estados de sonido y movimiento reducido se revisaron en navegador y las pruebas de audio existentes se mantienen.

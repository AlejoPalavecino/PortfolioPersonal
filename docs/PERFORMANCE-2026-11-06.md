# Optimización de la primera visita — 06/11/2026

## Síntoma y diagnóstico

Tras migrar al dominio propio, el navegador necesita descargar de nuevo recursos que habían quedado en caché bajo el origen anterior. El cargador anterior también exigía 28 operaciones (seis imágenes del mundo, 20 sprites, metadatos y validación de rutas) y la interfaz imponía seis segundos de animación **después** de terminar la preparación, más 900 ms de salida.

Esto era una fuente de demora reproducible leyendo el código; **no** se presenta como una medición Web Vitals de un dispositivo físico.

## Comportamiento nuevo

- El loader desbloquea la exploración tras cinco operaciones: validación ligera de posiciones, metadatos de sprites, fondo, terreno y sprite de reposo.
- La carga posterior incluye cuatro objetos del mundo y los 19 sprites restantes en una cola de dos operaciones simultáneas. Se programa 900 ms después de terminar la carga inicial para evitar competir con la primera vista.
- Los errores de carga diferida no bloquean ni deshabilitan el campamento; los recursos críticos sí conservan fallback y reintento.
- La presentación de Alejo sigue siendo animada y opcional. El visitante puede pulsar «Omitir presentación» incluso mientras la escena se prepara; si es necesario, entra automáticamente al estar lista. «Ver proyectos sin esperar» abre la lectura sin cargar el juego.
- Las acciones normales se habilitan en cuanto los recursos esenciales están listos. La transición de salida dura 320 ms con movimiento normal y es inmediata con movimiento reducido.
- Ya no se intenta activar sonido en el montaje. El archivo de ambiente de ~2,1 MB declara `preload='none'` y solo comienza a descargarse al activar audio expresamente.
- El chequeo completo de caminos se mantiene en pruebas; el runtime comprueba inicialmente solo puntos transitables y calcula cada ruta cuando se selecciona.

## Validación

- `npm test` cubre la preparación esencial, reintentos, fallas críticas, fallos diferidos, suscripciones antiguas, salida voluntaria y controles de carga.
- `npm run lint` y `npm run build -- --base=/` conservan las restricciones de arquitectura y la configuración de alejopalavecino.com.ar.
- `node tools/check-public-safety.mjs` revisa metadatos SEO y datos sensibles después del build.
- Realizar una prueba manual con caché fría, modo móvil y red lenta, comparando antes/después con DevTools Network y Performance. Observar solicitudes de sonido, Largest Contentful Paint y el tiempo hasta poder entrar. No inventar una mejora cuantificada en milisegundos sin esa prueba.

## No modificado

Mapa, escenarios interiores, textos, URL del dominio, tamaño real de los assets, lógica de rutas y seguridad. Los cambios buscan rapidez de acceso sin degradar la estética del juego.

# Mobile first paint — 06/11/2026

## Diagnóstico sustentado por código

`index.html` tenía `<div id="app"></div>` vacío. La primera interfaz dependía de descargar el bundle CSS/JS, evaluarlo y ejecutar `mount()`. Por lo tanto, la espera inicial en un teléfono se veía como una pantalla blanca o negra, incluso antes del cargador animado. Esta relación está verificada en el código; no hay todavía una medición real de tiempo hasta primera pintura, DNS, TTFB o Web Vitals desde ese teléfono.

## Corrección

- `index.html` ahora trae un primer estado visible, de bajo peso y sin imágenes, fuentes externas, JavaScript ni servicios externos.
- Estilos críticos inline, solo para ese estado; se respeta `prefers-reduced-motion` y se evita mostrar porcentajes de descarga inventados.
- En caso de demoras prolongadas hay una alternativa expandible con enlace de reintento y formas de contacto.
- `mount()` reemplaza el primer estado por el juego ya existente. Si el montaje lanza un error síncrono, el fallback vuelve a mostrarse con un mensaje recuperable.
- No se fuerza a cargar Pixelify como recurso prioritario antes del primer dibujo.
- Los edificios reciben prioridad de red baja y carga/decodificación diferida; el terreno usa prioridad alta.
- No se cambia la navegación ni el diseño de las salas, la configuración DNS, el dominio o la publicación de GitHub Pages.

## Limitaciones

El primer HTML no puede aparecer antes de que el navegador reciba la respuesta del servidor, ni evita la espera de una hoja de estilos externa bloqueante. Por ello no se afirma que esta implementación arregle problemas del DNS/TLS o resuelva toda demora móvil.

## QA posterior al deploy

1. Abrir `https://alejopalavecino.com.ar/` desde un teléfono en incógnito y con Wi-Fi/datos móviles: confirmar que ya no existe una pantalla completamente vacía una vez recibido el HTML.
2. Verificar transición desde el estado estático a «Preparando tu aventura», entrada al juego, recorrido, proyectos y selector ES/EN.
3. Simular red lenta y falla de JavaScript para verificar el fallback, enlaces e idioma accesible.
4. Medir TTFB/FCP/LCP con DevTools/Lighthouse en una conexión móvil antes de atribuir el resto de la demora al hosting.

# Pulido del mapa · cinco mejoras (03/11/2026)

Rama: `feat/mapa-pulido-5-mejoras`. Alcance acotado a exploración del campamento; conserva los cuatro destinos, las huellas físicas, puntos de llegada, navegación automática, accesos profesionales y enlaces existentes.

## Cambios

1. **Continuidad del paisaje:** `src/styles/map-atmosphere.css` aporta un grado cromático y profundidad ambiental suave detrás del terreno para disminuir el contraste con las montañas. No modifica la imagen ni los límites jugables; una fusión artística perfecta requeriría editar los originales.
2. **Colisiones naturales:** `moveSafely()` avanza mediante pasos pequeños con comprobación real de segmentos, y cuando una diagonal está bloqueada permite desplazarse por el eje libre. No atraviesa obstáculos, no reduce clearance y no modifica A* ni la posición de llegada. El avatar se orienta según movimiento efectivo al deslizar.
3. **Profundidad:** la silueta detrás del objeto se muestra solamente cuando la textura del POI está disponible y la lógica de profundidad la requiere; la máscara usa alfa real y un tratamiento menos llamativo. No se muestran rectángulos fantasmas durante carga.
4. **Carteles:** conserva la caja de interacción, foco de teclado y anclajes, agrega respuesta lumínica discreta y pequeñas sombras de contacto en los soportes situados sobre el suelo.
5. **Cámara responsive:** conserva zoom de retrato pero reduce el recorte en pantallas móviles de poca altura; limita el movimiento de paralaje del fondo en pantallas pequeñas. Se mantiene la conversión pantalla/mundo y la localización de clics.

## Reproducción

```bash
npm ci
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/
```

El workflow `map-quality.yml` comprueba las mismas puertas técnicas en pull requests (excepto el preview visual). Es una validación de código, no una certificación visual.

## QA visual y de juego pendiente de revisión humana

- **Escritorio:** 1366×768 y 1440×900. Revisar transición terreno/montañas, cartel del taller y superposición del personaje detrás y delante de los cuatro edificios.
- **Móvil:** 390×844, 320×568 y 844×390. Comprobar carteles, cámara, táctil y lectura de interiores, sin scroll de documento involuntario.
- **Movimiento:** mantener diagonal contra bordes del taller, carpa, mesa y radio; confirmar deslizamiento sin atravesar sólidos ni vibración.
- **Accesibilidad:** recorrer con Tab/Enter/Escape; comprobar enfoque de señales, movimiento reducido y acceso sin recorrido.
- **Aspecto real:** revisar capturas y transiciones en navegador, porque los recursos del campamento no han sido redibujados. Probar también Safari/iOS y Android físicos antes de aprobar el arte final.

No se modifica la publicación `main` ni se considera cerrada la auditoría visual hasta contrastar estos casos.

# Reproducir la revisión local

Esta revisión no tiene preview remota. Las direcciones 127.0.0.1 solo funcionan en la computadora donde se ejecuta el servidor.

## Aplicación compilada

Desde la raíz del repositorio, con Node 24 y npm 12:

```powershell
npm ci
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/ --port 4194
```

Abrir `http://127.0.0.1:4194/PortfolioPersonal/`. No abrir el HTML mediante file://. El servidor anterior queda sujeto a la vida del proceso local.

## Recurso crítico retenido y reintento

El servidor de prueba no altera producción, no está incluido en dist y escucha solo en loopback. Iniciarlo en otra terminal:

```powershell
node tools/qa/closure-server.mjs dist 4195
Invoke-RestMethod 'http://127.0.0.1:4195/_qa?mode=hold'
```

1. Abrir `http://127.0.0.1:4195/PortfolioPersonal/` en una pestaña nueva. No entrar al juego: elegir “Ver portfolio sin recorrer”, abrir Flower y bajar por su ficha. Enfocar Conversemos u otro control visible; comprobar scroll mayor que cero.
2. Registrar hash, título, foco/control visible, scroll de `.panel-scroll`, posición, ruta e introducción oculta. El recurso retenido es el JSON real `assets/avatar/frames.json`; no se simula progreso con temporizadores.
3. Liberarlo desde la terminal y esperar `data-load="28/28"`:

```powershell
Invoke-RestMethod 'http://127.0.0.1:4195/_qa?mode=release'
```

4. Confirmar que todos los datos de lectura se mantienen, no aparece intro ni arranca caminata, y la escena queda lista para volver voluntariamente.
5. Repetir en pestaña nueva comenzando con `mode=fail` para obtener HTTP503. Consultar Flower directamente. Antes de pulsar Reintentar escena, cambiar a `mode=hold`; después restaurar scroll y foco visible y liberar. No navegar entre la liberación y las comprobaciones.

El mismo endpoint sin mode informa estado y recursos retenidos. `mode=release` deja el servidor en funcionamiento normal. Cualquier cadena distinta de hold/release/fail se rechaza. El transporte fue comprobado con HTTP real: index200, recurso retenido, liberación con 20 frames, 503 y recuperación200.

## Automatización de navegador

`tools/qa/closure-load.mjs` exporta `runLoadRegression(task, origin)` para ego-browser. Recibe un TaskSpace **autorizado** del ejecutor, no crea ni recupera Spaces por su cuenta. Ejecuta retención→lectura→listo y fallo→reintento→lectura→listo, y compara estado antes/después. El wrapper portable se ejecutó satisfactoriamente al retomar el Space autorizado; la interacción inicial también está preservada en `evidence/closure/browser/late.test.mjs.txt` y `retry.test.mjs.txt`. El wrapper desplaza Flower antes de pulsar su control real cuando queda fuera del viewport bajo; ambos escenarios y todas sus aserciones pasaron en la compilación Bi_GUKpP. El único delta posterior fue el foco de Continuar, ajeno al loader.

Los scripts `.txt` son registros de las rondas ejecutadas y contienen los IDs, puertos y rutas temporales de esa sesión; no deben ejecutarse a ciegas ni recuperar un Space finalizado sin autorización. Para una nueva ejecución se usa un Space propio autorizado y el servidor reproducible anterior.

`tests/closure-loading.test.ts` es una regresión de integración con dobles DOM y controlador: protege que la sesión conserve lectura al llegar ready o retry. Se distingue de la interacción de navegador con recurso real, que también se ejecutó. Las pruebas de preferencias, montaje temprano y cambio del sistema están en los otros tres `closure-*.test.ts`.

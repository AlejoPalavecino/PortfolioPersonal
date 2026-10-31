# Incorporar evidencia original a la Bitácora

La colección vive en `src/entities/credentials.ts` y no publica los tres antecedentes draft. No se agregaron credenciales de muestra a la interfaz.

1. Confirmar título, institución, receptor (persona/equipo/proyecto) y fecha con precisión real.
2. Guardar el original PDF/imagen en `public/assets/credentials/` o usar su URL HTTPS autorizada. No recrear firmas, diplomas ni sellos.
3. Completar evidencia y texto alternativo. Verificación es un enlace opcional a una fuente real, sin inferirla de la imagen.
4. Revisar el original y la atribución; recién entonces cambiar `editorial` a `published`.
5. Ejecutar tests/lint/build y revisar colección, detalle, lectura del original y Atrás/Adelante antes de integrar/publicar.

`publishedCredentials()` exige título, emisor, receptor, descripción, evidencia/alt, URL segura y fecha válida con la precisión declarada. `credentialById()` no expone borradores. Los tipos distinguen formación, certificación profesional, premio y mención. Grupos vacíos no se muestran.

Ruta de colección: `#trayectoria/reconocimientos`. Detalle: `#trayectoria/reconocimientos/<id>`. Los identificadores desconocidos o aún draft se normalizan a colección; el enlace directo no obliga a caminar. En el campamento se llega a la Bitácora y se elige su segunda página.

Pruebas: `tests/quality-credentials.test.ts` comprueba exclusión editorial, rechazo de URLs peligrosas y restauración que invalida rutas anteriores. El visor de originales no se validó con diplomas reales aún no aportados; no confundir un modelo preparado con credenciales verificadas.

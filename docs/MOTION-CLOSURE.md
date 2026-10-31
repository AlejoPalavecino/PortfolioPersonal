# Preferencia manual persistente

`camp:motion:v1` guarda exclusivamente las cadenas `true` o `false`. Un dato ausente/inválido o un error al obtener/usar localStorage produce false y no bloquea la aplicación. Cambiar la preferencia del sistema no escribe esta clave.

El montaje lee una vez, calcula sistema OR manual y aplica los datasets antes de insertar el shell. La sesión recibe ese valor efectivo inicial. El botón actualiza la preferencia manual en memoria aunque falle el almacenamiento; matchMedia sigue respondiendo en vivo y una reducción efectiva cancela las animaciones activas. El sonido conserva su activación explícita independiente.

Verificación: adaptador RED antes de existir; pruebas de lectura/valores, errores, escritura manual, montaje antes de DOM y eventos del sistema. Navegador actual: manual persiste tras recarga con cero animaciones; al desactivar manual con sistema activo se mantiene reducido; al retirar sistema cambia a full. Getter localStorage con SecurityError no impide 28/28 ni exploración. Los valores inválidos se comprobaron en pruebas automatizadas, no se presentan como otra prueba de navegador.

Rollback: adaptador y su integración en index/events/session, junto con los tres tests de preferencias/montaje. La colección editorial, geometría y audio no cambian.

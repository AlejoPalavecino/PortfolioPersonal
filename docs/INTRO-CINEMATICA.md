# Pulido de la bienvenida

## Cambios

- Una familia tipográfica (Lexend) en la bienvenida, incluido el título.
- Fondo regenerado desde el original para eliminar uniones rectangulares; original conservado.
- Fondo y fuego comparten un panorama con la misma escala y encuadre; la llama se ancla al centro del fogón del nuevo arte.
- Dos acciones al finalizar la llegada: explorar el campamento o ir a proyectos. Se retiran preguntas ramificadas, enlaces inferiores y controles de pausa/repetición/omisión.
- Controles SVG de sonido y movimiento, con nombres accesibles y estados actualizados sin sustituir el dibujo por texto.
- Llegada de seis segundos; movimiento reducido muestra el resultado inmediatamente. El tiempo no avanza en pestañas ocultas y continúa al regresar.
- Salida de 900 ms con desaparición de la interfaz, desplazamiento del personaje y aproximación oscurecida del paisaje antes de entregar el control al mundo o los proyectos. Movimiento reducido evita la animación.
- Se solicita audio al montar y se reintenta con una interacción si el navegador bloquea autoplay. El usuario puede apagarlo. Fogata sintetizada con mayor presencia durante el inicio; mezcla del mundo conservada.

## Verificación

102 pruebas aprobadas en 19 archivos. Se sustituyen pruebas de pausa, repetición y respuestas retiradas por pruebas de las dos salidas, su habilitación y la transición diferida. Compilación con base `/PortfolioPersonal/`, lint y `git diff --check` aprobados.

Se inspeccionaron el fondo original y el generado. Pendiente revisión funcional y visual en navegador de esta rama: encuadre móvil, posición final de la llama, escucha de la mezcla y transición real. Las pruebas DOM no acreditan esas comprobaciones. Autoplay con sonido depende de las políticas del navegador y no puede garantizarse sin interacción.

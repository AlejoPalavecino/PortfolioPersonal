# Superficies con un scroll y silueta localizada

La cabecera y el contenido comparten `.panel-scroll`; el header no tiene overflow propio y solo permanece sticky cuando hay espacio suficiente. Flower320 con fallo crítico pasó de header218/283 auto más cuerpo, a header299/299 visible y un cuerpo único488/1379. Se conservan scroll/foco por vista. El fallback al contenedor se comprobó después en navegador: Proyectos278.39999→Contacto→Atrás mantiene scroll y foco visible. La validación retomada también corrigió palabras largas y navegación al200%; ver ACEPTACION-CLOSURE.md.

El farol de carga usa asa, base y luz local CSS; el avatar reutilizado se desplaza1px discretamente. Ambos mantienen caja100×58 y se quedan estáticos con movimiento reducido. No se agregaron bitmaps ni recursos críticos ni espera mínima. El terreno y las huellas se conservan.

La silueta se limita al alfa de cada sprite y comparte anclaje/cámara del mundo; ver [oclusión](OCCLUSION-CLOSURE.md). Los carteles se extraen a un archivo de estilos manteniendo reglas y orden. Las capturas de before/after son de esta sesión.

Rollback: esta unidad de lectura, escena y estilos es independiente de la migración de dependencias y de la persistencia. La aceptación dirigida está registrada en [entrega](ENTREGA-CLOSURE.md); no equivale a certificar cada píxel ni todos los navegadores. Las capturas GREEN200 quedaron bloqueadas por el compositor, con métricas funcionales y scripts disponibles.

# Portfolio · Campamento creativo

Versión de revisión 0.1.0 de Alejo Palavecino, basada en el Dossier 1.0 del 29/10/2026. Incluye la experiencia navegable y las fichas editoriales de trabajo. La publicación y la aprobación final de contenido siguen fuera de esta entrega local.

## Abrir la versión

Requiere Node.js 22.12 o posterior y npm.

```sh
npm ci
npm run dev
```

Abrí la dirección local que imprime Vite. Para comprobar la salida de producción:

```sh
npm test
npm run lint
npm run build
npm run preview
```

## Actualizar

- Textos y casos: `src/entities/`, con selección explícita de contenido público del JSON editorial del handoff. No copiar ese JSON completo a `public/`: contiene fuentes y referencias internas.
- CV de revisión: `public/assets/cv-alejo-palavecino-es.pdf`. Sustituir por el PDF final elegido y comprobar la descarga. El exportador vuelve a copiar el original del dossier.
- Imágenes: maestros en `Portfolio_Campamento_Documentacion_y_Assets_v1/`; derivados en `public/assets/`. Para regenerarlos, instalar Pillow y ejecutar `npm run assets`.
- Geometría y reglas: `src/core/domain/`; pruebas en `tests/`. Los cambios de terreno requieren comprobar el suelo ilustrado además de las pruebas geométricas.
- Presentación: estilos y widgets en `src/`; instrucciones de arquitectura y operación en `docs/`.

## Revisión editorial

FoxMind y Flower son fichas de revisión hasta recibir las capturas reales elegidas y cerrar sus textos. No publicar un caso incompleto. FoxMind conserva solo resumen general, aporte, rol, etapa y capturas autorizadas; no se agregan demo, repositorio, arquitectura ni acceso al producto.

Alejo debe confirmar canales, datos profesionales vigentes y PDF definitivo. Flower ya tiene confirmados el desarrollo integral individual, React, Node.js, PostgreSQL, producción y facturación automática mediante ARCA: esos datos no necesitan nueva consulta.

Consultar `docs/` para evidencias, ajustes materiales y pendientes. El proyecto no requiere variables de entorno, base de datos, claves de API ni servicios externos.

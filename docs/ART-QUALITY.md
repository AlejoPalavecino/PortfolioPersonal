# Terreno asentado en ladera

`public/assets/camp-hillside.webp` reemplaza al terreno usado por la escena y por su preparación real. El original `camp-ground.webp` permanece disponible como referencia. No se incorporó `camp-foreground.webp`: contiene una composición completa y no una máscara de oclusión alineada.

## Contrato de integración

| Propiedad | Valor |
| --- | --- |
| Dimensiones | 1536 × 1024 px; RGBA |
| Mundo | 1000 × 650 unidades, origen 0,0 |
| Anclaje | Esquina superior izquierda, igual que el terreno anterior |
| Escala | 100% del mundo; comparte transformación de cámara |
| Planos | Valle distante independiente; ladera/terraza en el mundo; construcciones y avatar independientes |
| Navegación | Las extensiones de ladera son decorativas; no amplían el polígono caminable |
| Archivo | WebP calidad 90, 496934 bytes |

Las plataformas, escalones y puente se conservaron visualmente en su ubicación. La izquierda conecta con una ladera; el sendero sale por el borde inferior izquierdo y el agua continúa hacia el inferior derecho. No se duplicaron construcciones ni se añadieron capas de niebla. Las huellas definitivas están en `ASSETS-QUALITY.md`.

## Producción y prompt

Recurso generado con la herramienta integrada **image_gen**, modo edición con transparencia, usando `camp-ground.webp` como referencia; después se convirtió el PNG a WebP con Pillow sin recorte ni cambio de tamaño. No se regeneraron documentos, retratos ni logotipos profesionales.

Prompt enviado:

> Use case: precise-object-edit. Asset: pixel art terrain for existing exploration portfolio. Preserve every existing flat sandy playable terrace and its exact shapes/coordinates, all existing rocks, flowers, paths, bridges and waterfall. No buildings or people. Keep same camera angle, warm daylight, pixel-art texture and 3:2 framing. Change ONLY outside the existing terrain: make it clearly a mountain hillside lookout rather than floating island. Extend rocks continuously downward into foreground at bottom and left edge, add a believable narrow arrival footpath connecting the existing bottom-left stairs out of frame toward bottom-left, continue the existing water drainage out of bottom-right into a ravine. The nearest slope should reach the bottom/side edge, do not surround terrain by empty air. Retain transparent sky / upper outside region so distant valley can show behind. No fog, no floating shadow, no text. Existing playable surfaces must remain aligned to original image, not resized or repositioned. Return a single terrain layer.

## CV independiente

`npm run assets` ya no copia el PDF histórico sobre el CV vigente. Para incorporar un PDF editorial aprobado se ejecuta explícitamente `python tools/import_cv.py RUTA_AL_PDF`. El comando valida cabecera PDF e informa SHA-256. Esta iteración no cambia el contenido del CV.

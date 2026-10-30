# Visor local de assets

Descomprimí el kit y abrí `preview/index.html` en un navegador. No requiere
servidor, instalación, conexión a Internet ni publicación.

La galería muestra archivos reales mediante rutas relativas. Permite cambiar
el fondo para revisar transparencia y reproducir secuencias de una hoja de
sprites. La pestaña **Composición** superpone las capas declaradas en el catálogo.
El visor no implementa el portfolio ni modifica los archivos de imagen.

## Regenerar el catálogo

Desde la raíz del kit:

```bash
python3 tools/build_catalog.py
```

El script lee los archivos existentes y escribe `assets-manifest.json`,
`config/world-layout.json` y `preview/catalog.js`. Incorpora PNG, SVG y WAV a
la galería; registra las fuentes en el manifiesto sin tratarlas como imágenes.
Las dos composiciones son referencias para escritorio y celular. Sus
coordenadas no constituyen un mapa navegable ni una configuración de colisiones.
No modifica los archivos fuente. Volver a ejecutarlo reemplaza el catálogo
generado y la propuesta de distribución por sus valores reproducibles.

## Catálogo

El archivo `catalog.js` debe asignar un objeto a `window.CAMP_CATALOG`.
Las rutas de `src` se resuelven desde `preview/index.html`.

```js
window.CAMP_CATALOG = {
  title: "Campamento creativo · Catálogo de assets",
  assets: [
    {
      id: "ground",
      name: "Terreno",
      src: "../assets/world/camp-ground.png",
      category: "Mundo",
      kind: "image",
      wide: true,
      notes: "Capa de terreno."
    },
    {
      id: "avatar",
      name: "Alejo · Caminata",
      src: "../assets/character/avatar-walk.png",
      category: "Personaje",
      kind: "spritesheet",
      fps: 6,
      frames: [
        {name: "down-1", x: 0, y: 0, w: 96, h: 128, anchorX: 48, anchorY: 120},
        {name: "down-2", x: 96, y: 0, w: 96, h: 128, anchorX: 48, anchorY: 120}
      ],
      animations: {walkDown: [0, 1]}
    }
  ],
  scenes: [
    {
      name: "Escritorio",
      width: 1536,
      height: 1024,
      notes: "Prueba de escala con las piezas originales.",
      layers: [
        {asset: "ground", x: 0, y: 0, width: 1536, height: 1024, z: 0},
        {asset: "avatar", frame: "down-1", x: 750, y: 740, width: 72,
         anchorX: 48, anchorY: 120, z: 10}
      ]
    }
  ]
};
```

Los valores del ejemplo son ilustrativos. El catálogo final debe usar las
dimensiones y coordenadas verificadas de los archivos entregados.

### Cuadros y anclajes

`x`, `y`, `w` y `h` son píxeles de la imagen original. `anchorX` y `anchorY`
son coordenadas relativas al recorte del cuadro. Ubicarlos en el punto de apoyo
de los pies evita que las poses cambien artificialmente de posición.

El tamaño de los recortes puede variar. El visor alinea todos los cuadros por
sus anclajes y mantiene un lienzo común calculado para la secuencia.

`animations` relaciona un nombre con índices de `frames` o con sus nombres.
Si no se declara, se reproduce la lista completa. `fps` es la velocidad de
previsualización propuesta; no demuestra que el movimiento esté validado.

Las capas aceptan `x`, `y`, `width`, `height`, `scale`, `opacity`, `z`, `flipX`,
`anchorX`, `anchorY` y `visible`. Para `frame` se puede indicar índice o nombre.
Los anclajes de capa se expresan en píxeles del recorte fuente.

### Audio

Un elemento con `kind: "audio"` presenta un reproductor manual. El audio nunca
se reproduce automáticamente.

## Auditoría de imágenes

Desde la raíz del kit:

```bash
python3 tools/audit_assets.py assets --output qa-assets.json
```

El script requiere Pillow y NumPy. Lee las imágenes, verifica PNG, calcula
dimensiones, SHA-256 y transparencia real, y propone componentes/bandas para
revisar atlas. No cambia los archivos.

Los candidatos de cuadros son una ayuda geométrica: deben compararse con la
imagen antes de utilizarlos. Varias islas alpha pueden pertenecer a un único
personaje; una sombra puede conectar objetos distintos. La coherencia del
arte, el parecido del personaje y la calidad del movimiento requieren revisión
visual adicional.

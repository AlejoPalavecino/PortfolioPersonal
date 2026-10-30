# Fuentes, iconos y audio

Este documento registra los recursos de soporte del kit y su procedencia. Fecha de descarga: 29 de octubre de 2026. Los archivos originales de terceros se conservaron sin cambios.

## Tipografías

| Familia | Uso previsto | Archivo | Peso variable | Procedencia |
| --- | --- | --- | --- | --- |
| Lexend | Párrafos, navegación, botones y fichas de proyectos | `assets/fonts/Lexend-Variable.ttf` | 100–900 | [Google Fonts: Lexend](https://github.com/google/fonts/tree/main/ofl/lexend) |
| Pixelify Sans | Títulos breves y detalles del universo pixel | `assets/fonts/PixelifySans-Variable.ttf` | 400–700 | [Google Fonts: Pixelify Sans](https://github.com/google/fonts/tree/main/ofl/pixelifysans) |

Ambas se distribuyen con sus licencias SIL Open Font License en la misma carpeta. Se incluyen los metadatos oficiales, las URL de origen y hashes SHA-256 en `assets/fonts/sources.json`.

La comprobación de los archivos verificó los caracteres `áéíóúüñÁÉÍÓÚÜÑ¿¡`. El resultado está en `assets/fonts/validation.json`. `assets/fonts/fonts.css` permite servirlas localmente y define `--font-body` y `--font-display`. No depende de peticiones a Google Fonts cuando el portfolio está abierto.

Las fuentes se entregan en TTF, válidas para uso web mediante `@font-face`. No se incluye una conversión WOFF2 ni una variante tipográfica alterada. Mantener los textos del sitio como texto real y reservar Pixelify Sans para contenidos cortos.

## Iconos de interfaz

Los 14 archivos SVG de `assets/icons/` proceden directamente del [repositorio oficial de Lucide](https://github.com/lucide-icons/lucide/tree/main/icons). Se conservaron sus dimensiones y geometría originales (`viewBox="0 0 24 24"`).

Incluidos: mapa, bitácora, portafolio de trabajo, correo, descarga, cierre, sonido activado/desactivado, cuatro flechas, enlace externo y menú.

Se incluye íntegro `assets/icons/LICENSE-lucide.txt`: licencia ISC de Lucide y el aviso MIT de los iconos derivados de Feather. Conservar ambos avisos al redistribuir estos archivos. `assets/icons/sources.json` registra cada URL, tamaño, fecha de descarga y hash.

Los SVG de marcas GitHub y LinkedIn no están presentes en la ruta actual de Lucide utilizada. Los enlaces a esos servicios pueden presentarse con sus nombres y el icono de enlace externo. El kit no introduce logotipos aproximados ni archivos de marcas sin procedencia verificada.

Para la interfaz, utilizar los SVG como componentes o máscaras con un color de suficiente contraste. Los iconos decorativos acompañan una etiqueta visible; los botones que solo muestran un icono necesitan un nombre accesible. Los rótulos del mapa permanecen como elementos web.

## Audio original

Los cinco sonidos fueron sintetizados específicamente para este kit mediante `assets/audio/source.py`, con Python y NumPy. No se utilizaron grabaciones ni samples de terceros.

| Archivo | Duración | Canales | Pico medido | Uso |
| --- | --- | --- | --- | --- |
| `ui-open.wav` | 0,42 s | Mono | −22 dBFS | Abrir destino o ficha |
| `ui-close.wav` | 0,36 s | Mono | −24 dBFS | Cerrar ficha |
| `discovery.wav` | 0,85 s | Mono | −21 dBFS | Descubrir un detalle |
| `step-soft.wav` | 0,11 s | Mono | −28 dBFS | Paso suave opcional |
| `camp-ambience-loop.wav` | 12 s | Estéreo | −26 dBFS | Ambiente periódico de brisa y agua abstractas |

El ambiente es una textura sintética; no debe describirse como una grabación real de Mendoza. Las modulaciones usan periodos que coinciden con los 12 segundos del bucle. No aplicar un silencio extra entre repeticiones. Al iniciar o detener el audio, aplicar una entrada o salida suave.

Todos los WAV son PCM de 16 bits a 44.100 Hz. Se reabrieron y comprobaron formato, canales, duración y ausencia de clipping. `metadataaudio.json` registra mediciones, hashes y ganancia sugerida. No se realizó una evaluación auditiva humana; conviene ajustar la mezcla dentro del sitio antes de publicar.

El sonido debe permanecer desactivado hasta que el visitante lo habilite. Una única instancia del ambiente es suficiente. El portfolio conserva todas sus funciones cuando está en silencio.

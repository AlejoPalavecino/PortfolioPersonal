# Ajuste de legibilidad del inicio

PR #5 · 4 de noviembre de 2026.

Ajuste limitado a `src/styles/intro-interactive.css`. Se conservan composición, contenido y comportamiento.

- Párrafos: 14–15 px, antes 11–13 px.
- Respuestas y controles: 12–14 px, antes 9–12 px.
- Etiquetas, ayudas y estado de carga: 12–13 px; nombre del personaje: 11 px.
- Lexend en títulos de diálogo y nota de llegada; el título principal conserva Pixelify y su tamaño.
- Fondo opaco en la burbuja y más firme en controles; texto secundario más claro y sombra suave para texto directamente sobre la ilustración.
- Menos espaciado entre letras en etiquetas pequeñas.

## Verificación previa a integrar

- `npm run build -- --base=/PortfolioPersonal/`: aprobado.
- `npm run lint`: aprobado.
- `npm test`: 109 pruebas aprobadas en 19 archivos.
- `git diff --check`: aprobado.

Contrastes calculados para colores sólidos: cuerpo del diálogo 10,80:1, etiqueta del hablante 8,45:1, ayuda 8,86:1 (sobre el extremo más claro de la burbuja, #153d43); botón principal 7,81:1. Estos cálculos no constituyen una auditoría completa del texto sobre la ilustración.

La comprobación visual de la URL publicada se realiza después del despliegue. No se agregan dependencias ni assets.

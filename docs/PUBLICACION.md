# GitHub Pages desde main

La publicación de la versión de revisión fue encargada el 30/10/2026. URL del proyecto: <https://alejopalavecino.github.io/PortfolioPersonal/>. Se mantiene `noindex` y el distintivo de revisión: los pendientes editoriales de la entrega 0.1.0 no se convierten en contenido aprobado por estar online.

## Despliegue

GitHub Pages utiliza GitHub Actions. Cada push a `main` ejecuta `.github/workflows/pages.yml`: Node.js 24, `npm ci`, pruebas, linter, build con `--base=/PortfolioPersonal/`, artefacto `dist` y despliegue al entorno `github-pages`. También se puede ejecutar manualmente desde Actions. Un fallo de los checks impide desplegar.

Solo se sube `dist` al sitio; el dossier, pruebas y fuentes no se sirven como parte del portfolio. Los recursos ya derivados de `public/assets` se copian al build. No se ejecuta Python ni se regeneran maestros durante el despliegue.

Las imágenes y descargas creadas por TypeScript usan `assetUrl` de `src/shared/index.ts`; Vite reescribe HTML/CSS. El desarrollo local mantiene base `/`. Para reproducir la salida publicada:

```sh
npm ci
npm test
npm run lint
npm run build -- --base=/PortfolioPersonal/
npm run preview -- --base=/PortfolioPersonal/
```

Abrir `/PortfolioPersonal/` en la URL local. La portada social usa una URL pública absoluta. Si cambia el nombre del repositorio o se incorpora un dominio propio, actualizar el argumento de base del workflow y los metadatos de `index.html`, y volver a comprobar recursos, CV y enlaces de ficha.

## Operación

El workflow tiene permisos de lectura en el build y `pages:write`/`id-token:write` solo en el despliegue, limitado a `main`. Las acciones de publicación están fijadas por SHA, verificados contra las versiones oficiales de GitHub. No requiere secretos personales ni claves de API.

Conforme a las instrucciones de infraestructura del proyecto, se instalaron las plantillas locales de auditoría PR y su esquema (`codex-pr-audit.yml`, `ci/schemas/review-report.schema.json`). La parte opcional de Codex solo se ejecuta si ya existe `OPENAI_API_KEY` como secreto del repositorio; no se creó ni solicitó una clave. Es independiente de Pages y no se ejecuta por un push normal a `main`.

Pendientes de contenido, identidad, mezcla de audio y cobertura parcial: [entrega 0.1.0](ENTREGA-0.1.0.md). Esta publicación permite revisar online el resultado; no marca los 30 criterios como aprobados.

Documentación oficial comprobada: [Vite static deploy](https://vite.dev/guide/static-deploy.html#github-pages), [fuente de publicación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

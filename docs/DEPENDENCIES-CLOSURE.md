# Cierre de dependencias

Auditoría del 31 de octubre de 2026 con Node 24.20.0 y npm 12.0.2. El informe inicial registraba 17 hallazgos (3 críticos, 2 altos y 12 moderados); el informe final registra cero en el árbol completo y en `--omit=dev`. Los informes JSON, stderr, códigos de salida y registros están en `docs/evidence/closure/dependencies/`.

Se actualizaron Vitest 3 a 4.1.12, eslint-plugin-boundaries 5 a 7.4.0 y ESLint 9 a 10.14.0 con @eslint/js 10.0.1. Se conservan TypeScript 5.9, Vite 7 y typescript-eslint 8. ESLint 9 terminó su soporte el 6 de agosto de 2026 ([soporte oficial](https://eslint.org/version-support/)); Vitest 4 elimina tinypool y requiere Node 20 o superior y Vite 6 o superior ([migración oficial](https://v4.vitest.dev/guide/migration.html)). Los cambios de configuración del plugin siguen sus guías [v5 a v6](https://www.jsboundaries.dev/docs/releases/migration-guides/v5-to-v6/) y [v6 a v7](https://www.jsboundaries.dev/docs/releases/migration-guides/v6-to-v7/): se conserva la matriz de dependencias y se clasifica `src/main.ts` como archivo de entrada. Context7 devolvió cuota mensual agotada; se usaron guías oficiales y metadatos del registro.

## Sustitución acotada de minimatch

La advertencia [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) afecta minimatch anterior a 11.0.1. Se aplica `overrides` solo a solicitudes `minimatch@^10`, fijando 11.0.3. La sustitución cruza un major fuera del rango declarado por dependientes; se debe retirar cuando estos adopten una versión corregida y reevaluar al actualizar ESLint o typescript-eslint. Los consumidores instalados usan las exportaciones `minimatch` o `Minimatch`. Se compararon 484 combinaciones de glob entre 10.2.6 y 11.0.3, incluyendo patrones del proyecto, archivos ocultos, negación, clases POSIX y separadores Windows. Este muestreo no prueba equivalencia para todos los patrones posibles. El árbol, script y resultados están en la evidencia.

## Verificación

`npm ci`, `npm test` (14 archivos, 72 pruebas), `npm run lint`, `npm run build` (incluye `tsc --noEmit`) y `npm ls minimatch --all` finalizaron correctamente. Una entrada sintética por stdin desde dominio hacia app fue rechazada por `boundaries/dependencies`, con salida 1 esperada. `npm outdated` documenta actualizaciones mayores pendientes; no se aplicaron TypeScript 7 ni Vite 8 por no ser necesarias para esta corrección. npm 12 informó que bloqueó el postinstall de esbuild bajo su política de scripts; la compilación y las pruebas pasaron en esta instalación.

## Inventario inicial de las 17 alertas

Las filas incluyen metalertas de paquetes que heredan una dependencia vulnerable: no son 17 fallos distintos del sitio estático. Las cadenas provienen de `npm ls --all` conservado, no de una deducción por severidad.

| Paquete y versión inicial | Relación / cadena introductora | Severidad | Aviso o dependencia causal | Acción |
| --- | --- | --- | --- | --- |
| @boundaries/elements 1.2.0 | Transitiva: eslint-plugin-boundaries → @boundaries/elements | high | handlebars | Boundaries 7.4.0 incorpora Handlebars 4.7.10 |
| @eslint-community/eslint-utils 4.10.1 | Transitiva: eslint → @eslint-community/eslint-utils | moderate | eslint | ESLint 10 y override acotado minimatch 11.0.3 |
| @eslint/config-array 0.21.2 | Transitiva: eslint → @eslint/config-array | moderate | minimatch | ESLint 10 y override acotado minimatch 11.0.3 |
| @eslint/eslintrc 3.3.7 | Transitiva: eslint → @eslint/eslintrc | moderate | minimatch | ESLint 10 y override acotado minimatch 11.0.3 |
| @typescript-eslint/eslint-plugin 8.72.1 | Transitiva: typescript-eslint → @typescript-eslint/eslint-plugin | moderate | @typescript-eslint/parser; @typescript-eslint/type-utils; @typescript-eslint/utils; eslint | ESLint 10 y override acotado minimatch 11.0.3 |
| @typescript-eslint/parser 8.72.1 | Transitiva: typescript-eslint → @typescript-eslint/parser | moderate | @typescript-eslint/typescript-estree; eslint | ESLint 10 y override acotado minimatch 11.0.3 |
| @typescript-eslint/type-utils 8.72.1 | Transitiva: typescript-eslint → @typescript-eslint/eslint-plugin → @typescript-eslint/type-utils | moderate | @typescript-eslint/typescript-estree; @typescript-eslint/utils; eslint | ESLint 10 y override acotado minimatch 11.0.3 |
| @typescript-eslint/typescript-estree 8.72.1 | Transitiva: typescript-eslint → @typescript-eslint/typescript-estree | moderate | minimatch | ESLint 10 y override acotado minimatch 11.0.3 |
| @typescript-eslint/utils 8.72.1 | Transitiva: typescript-eslint → @typescript-eslint/utils | moderate | @eslint-community/eslint-utils; @typescript-eslint/typescript-estree; eslint | ESLint 10 y override acotado minimatch 11.0.3 |
| @vitest/mocker 3.2.7 | Transitiva: vitest → @vitest/mocker | moderate | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9); [GHSA-qxg6-89mg-rqv8](https://github.com/advisories/GHSA-qxg6-89mg-rqv8) | Vitest 4.1.12 / mocker 4.1.12; tinypool retirado del grafo |
| eslint 9.39.5 | Directa: eslint | moderate | @eslint-community/eslint-utils; @eslint/config-array; @eslint/eslintrc; minimatch | ESLint 10 y override acotado minimatch 11.0.3 |
| eslint-plugin-boundaries 5.4.0 | Directa: eslint-plugin-boundaries | high | @boundaries/elements; eslint | Boundaries 7.4.0 incorpora Handlebars 4.7.10 |
| handlebars 4.7.8 | Transitiva: eslint-plugin-boundaries → @boundaries/elements → handlebars | critical | [GHSA-3mfm-83xf-c92r](https://github.com/advisories/GHSA-3mfm-83xf-c92r); [GHSA-2w6w-674q-4c4q](https://github.com/advisories/GHSA-2w6w-674q-4c4q); [GHSA-2qvq-rjwj-gvw9](https://github.com/advisories/GHSA-2qvq-rjwj-gvw9); [GHSA-7rx3-28cr-v5wh](https://github.com/advisories/GHSA-7rx3-28cr-v5wh); [GHSA-442j-39wm-28r2](https://github.com/advisories/GHSA-442j-39wm-28r2); [GHSA-xhpv-hc6g-r9c6](https://github.com/advisories/GHSA-xhpv-hc6g-r9c6); [GHSA-9cx6-37pm-9jff](https://github.com/advisories/GHSA-9cx6-37pm-9jff); [GHSA-xjpj-3mr7-gcpf](https://github.com/advisories/GHSA-xjpj-3mr7-gcpf); [GHSA-xw65-4hp5-5hc7](https://github.com/advisories/GHSA-xw65-4hp5-5hc7); [GHSA-8r5x-fm3f-whwj](https://github.com/advisories/GHSA-8r5x-fm3f-whwj); [GHSA-p8wg-vrv2-v86f](https://github.com/advisories/GHSA-p8wg-vrv2-v86f) | Boundaries 7.4.0 incorpora Handlebars 4.7.10 |
| minimatch 10.2.6, 3.1.5 | Transitiva: eslint → minimatch | moderate | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | ESLint 10 y override acotado minimatch 11.0.3 |
| tinypool 1.1.1 | Transitiva: vitest → tinypool | critical | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3); [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) | Vitest 4.1.12 / mocker 4.1.12; tinypool retirado del grafo |
| typescript-eslint 8.72.1 | Directa: typescript-eslint | moderate | @typescript-eslint/eslint-plugin; @typescript-eslint/parser; @typescript-eslint/typescript-estree; @typescript-eslint/utils; eslint | ESLint 10 y override acotado minimatch 11.0.3 |
| vitest 3.2.7 | Directa: vitest | critical | @vitest/mocker; [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9); tinypool | Vitest 4.1.12 / mocker 4.1.12; tinypool retirado del grafo |

## Exposición y condiciones

- **Vitest/mocker/tinypool:** herramientas de pruebas, no código enviado al visitante. Las lecturas o registros de mocks requieren el servidor/circuito de mocks alcanzable y las condiciones del aviso; los gadgets de tinypool requieren contaminación de prototipos/opciones de trabajadores. El script habitual usa `vitest run`, pero CI y equipos de desarrollo siguen siendo entornos relevantes: se actualizó y retiró el componente vulnerable, sin descartarlo solo por ser dev.
- **Boundaries/Handlebars:** se ejecutan al analizar código y plantillas en lint local/CI. Los avisos cubren AST/plantillas/opciones maliciosas, contaminación de prototipos, compilación e inserción insegura de plantillas. No hay renderizado Handlebars en la web publicada; entradas y configuración de repositorio pueden llegar a herramientas del mantenedor/CI. Se corrigió la cadena completa con 4.7.10, sin aceptar alertas altas o críticas.
- **ESLint/typescript-eslint/minimatch:** análisis de archivos y globs de configuración en desarrollo/CI. GHSA-g3hv-75wg-m249 requiere un patrón hostil y la ruta de optimización de globparts señalada por el aviso; no hay patrones aportados por visitantes. La corrección mínima del aviso es 11.0.1 y se fijó 11.0.3 solo para consumidores que pedían ^10; la equivalencia fue muestreada con 484 casos y una importación prohibida sigue rechazándose.
- **Sitio estático:** `--omit=dev` dio cero antes y después, y no existen dependencias de producción declaradas. Esto delimita la exposición; no sustituye la auditoría completa ni demuestra seguridad absoluta de la aplicación.

## Seguimiento y CI

No quedan avisos en las dos auditorías finales; los códigos 0 y JSON se conservan. El override es una adaptación fuera del rango declarado por terceros, no una garantía universal de compatibilidad: reevaluarlo al actualizar ESLint/typescript-eslint y retirarlo cuando sus rangos adopten una versión corregida. No se aplicó `audit fix --force`, no se borró el lockfile y no se desactivaron reglas. Las versiones mayores de TypeScript/Vite indicadas por outdated no son avisos de seguridad pendientes.
Se prepara un workflow de auditoría completa en PR/main y un gate antes de publicar Pages, con umbral moderate. Error de red/registro también detiene el paso y no se interpreta como cero alertas. Son cambios locales aún no ejecutados en GitHub; la publicación y el despliegue no están autorizados en esta iteración.

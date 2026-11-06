# Activación del dominio alejopalavecino.com.ar

Este cambio se prepara en una PR sin fusionar para no romper el portfolio actualmente publicado en `https://alejopalavecino.github.io/PortfolioPersonal/`. **No publicar el build con base `/` hasta terminar la configuración de Pages y DNS.**

## Dominio canónico

- Principal: `https://alejopalavecino.com.ar/`.
- Variante: `https://www.alejopalavecino.com.ar/` con redirección automática a la principal si el DNS está correcto.
- Inglés: `https://alejopalavecino.com.ar/?lang=en`.
- Los links internos con hash (#proyectos/foxmind, etc.) siguen funcionando.

## Registros DNS a crear en el proveedor que administra la zona

| Tipo | Nombre/Host | Contenido |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | alejopalavecino.github.io |

Opcionales para IPv6: cuatro registros AAAA en `@` hacia `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153` y `2606:50c0:8003::153`.

No crear registros wildcard `*` y no borrar registros MX/TXT usados por correo u otros servicios. Si la zona está en otro proveedor, la delegación NS de NIC Argentina debe apuntar a ese proveedor (NIC Argentina no aloja zonas DNS).

## Activación coordinada

1. Crear los registros A y CNAME donde se administran los DNS; comprobar que no compitan con registros viejos del mismo host.
2. En `AlejoPalavecino/PortfolioPersonal → Settings → Pages → Custom domain`, ingresar exactamente `alejopalavecino.com.ar` y guardar. **La publicación usa GitHub Actions**: agregar un archivo `CNAME` al repositorio no configura el dominio y GitHub lo ignora.
3. Confirmar la verificación DNS en GitHub Pages. Una vez disponible, fusionar esta PR a `main`, cuyo workflow compila la aplicación con `--base=/`.
4. Esperar que el workflow *Publish portfolio to GitHub Pages* termine exitosamente. Revisar home, imágenes, CV ES/EN, selector de idioma, rutas profundas, JS y CSS, 404s y URLs del sitemap.
5. Cuando GitHub habilite el certificado, activar **Enforce HTTPS** en Pages y validar el redireccionamiento automático de `www`.

DNS puede demorar hasta 24 horas. No declarar finalizada la migración hasta probar la URL por HTTPS.

## SEO y privacidad

La PR cambia las URLs canónicas, Open Graph, JSON-LD, `hreflang`, el sitemap y `robots.txt` al nuevo dominio. La comprobación de archivos públicos sigue validando ausencia de DNI, teléfono y patrones de tokens. Evitar capturas o documentos con datos personales. No modificar servicios de correo del dominio sin revisar los registros actuales.

Fuentes: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site y https://vite.dev/guide/static-deploy.

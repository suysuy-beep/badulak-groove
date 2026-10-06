# Badulak · Calculadora de pedidos

Código completo de la calculadora de Suy, listo para GitHub Pages.
HTML, CSS, JavaScript, SVG y PNG. No requiere compilación, base de datos ni claves.

## Subirla a GitHub Pages

1. Descomprime el ZIP.
2. Crea un repositorio público en GitHub, por ejemplo `badulak-calculadora`.
3. Dentro del repositorio, usa **Add file → Upload files**. Arrastra los archivos y la carpeta `assets` descomprimidos. No subas el ZIP: `index.html` debe quedar en la raíz del repositorio. Guarda con **Commit changes**.
4. Abre **Settings → Pages**. En **Source** elige **Deploy from a branch**, rama **main** y carpeta **/(root)**. Pulsa **Save**.
5. Cuando termine la publicación, copia el enlace que aparece en Pages y compártelo.

La dirección suele tener esta forma:
`https://TU_USUARIO.github.io/badulak-calculadora/`

Documentación oficial de la configuración:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Qué incluye

- Doce productos con ilustraciones originales.
- Clic en la imagen para agregar una unidad, botones + y − y cantidades editables.
- Filtros y búsqueda.
- Carrito, total y promociones automáticas.
- Limpieza por compras mayores a $5,000 y reparación por compras mayores a $10,000. El monto exacto del límite no activa la promoción.
- Copiar pedido: descripción corta y total opcional.
- Copiar total: solo números, sin signo $, comas ni puntos. Si editas precios con centavos, el total copiado se redondea al peso más cercano.
- Modo claro/oscuro que recuerda tu elección.
- Precios y pedido guardados en el navegador.
- Aplicación instalable con manifest, iconos y recursos para uso sin conexión después de abrirla una vez con internet.

## Cómo compartirla

Cualquier persona puede abrir el enlace publicado en GitHub Pages sin iniciar sesión en ChatGPT. Cada persona tiene su propio pedido y sus precios guardados en su navegador.

Los cambios hechos con el lápiz afectan solo al navegador de esa persona. Para cambiar los precios iniciales para todos, edita `core.js` y guarda el cambio en GitHub.

## Archivos principales

| Archivo | Qué modifica |
| --- | --- |
| `index.html` | Estructura, textos y botones |
| `style.css` | Colores, temas y diseño |
| `app.js` | Interacciones, copia y guardado local |
| `core.js` | Catálogo, precios iniciales y cálculos |
| `art.js` | Ilustraciones de los productos |
| `sw.js` | Recursos sin conexión |
| `manifest.webmanifest` | Nombre e instalación de la app |
| `assets/` | Iconos de la app e imagen del burrito |

Al actualizar los archivos, cambia el número de `CACHE` al principio de `sw.js`, por ejemplo de `badulak-github-v1` a `badulak-github-v2`, y vuelve a subir los archivos modificados.

## Abrir y verificar

Usa el enlace publicado en GitHub Pages. El doble clic en `index.html` desde el disco no carga los módulos JavaScript correctamente.

Para una revisión local opcional, sirve esta carpeta con un servidor HTTP. Si tienes Python instalado, puedes ejecutar `python -m http.server 8000` en la carpeta y abrir `http://localhost:8000/`.

Ejemplo de cálculo: 4 teléfonos, 2 radios y 1 cajita = $7,500. Copiar pedido produce `4x Teléfono, 2x Radio, 1x Cajita feliz`; copiar total produce `7500`.

Esta exportación incluye los cambios de modo oscuro, clic en imágenes y copia independiente del total. Sus referencias a archivos son relativas y funcionan en una subcarpeta de GitHub Pages.

## Actualización de ilustraciones

La cajita feliz es ahora un empaque de comida con asa y una hamburguesa al frente. La tablet de mecánico muestra una llave inglesa y un engrane. Si ya subiste la versión anterior, reemplaza `art.js` y `sw.js` en tu repositorio.

## Burritos

Burritos está en Básicos a $200 por unidad. Para actualizar tu publicación anterior, sube todo el contenido descomprimido de este ZIP, incluida la carpeta `assets` con `burrito.png`, y reemplaza los archivos existentes.

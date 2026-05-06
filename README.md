# DevStudio — Trabajo Final JavaScript

Sitio web de empresa ficticia de desarrollo web creado como trabajo final del módulo de JavaScript.

## Páginas

- `index.html` — Página de inicio con Hero, Servicios, Estadísticas y Noticias cargadas via Ajax desde JSON
- `views/galeria.html` — Galería dinámica con filtros por categoría y lightbox (jQuery)
- `views/presupuesto.html` — Formulario con validación JS y calculadora de presupuesto en tiempo real
- `views/contacto.html` — Mapa interactivo con ruta automática por carretera (Leaflet + OSRM)

## Estructura del proyecto

```
devstudio/
  index.html              ← Página principal (raíz)
  README.md
  views/
    galeria.html
    presupuesto.html
    contacto.html
  css/
    styles.css            ← Estilos globales compartidos
    index.css
    galeria.css
    presupuesto.css
    contacto.css
  js/
    nav.js                ← Navbar compartida
    index.js
    galeria.js
    presupuesto.js
    contacto.js
  data/
    noticias.json         ← Datos de noticias (cargados via Ajax)
  assets/
    images/               ← Imágenes del proyecto
    fonts/                ← Fuentes tipográficas
    icons/                ← Iconos
```

## Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox, Grid, Variables CSS)
- JavaScript (ES6+)
- Ajax (Fetch API)
- jQuery 3.7.1
- Leaflet 1.9.4 + OpenStreetMap
- Leaflet Routing Machine (rutas por carretera via OSRM)

## Cómo ejecutar

Abrir con **Live Server** en VS Code o publicar en **GitHub Pages**.

> La página de contacto requiere que el usuario acepte compartir su ubicación para mostrar la ruta automática por carretera.

## Correcciones aplicadas

1. **Mapa dinámico**: la ruta se calcula automáticamente al cargar la página, por carretera (OSRM), sin necesidad de pulsar ningún botón.
2. **Estructura de carpetas**: reorganizada según el enunciado (views/, css/, js/, data/, assets/).
3. **Layout Flexbox**: `body` con `display:flex` y `flex-direction:column`, `main` con `flex:1` para que el footer siempre esté al pie.
4. **Imágenes**: todos los `<img>` tienen atributos `width` y `height` declarados.

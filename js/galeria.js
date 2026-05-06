/* ============================================================
   galeria.js — Galería con filtros jQuery y lightbox
   CORRECCIÓN: width y height en cada imagen creada dinámicamente
   ============================================================ */

const proyectos = [
  { id:1, titulo:'Portal Corporativo Nexum',  categoria:'web',       desc:'Rediseño completo del portal corporativo con CMS personalizado.',     img:'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80' },
  { id:2, titulo:'App de Gestión TaskFlow',   categoria:'app',       desc:'Aplicación web de gestión de tareas con tiempo real y colaboración.',  img:'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80' },
  { id:3, titulo:'Tienda Online ModaVerde',   categoria:'ecommerce', desc:'E-commerce de moda sostenible con pasarela de pago integrada.',        img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80' },
  { id:4, titulo:'Landing Evento TechSummit', categoria:'landing',   desc:'Landing de alta conversión para congreso tecnológico internacional.',  img:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { id:5, titulo:'Dashboard Analytics Pro',  categoria:'app',       desc:'Panel de analítica avanzada con gráficos interactivos y exportación.', img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
  { id:6, titulo:'Web Restaurante BocaVerde', categoria:'web',       desc:'Sitio web con reservas online y carta digital para restaurante.',      img:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' },
  { id:7, titulo:'Marketplace ArteLocal',    categoria:'ecommerce', desc:'Marketplace de artesanía local con sistema de vendedores múltiples.',  img:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
  { id:8, titulo:'Landing SaaS CloudManager',categoria:'landing',   desc:'Landing page para producto SaaS B2B con demo interactiva.',            img:'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=600&q=80' },
  { id:9, titulo:'Web Clínica DentalPlus',   categoria:'web',       desc:'Sitio web para clínica dental con reserva de citas online.',           img:'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80' },
];

let proyectosFiltrados = [...proyectos];
let indiceActual = 0;

function renderGaleria(lista) {
  const grid = document.getElementById('galeriaGrid');
  grid.innerHTML = '';
  if (lista.length === 0) {
    grid.innerHTML = '<p style="color:var(--color-gray);text-align:center;padding:3rem;grid-column:1/-1">No hay proyectos en esta categoría.</p>';
    return;
  }
  lista.forEach((proyecto, idx) => {
    const card = document.createElement('article');
    card.className = 'proyecto-card';
    card.dataset.idx = idx;
    /* CORRECCIÓN: width y height declarados en cada imagen de proyecto */
    card.innerHTML = `
      <img
        src="${proyecto.img}"
        alt="${proyecto.titulo}"
        width="600"
        height="400"
        loading="lazy"
      >
      <div class="proyecto-card__overlay">
        <span class="proyecto-card__cat">${proyecto.categoria}</span>
        <h3 class="proyecto-card__title">${proyecto.titulo}</h3>
      </div>
    `;
    card.addEventListener('click', () => abrirLightbox(idx));
    grid.appendChild(card);
  });
}

/* Filtros con jQuery */
$(document).on('click', '.filtro-btn', function() {
  $('.filtro-btn').removeClass('active');
  $(this).addClass('active');
  const filtro = $(this).data('filtro');
  proyectosFiltrados = filtro === 'todos'
    ? [...proyectos]
    : proyectos.filter(p => p.categoria === filtro);
  renderGaleria(proyectosFiltrados);
});

/* Lightbox */
function abrirLightbox(idx) {
  indiceActual = idx;
  const p = proyectosFiltrados[idx];
  /* CORRECCIÓN: actualizar width y height al cambiar imagen */
  const img = document.getElementById('lightboxImg');
  img.src    = p.img;
  img.alt    = p.titulo;
  img.width  = 540;
  img.height = 360;
  document.getElementById('lightboxTitle').textContent = p.titulo;
  document.getElementById('lightboxDesc').textContent  = p.desc;
  document.getElementById('lightboxCat').textContent   = p.categoria;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', cerrarLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => {
  indiceActual = (indiceActual - 1 + proyectosFiltrados.length) % proyectosFiltrados.length;
  abrirLightbox(indiceActual);
});
document.getElementById('lightboxNext').addEventListener('click', () => {
  indiceActual = (indiceActual + 1) % proyectosFiltrados.length;
  abrirLightbox(indiceActual);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarLightbox(); });
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox') cerrarLightbox();
});

$(document).ready(() => renderGaleria(proyectos));

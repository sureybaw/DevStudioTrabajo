/* ============================================================
   index.js — Noticias via Ajax + animación de contadores
   ============================================================ */

/* Cargar noticias desde JSON */
async function cargarNoticias() {
  const grid = document.getElementById('noticiasGrid');
  try {
    const respuesta = await fetch('data/noticias.json');
    if (!respuesta.ok) throw new Error('No se pudieron cargar las noticias');
    const noticias = await respuesta.json();
    grid.innerHTML = '';
    noticias.forEach(noticia => {
      const fecha = new Date(noticia.fecha).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      /* CORRECCIÓN: width y height declarados en cada imagen de noticia */
      grid.insertAdjacentHTML('beforeend', `
        <article class="noticia-card">
          <img
            class="noticia-card__img"
            src="${noticia.imagen}"
            alt="${noticia.titulo}"
            width="600"
            height="180"
            loading="lazy"
          >
          <div class="noticia-card__body">
            <span class="noticia-card__cat">${noticia.categoria}</span>
            <h3 class="noticia-card__title">${noticia.titulo}</h3>
            <p class="noticia-card__resumen">${noticia.resumen}</p>
            <time class="noticia-card__fecha">${fecha}</time>
          </div>
        </article>
      `);
    });
  } catch (error) {
    grid.innerHTML = `<p style="color:var(--color-accent);text-align:center;grid-column:1/-1">
      Error al cargar las noticias: ${error.message}
    </p>`;
  }
}

/* Animación de contadores */
function animarContadores() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const destino = parseInt(el.dataset.target);
      const duracion= 1500;
      const inicio  = performance.now();
      function actualizar(t) {
        const progreso = Math.min((t - inicio) / duracion, 1);
        const ease     = 1 - Math.pow(1 - progreso, 3);
        el.textContent = Math.floor(ease * destino);
        if (progreso < 1) requestAnimationFrame(actualizar);
        else el.textContent = destino;
      }
      requestAnimationFrame(actualizar);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stats__num').forEach(n => observer.observe(n));
}

document.addEventListener('DOMContentLoaded', () => {
  cargarNoticias();
  animarContadores();
});

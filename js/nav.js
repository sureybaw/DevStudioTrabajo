/* ============================================================
   nav.js — Menú hamburguesa y enlace activo
   ============================================================ */

/* Menú hamburguesa para móvil */
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* Marcar enlace activo según la página actual */
(function markActive() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page) a.classList.add('active');
  });
})();

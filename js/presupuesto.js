/* ============================================================
   presupuesto.js — Validación y calculadora de presupuesto
   ============================================================ */

const REGEX = {
  nombre:    /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,15}$/,
  apellidos: /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,40}$/,
  telefono:  /^[0-9]{1,9}$/,
  email:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const form        = document.getElementById('formPresupuesto');
const successBox  = document.getElementById('formSuccess');
const precioTotal = document.getElementById('precioTotal');
const detalleBox  = document.getElementById('precioDetalle');

function validarCampo(id, patron) {
  const input = document.getElementById(id);
  const grupo = document.getElementById(`grp-${id}`);
  if (!input || !grupo) return true;
  const valor    = input.value.trim();
  const esValido = patron.test(valor) && valor !== '';
  grupo.classList.toggle('error', !esValido);
  grupo.classList.toggle('ok',    esValido);
  return esValido;
}

['nombre', 'apellidos', 'telefono', 'email'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => validarCampo(id, REGEX[id]));
    input.addEventListener('blur',  () => validarCampo(id, REGEX[id]));
  }
});

/* Bloquear caracteres no permitidos */
document.getElementById('nombre').addEventListener('keypress', e => {
  if (!/[A-Za-záéíóúÁÉÍÓÚñÑ\s]/.test(e.key)) e.preventDefault();
});
document.getElementById('apellidos').addEventListener('keypress', e => {
  if (!/[A-Za-záéíóúÁÉÍÓÚñÑ\s]/.test(e.key)) e.preventDefault();
});
document.getElementById('telefono').addEventListener('keypress', e => {
  if (!/[0-9]/.test(e.key)) e.preventDefault();
});

/* Calculadora en tiempo real */
function calcularPresupuesto() {
  const selectProducto = document.getElementById('producto');
  const precioBase     = parseFloat(selectProducto.value) || 0;
  const labelProducto  = selectProducto.selectedOptions[0]?.dataset.label || '';

  let sumExtras = 0;
  const extrasSeleccionados = [];
  document.querySelectorAll('input[name="extra"]:checked').forEach(cb => {
    sumExtras += parseFloat(cb.value);
    extrasSeleccionados.push(cb.dataset.label);
  });

  const plazo     = parseInt(document.getElementById('plazo').value) || 0;
  const plazoHint = document.getElementById('plazoHint');
  let factorPlazo = 1;
  let textoPlazo  = '';

  if (plazo > 0) {
    if      (plazo <= 2) { factorPlazo = 1.20; textoPlazo = '+20% urgente';      plazoHint.textContent = '⚡ Recargo urgente +20%'; }
    else if (plazo <= 4) { factorPlazo = 1.10; textoPlazo = '+10%';              plazoHint.textContent = '+10% (plazo corto)'; }
    else if (plazo <= 8) { factorPlazo = 1;    textoPlazo = 'Sin cargo extra';   plazoHint.textContent = ''; }
    else                 { factorPlazo = 0.90; textoPlazo = '-10% largo plazo';  plazoHint.textContent = '✓ Descuento largo plazo -10%'; }
  } else {
    plazoHint.textContent = '';
  }

  if (precioBase === 0) {
    precioTotal.textContent = '0 €';
    detalleBox.textContent  = 'Selecciona un tipo de proyecto para ver el presupuesto.';
    return;
  }

  const total = Math.round((precioBase + sumExtras) * factorPlazo);
  precioTotal.style.transform = 'scale(1.05)';
  setTimeout(() => { precioTotal.style.transform = ''; }, 200);
  precioTotal.textContent = total.toLocaleString('es-ES') + ' €';

  let detalle = `${labelProducto}: ${precioBase.toLocaleString('es-ES')} €`;
  if (extrasSeleccionados.length > 0)
    detalle += ` + Extras: +${sumExtras} €`;
  if (textoPlazo)
    detalle += ` · Plazo ${plazo} meses: ${textoPlazo}`;
  detalleBox.textContent = detalle;
}

document.getElementById('producto').addEventListener('change', calcularPresupuesto);
document.getElementById('plazo').addEventListener('input', calcularPresupuesto);
document.querySelectorAll('input[name="extra"]').forEach(cb => {
  cb.addEventListener('change', calcularPresupuesto);
});

/* Envío del formulario */
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const v1 = validarCampo('nombre',    REGEX.nombre);
  const v2 = validarCampo('apellidos', REGEX.apellidos);
  const v3 = validarCampo('telefono',  REGEX.telefono);
  const v4 = validarCampo('email',     REGEX.email);

  if (!document.getElementById('producto').value) {
    alert('Por favor, selecciona un tipo de proyecto.');
    return;
  }

  const condiciones = document.getElementById('condiciones').checked;
  const grpCond     = document.getElementById('grp-condiciones');
  const errCond     = document.getElementById('err-condiciones');
  if (!condiciones) {
    grpCond.classList.add('error');
    errCond.style.display = 'block';
    return;
  }
  grpCond.classList.remove('error');
  errCond.style.display = 'none';

  if (v1 && v2 && v3 && v4) {
    form.style.display       = 'none';
    successBox.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

form.addEventListener('reset', () => {
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error', 'ok'));
  setTimeout(calcularPresupuesto, 10);
});

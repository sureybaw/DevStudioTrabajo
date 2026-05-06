/* ============================================================
   contacto.js — Mapa automático con ruta por carretera
   CORRECCIÓN:
   1. La ruta se calcula AUTOMÁTICAMENTE al cargar la página
      (sin necesidad de pulsar ningún botón)
   2. La ruta es por CARRETERA usando Leaflet Routing Machine
      + OSRM (Open Source Routing Machine) — no línea recta
   ============================================================ */

/* ── Coordenadas de la empresa (Tejina, La Laguna, Tenerife) ── */
const EMPRESA = {
  lat: 28.5697,
  lng: -16.3089,
  nombre: 'DevStudio',
  direccion: 'Av. Milán, 139 · Tejina · La Laguna · Tenerife'
};

/* ── Inicializar el mapa ── */
const mapa = L.map('mapa', {
  center: [EMPRESA.lat, EMPRESA.lng],
  zoom: 14,
  scrollWheelZoom: false,
});

/* Capa de tiles OpenStreetMap */
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(mapa);

/* ── Marcador personalizado de la empresa ── */
const iconoEmpresa = L.divIcon({
  className: '',
  html: `<div style="
    background:#E94560;
    width:36px;height:36px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid white;
    box-shadow:0 4px 12px rgba(233,69,96,0.5);">
  </div>`,
  iconSize:   [36, 36],
  iconAnchor: [18, 36],
  popupAnchor:[0, -40],
});

const marcadorEmpresa = L.marker([EMPRESA.lat, EMPRESA.lng], { icon: iconoEmpresa })
  .addTo(mapa)
  .bindPopup(`
    <div style="text-align:center;padding:6px 10px;font-family:sans-serif">
      <strong style="font-size:1rem;color:#E94560">🏢 ${EMPRESA.nombre}</strong><br>
      <span style="font-size:0.82rem;color:#555">${EMPRESA.direccion}</span>
    </div>
  `)
  .openPopup();

/* ── Variable global para la instancia de ruta ── */
let controlRuta = null;

/* ============================================================
   FUNCIÓN PRINCIPAL: Calcular ruta por carretera AUTOMÁTICAMENTE
   Se llama en cuanto el navegador obtiene la posición del usuario.

   Leaflet Routing Machine usa OSRM (osrm-routed.projekt.fi)
   que calcula rutas REALES por carretera, no línea recta.
   ============================================================ */
function calcularRutaPorCarretera(latUsuario, lngUsuario) {
  /* Si ya existía una ruta anterior, la eliminamos */
  if (controlRuta) {
    mapa.removeControl(controlRuta);
    controlRuta = null;
  }

  /* Crear el control de ruta por carretera */
  controlRuta = L.Routing.control({
    /* Puntos de la ruta: origen (usuario) → destino (empresa) */
    waypoints: [
      L.latLng(latUsuario, lngUsuario),        // Punto A: usuario
      L.latLng(EMPRESA.lat, EMPRESA.lng),       // Punto B: empresa
    ],

    /* OSRM: motor de rutas por carretera de OpenStreetMap (gratuito) */
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      profile: 'driving',  // ruta en coche (también: 'cycling', 'foot')
    }),

    /* Estilo de la línea de ruta */
    lineOptions: {
      styles: [{ color: '#E94560', weight: 5, opacity: 0.85 }],
    },

    /* Marcador de destino personalizado */
    createMarker: function(i, waypoint) {
      if (i === 0) {
        /* Marcador del usuario */
        return L.marker(waypoint.latLng, {
          icon: L.divIcon({
            className: '',
            html: `<div style="
              background:#2563EB;
              width:28px;height:28px;
              border-radius:50%;
              border:3px solid white;
              box-shadow:0 3px 10px rgba(37,99,235,0.5)">
            </div>`,
            iconSize:   [28, 28],
            iconAnchor: [14, 14],
          }),
        }).bindPopup('<b>📍 Tu ubicación</b>');
      }
      /* Para el destino usamos nuestro marcador personalizado */
      return marcadorEmpresa;
    },

    /* Panel lateral de instrucciones — lo ocultamos para no sobrecargar la UI */
    show: false,
    collapsible: false,
    addWaypoints: false,
    fitSelectedRoutes: true,  /* ajusta el zoom para ver toda la ruta */
    showAlternatives: false,
  })
  .addTo(mapa);

  /* Cuando la ruta esté calculada, mostramos la distancia y tiempo */
  controlRuta.on('routesfound', function(e) {
    const ruta       = e.routes[0];
    const distanciaKm = (ruta.summary.totalDistance / 1000).toFixed(1);
    const minutos     = Math.ceil(ruta.summary.totalTime / 60);
    const horas       = Math.floor(minutos / 60);
    const mins        = minutos % 60;
    const tiempoTexto = horas > 0
      ? `${horas}h ${mins}min`
      : `${minutos} min`;

    document.getElementById('geoTexto').textContent =
      `✅ Ruta calculada por carretera · ${distanciaKm} km · Tiempo estimado: ${tiempoTexto}`;
    document.getElementById('geoEstado').classList.add('ok');
  });

  /* Si falla el cálculo de ruta */
  controlRuta.on('routingerror', function() {
    document.getElementById('geoTexto').textContent =
      '⚠ No se pudo calcular la ruta por carretera. Comprueba tu conexión.';
  });
}

/* ============================================================
   GEOLOCALIZACIÓN AUTOMÁTICA
   Al cargar la página, el navegador pide permiso para
   acceder a la ubicación del usuario.
   Si acepta → calculamos la ruta por carretera automáticamente.
   Si rechaza → centramos en la empresa y mostramos aviso.
   ============================================================ */
function iniciarGeolocalizacion() {
  const textoEstado = document.getElementById('geoTexto');

  /* Comprobar si el navegador soporta geolocalización */
  if (!navigator.geolocation) {
    textoEstado.textContent = '⚠ Tu navegador no soporta geolocalización.';
    return;
  }

  textoEstado.textContent = '📡 Solicitando tu ubicación para calcular la ruta...';

  /* Pedir la posición al navegador */
  navigator.geolocation.getCurrentPosition(
    /* ÉXITO: el usuario aceptó compartir su ubicación */
    function(posicion) {
      const latUsuario = posicion.coords.latitude;
      const lngUsuario = posicion.coords.longitude;

      textoEstado.textContent = '🔄 Calculando ruta por carretera...';

      /* Calcular la ruta por carretera automáticamente */
      calcularRutaPorCarretera(latUsuario, lngUsuario);
    },

    /* ERROR: el usuario rechazó o hubo un problema */
    function(error) {
      let mensaje = '';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          mensaje = '🔒 Permiso de ubicación denegado. Actívalo en tu navegador para ver la ruta.';
          break;
        case error.POSITION_UNAVAILABLE:
          mensaje = '📡 Ubicación no disponible en este momento.';
          break;
        case error.TIMEOUT:
          mensaje = '⏱ Tiempo de espera agotado al obtener la ubicación.';
          break;
        default:
          mensaje = '⚠ No se pudo obtener tu ubicación.';
      }
      document.getElementById('geoTexto').textContent = mensaje;

      /* Centrar el mapa en la empresa con un zoom adecuado */
      mapa.setView([EMPRESA.lat, EMPRESA.lng], 15);
    },

    /* Opciones de geolocalización */
    {
      enableHighAccuracy: true,  /* usar GPS si está disponible */
      timeout: 10000,            /* esperar máximo 10 segundos */
      maximumAge: 0              /* no usar caché, obtener posición fresca */
    }
  );
}

/* ── Arrancar automáticamente al cargar la página ── */
document.addEventListener('DOMContentLoaded', iniciarGeolocalizacion);

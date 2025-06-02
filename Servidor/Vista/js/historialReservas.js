// Variables globales
let historialReservas = [];
let historialFiltrado = [];
let paginaActual = 1;
const reservasPorPagina = 6;

document.addEventListener("DOMContentLoaded", () => {
  cargarHistorial();
  setupEventListeners();
});

// Cargar historial desde PHP
function cargarHistorial() {
  fetch("../../Servidor/Controlador/historialReservas.php")
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada:", data);
        return;
      }

      //  Normaliza estado a minúsculas
      historialReservas = data.map(r => ({
        ...r,
        estado: r.estado.toLowerCase()
      }));

      historialFiltrado = [...historialReservas];
      renderizarHistorial();
      actualizarContadores();
    })
    .catch(error => {
      console.error("Error al obtener las reservas:", error);
    });
}

// Renderizar historial en la tabla
function renderizarHistorial() {
  const tbody = document.getElementById("historial-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const inicio = (paginaActual - 1) * reservasPorPagina;
  const fin = inicio + reservasPorPagina;
  const reservasPagina = historialFiltrado.slice(inicio, fin);

  for (const reserva of reservasPagina) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${reserva.nombres}</td>
      <td>${reserva.dia}</td>
      <td>${reserva.horaEntrada} - ${reserva.horaSalida}</td>
      <td>${reserva.personas}</td>
      <td>${reserva.estado}</td>
      <td>${formatearFecha(reserva.fechaReserva)}</td>
      <td>
        <button onclick="verDetalles(${reserva.id})"
          style="
            background-color: #c40000;
            color: white;
            padding: 6px 14px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          ">
          <i class="fas fa-eye" style="font-size: 14px;"></i>
          Detalles
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  }
}

function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString();
}

function actualizarContadores() {
  const total = document.getElementById("total-historial");
  const mostrando = document.getElementById("showing-count");
  const totalCount = document.getElementById("total-count");

  if (total) total.textContent = `${historialFiltrado.length} reservas en Historial`;
  if (mostrando) mostrando.textContent = Math.min(historialFiltrado.length, reservasPorPagina);
  if (totalCount) totalCount.textContent = historialFiltrado.length;
}

function cambiarPagina(valor) {
  const totalPaginas = Math.ceil(historialFiltrado.length / reservasPorPagina);
  paginaActual += valor;
  if (paginaActual < 1) paginaActual = 1;
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  renderizarHistorial();
  actualizarContadores();
}

function filtrarHistorial() {
  const busqueda = document.getElementById("search-input").value.toLowerCase();
  const estado = document.getElementById("filter-estado").value.toLowerCase();
  const mes = document.getElementById("filter-mes").value;

  historialFiltrado = historialReservas.filter(r => {
    const nombreMatch = r.nombres.toLowerCase().includes(busqueda);
    const estadoMatch = estado ? r.estado.toLowerCase() === estado : true;
    const mesMatch = mes !== "" ? new Date(r.dia).getMonth().toString() === mes : true;
    return nombreMatch && estadoMatch && mesMatch;
  });

  paginaActual = 1;
  renderizarHistorial();
  actualizarContadores();
}


function limpiarFiltros() {
  document.getElementById("search-input").value = "";
  document.getElementById("filter-estado").value = "";
  document.getElementById("filter-mes").value = "";
  filtrarHistorial();
}

function verDetalles(id) {
  const reserva = historialReservas.find(r => r.id == id);
  const modal = document.getElementById("details-modal");
  const content = document.getElementById("details-content");

  if (!reserva || !modal || !content) return;

  content.innerHTML = `
    <p><strong>Nombre:</strong> ${reserva.nombres}</p>
    <p><strong>Día:</strong> ${reserva.dia}</p>
    <p><strong>Horario:</strong> ${reserva.horaEntrada} - ${reserva.horaSalida}</p>
    <p><strong>Personas:</strong> ${reserva.personas}</p>
    <p><strong>Estado:</strong> ${reserva.estado}</p>
    <p><strong>Fecha de reserva:</strong> ${formatearFecha(reserva.fechaReserva)}</p>
    <p><strong>Fecha de creación:</strong> ${formatearFecha(reserva.fechaCreacion)}</p>
  `;
  modal.style.display = "block";
}

function cerrarModal() {
  const modal = document.getElementById("details-modal");
  if (modal) modal.style.display = "none";
}

function setupEventListeners() {
  document.getElementById("search-input").addEventListener("keyup", filtrarHistorial);
  document.getElementById("filter-estado").addEventListener("change", filtrarHistorial);
  document.getElementById("filter-mes").addEventListener("change", filtrarHistorial);
}

function actualizarHistorial() {
  cargarHistorial(); // simplemente recarga los datos
}

function exportarHistorial() {
  if (!historialReservas.length) {
    alert("No hay datos para exportar.");
    return;
  }

  const encabezados = [
    "ID", "Nombres", "Día", "Horario", "Personas", "Estado", "Fecha Reserva", "Fecha Creación"
  ];

  const filas = historialReservas.map(r =>
    [
      r.id,
      `"${r.nombres}"`,
      `"${r.dia}"`,
      `"${r.horaEntrada} - ${r.horaSalida}"`,
      r.personas,
      r.estado,
      formatearFecha(r.fechaReserva),
      formatearFecha(r.fechaCreacion)
    ].join(",")
  );

  const contenidoCSV = [encabezados.join(","), ...filas].join("\n");
  const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historial_reservas.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

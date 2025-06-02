let reservasHorarios = [];

const horariosDisponibles = [];
for (let i = 8; i <= 22; i++) horariosDisponibles.push(i);

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
let semanaActual = new Date();

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  cargarReservasDesdeBD();
  actualizarSemanaActual();
});

// Cargar desde PHP
function cargarReservasDesdeBD() {
  fetch("../Controlador/traerHorarios.php")
    .then(res => res.json())
    .then(data => {
      reservasHorarios = data;
      renderizarHorarios();
      actualizarEstadisticas();
    })
    .catch(error => {
      console.error("Error al traer horarios:", error);
    });
}

function setupEventListeners() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", function () {
      document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.querySelector(".logout-btn").addEventListener("click", () => {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
      mostrarNotificacion("Sesión cerrada exitosamente", "info");
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarModal();
  });

  document.getElementById("reservation-modal").addEventListener("click", function (e) {
    if (e.target === this) cerrarModal();
  });
}

function renderizarHorarios() {
  const tbody = document.getElementById("schedule-tbody");
  tbody.innerHTML = "";

  // Obtener inicio y fin de la semana actual
  const inicioSemana = new Date(semanaActual);
  inicioSemana.setDate(semanaActual.getDate() - semanaActual.getDay() + 1); // Lunes
  inicioSemana.setHours(0, 0, 0, 0);

  const finSemana = new Date(inicioSemana);
  finSemana.setDate(inicioSemana.getDate() + 6); // Domingo
  finSemana.setHours(23, 59, 59, 999);

  // Filtrar solo las reservas dentro del rango de semana actual
  const reservasSemana = reservasHorarios.filter(r => {
    const [anio, mes, dia] = r.fecha.split("-").map(Number);
const fechaReserva = new Date(anio, mes - 1, dia);
    return fechaReserva >= inicioSemana && fechaReserva <= finSemana;
  });

  horariosDisponibles.forEach((hora) => {
    const fila = document.createElement("tr");

    const celdaHora = document.createElement("td");
    celdaHora.className = "time-cell";
    celdaHora.textContent = `${hora.toString().padStart(2, "0")}:00`;
    fila.appendChild(celdaHora);

    for (let dia = 1; dia <= 7; dia++) {
      // Verifica si ya hay una reserva ocupando esa hora (omitida por rowspan)
      const yaOmitida = reservasSemana.some(r =>
        r.dia === dia && hora > r.hora && hora < r.hora + r.duracion
      );
      if (yaOmitida) continue;

      const celda = document.createElement("td");
      const reserva = reservasSemana.find(r => r.dia === dia && r.hora === hora);

      if (reserva) {
        const divReserva = document.createElement("div");
        divReserva.className = "reservation-cell ocupado";
        divReserva.textContent = reserva.nombres;
        divReserva.onclick = () => mostrarDetallesReserva(reserva.id);

        celda.rowSpan = reserva.duracion;
        celda.appendChild(divReserva);
      } else {
        const divDisponible = document.createElement("div");
        divDisponible.className = "reservation-cell disponible";
        divDisponible.onclick = () => crearNuevaReserva(dia, hora);
        celda.appendChild(divDisponible);
      }

      fila.appendChild(celda);
    }

    tbody.appendChild(fila);
  });
}



function obtenerReservaPorDiaYHora(dia, hora) {
  return reservasHorarios.find(r => r.dia === dia && hora >= r.hora && hora < r.hora + r.duracion);
}

function estaEnRangoReserva(reserva, hora) {
  return hora > reserva.hora && hora < reserva.hora + reserva.duracion;
}

function irAHoy() {
  semanaActual = new Date();
  actualizarSemanaActual();
  renderizarHorarios();
  mostrarNotificacion("Mostrando semana actual", "success");
}

function cambiarSemana(direccion) {
  semanaActual.setDate(semanaActual.getDate() + direccion * 7);
  semanaActual.setDate(semanaActual.getDate() - semanaActual.getDay() + 1); // Forzar lunes

  actualizarSemanaActual();
  renderizarHorarios();
  mostrarNotificacion(`Mostrando semana ${direccion === 1 ? "siguiente" : "anterior"}`, "info");
}

function actualizarSemanaActual() {
  const inicioSemana = new Date(semanaActual);
  inicioSemana.setDate(semanaActual.getDate() - semanaActual.getDay() + 1);
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(inicioSemana.getDate() + 6);

  const formato = { day: "numeric", month: "long", year: "numeric" };
  document.getElementById("current-week").textContent =
    `Semana del ${inicioSemana.toLocaleDateString("es-ES", formato)} - ${finSemana.toLocaleDateString("es-ES", formato)}`;
}

function actualizarHorarios() {
  mostrarNotificacion("Actualizando horarios...", "info");
  const btnRefresh = document.querySelector(".btn-refresh i");
  btnRefresh.style.animation = "spin 1s linear infinite";

  setTimeout(() => {
    btnRefresh.style.animation = "";
    cargarReservasDesdeBD();
    mostrarNotificacion("Horarios actualizados exitosamente", "success");
  }, 1500);
}

function mostrarDetallesReserva(id) {
  const r = reservasHorarios.find(r => r.id === id);
  if (!r) return;

  const diaTexto = diasSemana[r.dia - 1];
  const horaInicio = `${r.hora.toString().padStart(2, "0")}:00`;
  const horaFin = `${(r.hora + r.duracion).toString().padStart(2, "0")}:00`;

  document.getElementById("reservation-details").innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <h4 style="color: #c40000;">Información de la Reserva</h4>
        <p><strong>Nombre:</strong> ${r.nombres}</p>
        <p><strong>Teléfono:</strong> ${r.telefono}</p>
        <p><strong>Personas:</strong> ${r.personas}</p>
        <p><strong>Estado:</strong> <span style="background:#fee2e2;color:#dc2626;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500;">Ocupado</span></p>
      </div>
      <div>
        <h4 style="color: #c40000;">Detalles del Horario</h4>
        <p><strong>Día:</strong> ${diaTexto}</p>
        <p><strong>Horario:</strong> ${horaInicio} - ${horaFin}</p>
        <p><strong>Duración:</strong> ${r.duracion} hora(s)</p>
        <p><strong>Campo:</strong> Campo Sintético</p>
      </div>
    </div>
    <div style="margin-top: 20px; border-top: 1px solid #e5e7eb;">
      <h4 style="color: #c40000;">Comentarios</h4>
      <p style="background: #f8fafc; padding: 12px; border-radius: 8px;">${r.comentarios}</p>
    </div>
  `;

  document.getElementById("reservation-modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  document.getElementById("reservation-modal").style.display = "none";
  document.body.style.overflow = "auto";
}

function crearNuevaReserva(dia, hora) {
  const diaTexto = diasSemana[dia - 1];
  const horaTexto = `${hora.toString().padStart(2, "0")}:00`;

  if (confirm(`¿Desea crear una nueva reserva para ${diaTexto} a las ${horaTexto}?`)) {
    mostrarNotificacion("Redirigiendo a registro de reservas...", "info");
    setTimeout(() => {
      window.location.href = "./registroReservas.html";
    }, 1000);
  }
}

function editarReserva() {
  mostrarNotificacion("Redirigiendo a edición de reserva...", "info");
  cerrarModal();
  setTimeout(() => {
    window.location.href = "./gestionReservas.html";
  }, 1000);
}

function actualizarEstadisticas() {
  const totalSlots = 7 * horariosDisponibles.length;
  const ocupados = reservasHorarios.reduce((total, r) => total + r.duracion, 0);
  const disponibles = totalSlots - ocupados;

  const hoyFecha = new Date();
  hoyFecha.setHours(0, 0, 0, 0);

  const reservasHoy = reservasHorarios.filter(r => {
    const [anio, mes, dia] = r.fecha.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.getTime() === hoyFecha.getTime();
  });

  document.getElementById("stat-disponibles").textContent = disponibles;
  document.getElementById("stat-ocupadas").textContent = ocupados;
  document.getElementById("stat-hoy").textContent = reservasHoy.length;
}


function mostrarNotificacion(mensaje, tipo = "info") {
  const noti = document.createElement("div");
  noti.className = `notificacion ${tipo}`;
  noti.textContent = mensaje;
  noti.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    padding: 12px 24px; border-radius: 8px; color: white;
    font-weight: 500; z-index: 1001;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  switch (tipo) {
    case "success": noti.style.background = "#059669"; break;
    case "error": noti.style.background = "#dc2626"; break;
    case "info": default: noti.style.background = "#2563eb";
  }
  document.body.appendChild(noti);
  setTimeout(() => {
    noti.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => noti.remove(), 300);
  }, 3000);
}

// Animación
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

// Sidebar móvil
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("open");
  if (sidebar.classList.contains("open")) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebar-overlay").classList.remove("active");
    document.body.style.overflow = "";
  }
});

window.addEventListener("pageshow", event => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    window.location.reload();
  }
});
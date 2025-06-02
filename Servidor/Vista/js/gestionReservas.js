
let reservas = []
let reservasFiltradas = []
let reservaEditando = null
let paginaActual = 1
const reservasPorPagina = 10

fetch("../../Servidor/Controlador/gestionReservas.php")
  .then((response) => response.json())
  .then((data) => {
    reservas = data.map((reserva) => ({
  ...reserva,
  id: reserva.id_reserva,
  nombre: reserva.nombres,
  telefono: reserva.telefono,
  personas: reserva.num_personas,
  horaEntrada: reserva.hora_entrada.substring(0, 5),
  horaSalida: reserva.hora_salida.substring(0, 5),
  dia: reserva.dia_reserva,  // ✅ aquí se conserva la fecha correctamente
  fechaCreacion: new Date(), // si no usas esto, puedes quitarlo
  comentarios: reserva.comentarios || "",
  estado: reserva.estado.toLowerCase()
}))

    reservasFiltradas = [...reservas]
    renderizarReservas()
    actualizarContadores()
  })
  .catch((error) => {
    console.error("JS Error al obtener las reservas:", error)
  })

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  renderizarReservas()
  actualizarContadores()
})

function setupEventListeners() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")
    })
  })

  document.querySelector(".logout-btn").addEventListener("click", () => {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
      mostrarNotificacion("Sesión cerrada exitosamente", "info")
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal()
  })

  document.getElementById("edit-modal").addEventListener("click", function (e) {
    if (e.target === this) cerrarModal()
  })
}

function renderizarReservas() {
  const tbody = document.getElementById("reservas-tbody")
  const inicio = (paginaActual - 1) * reservasPorPagina
  const fin = inicio + reservasPorPagina
  const reservasPagina = reservasFiltradas.slice(inicio, fin)

  tbody.innerHTML = ""

  if (reservasPagina.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px; color: #6b7280;">
          <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
          No se encontraron reservas
        </td>
      </tr>`
    return
  }
reservasPagina.forEach((reserva, index) => {
  const fila = document.createElement("tr")
  fila.innerHTML = `
    <td><div class="row-number">${inicio + index + 1}</div></td>
    <td>
      <div style="font-weight: 600; color: #1f2937;">${reserva.nombre}</div>
      <div style="font-size: 12px; color: #6b7280;">ID: ${reserva.id}</div>
    </td>
    <td>${reserva.telefono}</td>
    <td>
      <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
        ${reserva.personas} personas
      </span>
    </td>
    <td><span style="text-transform: capitalize; font-weight: 500;">${reserva.dia}</span></td>
    <td><span style="font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${reserva.horaEntrada}:00</span></td>
    <td><span style="font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${reserva.horaSalida}:00</span></td>
    <td><span style="color: #6b7280; font-style: italic;">${reserva.comentarios}</span></td>
    <td><span class="status-badge-table status-${reserva.estado}">${reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}</span></td>
    <td>
      <div class="actions-cell">
        <button class="btn-edit" title="Editar reserva">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn-delete" title="Eliminar reserva">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </td>`

  const btnEditar = fila.querySelector('.btn-edit')
  const btnEliminar = fila.querySelector('.btn-delete')

  btnEditar.addEventListener('click', () => editarReserva(reserva.id))
  btnEliminar.addEventListener('click', () => eliminarReserva(reserva.id))

  tbody.appendChild(fila)
})


  actualizarPaginacion()
}
function filtrarReservas() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filterDay = document.getElementById("filter-day").value;

  reservasFiltradas = reservas.filter((reserva) => {
    const matchesSearch =
      reserva.nombre.toLowerCase().includes(searchTerm) ||
      reserva.telefono.includes(searchTerm) ||
      reserva.comentarios.toLowerCase().includes(searchTerm);
const [anio, mes, dia] = reserva.dia_reserva.split("-");
const fechaReserva = new Date(anio, mes - 1, dia);
const diaSemana = fechaReserva.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();

    const matchesDay = !filterDay || diaSemana === filterDay;

    return matchesSearch && matchesDay;
  });

  paginaActual = 1;
  renderizarReservas();
  actualizarContadores();
}


function limpiarFiltros() {
  document.getElementById("search-input").value = ""
  document.getElementById("filter-day").value = ""
  reservasFiltradas = [...reservas]
  paginaActual = 1
  renderizarReservas()
  actualizarContadores()
  mostrarNotificacion("Filtros limpiados", "info")
}

function editarReserva(id) {
  reservaEditando = reservas.find((r) => r.id === id)
  if (!reservaEditando) return

  document.getElementById("edit-nombre").value = reservaEditando.nombre
  document.getElementById("edit-telefono").value = reservaEditando.telefono
  document.getElementById("edit-personas").value = reservaEditando.personas
  document.getElementById("edit-dia").value = reservaEditando.dia   // <-- AQUÍ
  document.getElementById("edit-hora-entrada").value = reservaEditando.horaEntrada
  document.getElementById("edit-hora-salida").value = reservaEditando.horaSalida
  document.getElementById("edit-comentarios").value = reservaEditando.comentarios

  document.getElementById("edit-modal").style.display = "block"
  document.body.style.overflow = "hidden"
}


function guardarEdicion() {
  if (!reservaEditando) return

  const telefono = document.getElementById("edit-telefono").value.trim()
  const personas = parseInt(document.getElementById("edit-personas").value)
  const dia = document.getElementById("edit-dia").value
  const horaEntrada = document.getElementById("edit-hora-entrada").value
  const horaSalida = document.getElementById("edit-hora-salida").value
  const comentarios = document.getElementById("edit-comentarios").value.trim()

  if (!telefono || !personas || !dia || !horaEntrada || !horaSalida) {
    mostrarNotificacion("Por favor complete todos los campos obligatorios", "error")
    return
  }

  if (horaEntrada >= horaSalida) {
    mostrarNotificacion("La hora de salida debe ser posterior a la entrada", "error")
    return
  }

  fetch("../../Servidor/Controlador/gestionReservas.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accion: "editar",
      id: reservaEditando.id,
      telefono,
      personas,
      dia,
      horaEntrada,
      horaSalida,
      comentarios
    })
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        mostrarNotificacion(res.message, "success")
        window.location.reload()
      } else {
        mostrarNotificacion(res.error || "Error al guardar", "error")
      }
    })
    .catch(() => mostrarNotificacion("Error al conectar con el servidor", "error"))
}

function eliminarReserva(id) {
  const reserva = reservas.find((r) => r.id === id)
  if (!reserva) return

  if (confirm(`¿Deseas desactivar la reserva de ${reserva.nombre}?`)) {
    fetch("../../Servidor/Controlador/gestionReservas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "desactivar", id })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          mostrarNotificacion("Reserva desactivada correctamente", "success")
          reservas = reservas.map((r) =>
            r.id === id ? { ...r, estado: "inactiva" } : r
          )
          filtrarReservas()
        } else {
          mostrarNotificacion(res.error || "No se pudo desactivar", "error")
        }
      })
      .catch(() => mostrarNotificacion("Error de conexión", "error"))
  }
}


function cerrarModal() {
  document.getElementById("edit-modal").style.display = "none"
  document.body.style.overflow = "auto"
  reservaEditando = null
}

function agregarReserva() {
  mostrarNotificacion("Redirigiendo al formulario de registro...", "info")
  setTimeout(() => window.location.href = "registroReservas.html", 1500)
}

function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina)
  if ((direccion === -1 && paginaActual > 1) || (direccion === 1 && paginaActual < totalPaginas)) {
    paginaActual += direccion
    renderizarReservas()
  }
}

function actualizarPaginacion() {
  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina)
  const pageNumbers = document.querySelector(".page-numbers")
  pageNumbers.innerHTML = ""

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button")
    btn.className = `btn-page-number ${i === paginaActual ? "active" : ""}`
    btn.textContent = i
    btn.onclick = () => {
      paginaActual = i
      renderizarReservas()
    }
    pageNumbers.appendChild(btn)
  }

  const btnAnterior = document.querySelector(".btn-page")
  const btnSiguiente = document.querySelectorAll(".btn-page")[1]
  if (btnAnterior) btnAnterior.disabled = paginaActual === 1
  if (btnSiguiente) btnSiguiente.disabled = paginaActual === totalPaginas
}

function actualizarContadores() {
  const totalReservas = reservas.length
  const reservasActivas = reservas.filter((r) => r.estado === "activa").length
  const reservasMostradas = reservasFiltradas.length

  document.getElementById("total-reservas").textContent = `${reservasActivas} Reservas Activas`
  document.getElementById("total-count").textContent = totalReservas
  document.getElementById("showing-count").textContent = reservasMostradas
}

function mostrarNotificacion(mensaje, tipo = "info") {
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion ${tipo}`
  notificacion.textContent = mensaje
  notificacion.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 12px 24px; border-radius: 8px; color: white; font-weight: 500; z-index: 1001; animation: slideInRight 0.3s ease-out; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);`
  notificacion.style.background = tipo === "success" ? "#16a34a" : tipo === "error" ? "#dc2626" : "#2563eb"
  document.body.appendChild(notificacion)
  setTimeout(() => {
    notificacion.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => document.body.contains(notificacion) && document.body.removeChild(notificacion), 300)
  }, 3000)
}

const style = document.createElement("style")
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  .status-badge-table {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
  }

  .status-activa {
    background-color: #dcfce7;
    color: #166534;
  }

  .status-inactiva {
    background-color: #fee2e2;
    color: #991b1b;
  }
`
document.head.appendChild(style)

//EXPORTAR EXCEL XLS
function exportarReservas() {
  const encabezado = [
    "ID",
    "Nombre",
    "Teléfono",
    "Personas",
    "Día",
    "Hora Entrada",
    "Hora Salida",
    "Comentarios",
    "Estado"
  ]

  const filas = reservas.map((r) =>
    [
      r.id,
      r.nombre,
      r.telefono,
      r.personas,
      r.dia,
      r.horaEntrada,
      r.horaSalida,
      r.comentarios,
      r.estado
    ]
    .map(campo => `"${String(campo).replace(/"/g, '""')}"`) // Escapar comillas
    .join(";")
  )

  const contenidoCSV = [encabezado.join(";"), ...filas].join("\n")
  const csvURI = "data:text/csv;charset=utf-8,\uFEFF" + contenidoCSV

  const link = document.createElement("a")
  link.setAttribute("href", encodeURI(csvURI))
  link.setAttribute("download", "reservas.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  mostrarNotificacion("Archivo CSV descargado exitosamente", "success")
}


function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")
  sidebar.classList.toggle("open")
  overlay.classList.toggle("active")
  document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : ""
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    document.getElementById("sidebar").classList.remove("open")
    document.getElementById("sidebar-overlay").classList.remove("active")
    document.body.style.overflow = ""
  }
})

window.addEventListener("pageshow", (event) => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    window.location.reload()
  }
})

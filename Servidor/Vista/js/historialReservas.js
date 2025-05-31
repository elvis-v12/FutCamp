// Variables globales
let historialReservas = []
let historialFiltrado = []
fetch("../../Servidor/Controlador/historialReservas.php")
  .then((response) => response.json())
  .then((data) => {
    historialReservas = data.map((reserva) => ({
      ...reserva,
    }))

    // Aquí puedes llamar a una función para renderizar las reservas en la interfaz
    console.log(historialReservas) // solo como ejemplo
    historialFiltrado = [...historialReservas]
    renderizarHistorial()
    actualizarContadores()
  })
  .catch((error) => {
    console.error("JS Error al obtener las reservas:", error)
  })

let paginaActual = 1
const reservasPorPagina = 10

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  renderizarHistorial()
  actualizarEstadisticas()
  actualizarContadores()
})

// Configurar event listeners
function setupEventListeners() {
  // Event listeners para navegación
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Event listener para logout
  const logoutBtn = document.querySelector(".logout-btn")
  logoutBtn.addEventListener("click", () => {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
      mostrarNotificacion("Sesión cerrada exitosamente", "info")
    }
  })

  // Event listener para cerrar modal con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarModal()
    }
  })

  // Event listener para cerrar modal al hacer click fuera
  document.getElementById("details-modal").addEventListener("click", function (e) {
    if (e.target === this) {
      cerrarModal()
    }
  })
}

// Renderizar tabla de historial simplificada
function renderizarHistorial() {
  const tbody = document.getElementById("historial-tbody")
  const inicio = (paginaActual - 1) * reservasPorPagina
  const fin = inicio + reservasPorPagina
  const reservasPagina = historialFiltrado.slice(inicio, fin)

  tbody.innerHTML = ""

  if (reservasPagina.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-history" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    No se encontraron reservas en el historial
                </td>
            </tr>
        `
    return
  }

  reservasPagina.forEach((reserva) => {
    const fila = document.createElement("tr")

    fila.innerHTML = `
            <td>
                <div style="font-weight: 600; color: #1f2937;">${reserva.nombres}</div>
                <div style="font-size: 12px; color: #6b7280;">ID: ${reserva.id}</div>
            </td>
            <td>
                <span style="text-transform: capitalize; font-weight: 500;">${reserva.dia}</span>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                        ${reserva.horaEntrada} - ${reserva.horaSalida}
                    </span>
                </div>
            </td>
            <td>
                <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                    ${reserva.personas} personas
                </span>
            </td>
            <td>
                <span class="status-badge-table status-${reserva.estado}">
                    ${reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                </span>
            </td>
            <td>
                <span style="color: #6b7280; font-size: 13px;">
                    ${reserva.fechaReserva}
                </span>
            </td>
            <td>
                <button class="btn-details" onclick="mostrarDetalles(${reserva.id})">
                    <i class="fas fa-eye"></i>
                    Detalles
                </button>
            </td>
        `
    tbody.appendChild(fila)
  })

  actualizarPaginacion()
}

// Filtrar historial
function filtrarHistorial() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()
  const filterEstado = document.getElementById("filter-estado").value
  const filterMes = document.getElementById("filter-mes").value

  historialFiltrado = historialReservas.filter((reserva) => {
    const matchesSearch =
      reserva.nombres.toLowerCase().includes(searchTerm) ||
      reserva.telefono.includes(searchTerm) ||
      reserva.codigoEstudiante.includes(searchTerm) ||
      reserva.comentarios.toLowerCase().includes(searchTerm)

    const matchesEstado = !filterEstado || reserva.estado === filterEstado

    const matchesMes = !filterMes || reserva.fechaReserva.getMonth().toString() === filterMes

    return matchesSearch && matchesEstado && matchesMes
  })

  paginaActual = 1
  renderizarHistorial()
  actualizarContadores()
  actualizarEstadisticas()
}

// Limpiar filtros
function limpiarFiltros() {
  document.getElementById("search-input").value = ""
  document.getElementById("filter-estado").value = ""
  document.getElementById("filter-mes").value = ""
  historialFiltrado = [...historialReservas]
  paginaActual = 1
  renderizarHistorial()
  actualizarContadores()
  actualizarEstadisticas()
  mostrarNotificacion("Filtros limpiados", "info")
}

// Actualizar historial
function actualizarHistorial() {
  // Simular actualización de datos
  mostrarNotificacion("Actualizando historial...", "info")

  // Agregar efecto de rotación al icono
  const btnRefresh = document.querySelector(".btn-refresh i")
  btnRefresh.style.animation = "spin 1s linear infinite"

  setTimeout(() => {
    // Quitar animación
    btnRefresh.style.animation = ""

    // Aquí iría la lógica para obtener datos actualizados del servidor
    renderizarHistorial()
    actualizarEstadisticas()
    actualizarContadores()
    mostrarNotificacion("Historial actualizado exitosamente", "success")
  }, 1500)
}

// Mostrar detalles de reserva
function mostrarDetalles(id) {
  const reserva = historialReservas.find((r) => r.id === id)
  if (!reserva) return

  const detailsContent = document.getElementById("details-content")
  detailsContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h4 style="color: #c40000; margin-bottom: 16px; font-size: 16px;">Información Personal</h4>
                <div style="margin-bottom: 12px;">
                    <strong>Nombre:</strong> ${reserva.nombres}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Teléfono:</strong> ${reserva.telefono}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Código:</strong> ${reserva.codigoEstudiante}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Personas:</strong> ${reserva.personas}
                </div>
            </div>
            <div>
                <h4 style="color: #c40000; margin-bottom: 16px; font-size: 16px;">Detalles de Reserva</h4>
                <div style="margin-bottom: 12px;">
                    <strong>Día:</strong> ${reserva.dia}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Horario:</strong> ${reserva.horaEntrada}:00 - ${reserva.horaSalida}:00
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Estado:</strong> 
                    <span class="status-badge-table status-${reserva.estado}">
                        ${reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                    </span>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Fecha Reserva:</strong> ${reserva.fechaReserva.toLocaleDateString("es-ES")}
                </div>
            </div>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <h4 style="color: #c40000; margin-bottom: 12px; font-size: 16px;">Comentarios</h4>
            <p style="background: #f8fafc; padding: 12px; border-radius: 8px; color: #374151;">
                ${reserva.comentarios}
            </p>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 12px; color: #6b7280;">
                <strong>Fecha de creación:</strong> ${reserva.fechaCreacion.toLocaleDateString("es-ES")} a las ${reserva.fechaCreacion.toLocaleTimeString("es-ES")}
            </div>
        </div>
    `

  document.getElementById("details-modal").style.display = "block"
  document.body.style.overflow = "hidden"
}

// Cerrar modal
function cerrarModal() {
  document.getElementById("details-modal").style.display = "none"
  document.body.style.overflow = "auto"
}

// Cambiar página
function cambiarPagina(direccion) {
  const totalPaginas = Math.ceil(historialFiltrado.length / reservasPorPagina)

  if (direccion === -1 && paginaActual > 1) {
    paginaActual--
  } else if (direccion === 1 && paginaActual < totalPaginas) {
    paginaActual++
  }

  renderizarHistorial()
}

// Actualizar paginación
function actualizarPaginacion() {
  const totalPaginas = Math.ceil(historialFiltrado.length / reservasPorPagina)
  const pageNumbers = document.querySelector(".page-numbers")

  pageNumbers.innerHTML = ""

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button")
    btn.className = `btn-page-number ${i === paginaActual ? "active" : ""}`
    btn.textContent = i
    btn.onclick = () => {
      paginaActual = i
      renderizarHistorial()
    }
    pageNumbers.appendChild(btn)
  }

  // Actualizar botones anterior/siguiente
  const btnAnterior = document.querySelector(".btn-page")
  const btnSiguiente = document.querySelectorAll(".btn-page")[1]

  if (btnAnterior) btnAnterior.disabled = paginaActual === 1
  if (btnSiguiente) btnSiguiente.disabled = paginaActual === totalPaginas
}

// Actualizar contadores
function actualizarContadores() {
  const totalReservas = historialReservas.length
  const reservasMostradas = historialFiltrado.length

  document.getElementById("total-historial").textContent = `${totalReservas} Reservas en Historial`
  document.getElementById("total-count").textContent = totalReservas
  document.getElementById("showing-count").textContent = reservasMostradas
}

// Actualizar estadísticas
function actualizarEstadisticas() {
  const confirmadas = historialFiltrado.filter((r) => r.estado === "confirmada").length
  const completadas = historialFiltrado.filter((r) => r.estado === "completada").length
  const canceladas = historialFiltrado.filter((r) => r.estado === "cancelada").length
  const total = historialFiltrado.length

  document.getElementById("stat-confirmadas").textContent = confirmadas
  document.getElementById("stat-completadas").textContent = completadas
  document.getElementById("stat-canceladas").textContent = canceladas
  document.getElementById("stat-total").textContent = total
}

// Exportar historial
function exportarHistorial() {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "ID,Nombres,Teléfono,Personas,Día,Hora Entrada,Hora Salida,Comentarios,Código Estudiante,Estado,Fecha Reserva,Fecha Creación\n" +
    historialReservas
      .map(
        (r) =>
          `${r.id},"${r.nombres}","${r.telefono}",${r.personas},"${r.dia}","${r.horaEntrada}","${r.horaSalida}","${r.comentarios}","${r.codigoEstudiante}","${r.estado}","${r.fechaReserva.toLocaleDateString("es-ES")}","${r.fechaCreacion.toLocaleDateString("es-ES")}"`,
      )
      .join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "historial_reservas.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  mostrarNotificacion("Historial exportado exitosamente", "success")
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion ${tipo}`
  notificacion.textContent = mensaje

  notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `

  switch (tipo) {
    case "success":
      notificacion.style.background = "#059669"
      break
    case "error":
      notificacion.style.background = "#dc2626"
      break
    case "info":
      notificacion.style.background = "#2563eb"
      break
    default:
      notificacion.style.background = "#6b7280"
  }

  document.body.appendChild(notificacion)

  setTimeout(() => {
    notificacion.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion)
      }
    }, 300)
  }, 3000)
}

// Agregar estilos de animación
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`
document.head.appendChild(style)

// Función para manejar responsive - MEJORADA
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")

  sidebar.classList.toggle("open")

  if (sidebar.classList.contains("open")) {
    overlay.classList.add("active")
    document.body.style.overflow = "hidden" // Prevenir scroll
  } else {
    overlay.classList.remove("active")
    document.body.style.overflow = "" // Restaurar scroll
  }
}

// Event listener para redimensionar ventana - MEJORADO
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("sidebar-overlay")

    sidebar.classList.remove("open")
    overlay.classList.remove("active")
    document.body.style.overflow = ""
  }
})

window.addEventListener("pageshow", (event) => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    window.location.reload() // Fuerza recarga real al volver con "atrás"
  }
})

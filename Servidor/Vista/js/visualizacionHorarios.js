// Variables globales
const reservasHorarios = []

let semanaActual = new Date()

const horariosDisponibles = []
for (let i = 8; i <= 22; i++) horariosDisponibles.push(i)

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  cargarReservasDesdeBD()
  actualizarSemanaActual()
})

function cargarReservasDesdeBD() {
  fetch("../Controlador/horario.php")
    .then(res => res.json())
    .then(data => {
      reservasHorarios.length = 0
      reservasHorarios.push(...data)
      renderizarHorarios()
      actualizarEstadisticas()
    })
    .catch(err => {
      console.error("Error al cargar reservas:", err)
      mostrarNotificacion("Error al cargar reservas", "error")
    })
}

function obtenerReservaPorDiaYHora(dia, hora) {
  return reservasHorarios.find(reserva =>
    reserva.dia === dia && hora >= reserva.hora && hora < reserva.hora + reserva.duracion
  )
}

function estaEnRangoReserva(reserva, hora) {
  return hora > reserva.hora && hora < reserva.hora + reserva.duracion
}

function renderizarHorarios() {
  const tbody = document.getElementById("schedule-tbody")
  tbody.innerHTML = ""

  horariosDisponibles.forEach((hora) => {
    const fila = document.createElement("tr")

    const celdaHora = document.createElement("td")
    celdaHora.className = "time-cell"
    celdaHora.textContent = `${hora.toString().padStart(2, "0")}:00`
    fila.appendChild(celdaHora)

    for (let dia = 1; dia <= 7; dia++) {
      const celda = document.createElement("td")
      const reserva = obtenerReservaPorDiaYHora(dia, hora)

      if (reserva) {
        if (hora === reserva.hora) {
          const divReserva = document.createElement("div")
          divReserva.className = "reservation-cell ocupado"
          divReserva.textContent = reserva.nombres
          divReserva.onclick = () => mostrarDetallesReserva(reserva.id)

          if (reserva.duracion > 1) {
            celda.rowSpan = reserva.duracion
          }

          celda.appendChild(divReserva)
        } else if (estaEnRangoReserva(reserva, hora)) {
          celda.style.display = "none"
          continue
        }
      } else {
        const divDisponible = document.createElement("div")
        divDisponible.className = "reservation-cell disponible"
        divDisponible.onclick = () => crearNuevaReserva(dia, hora)
        celda.appendChild(divDisponible)
      }

      fila.appendChild(celda)
    }

    tbody.appendChild(fila)
  })
}

function actualizarEstadisticas() {
  const totalSlots = 7 * horariosDisponibles.length
  const slotsOcupados = reservasHorarios.reduce((total, reserva) => total + reserva.duracion, 0)
  const slotsDisponibles = totalSlots - slotsOcupados
  const hoy = new Date().getDay() || 7
  const reservasHoy = reservasHorarios.filter(r => r.dia === hoy).length

  document.getElementById("stat-disponibles").textContent = slotsDisponibles
  document.getElementById("stat-ocupadas").textContent = slotsOcupados
  document.getElementById("stat-hoy").textContent = reservasHoy
}

function mostrarDetallesReserva(id) {
  const reserva = reservasHorarios.find(r => r.id === id)
  if (!reserva) return

  const detalles = document.getElementById("reservation-details")
  const diaTexto = diasSemana[reserva.dia - 1]
  const horaInicio = `${reserva.hora.toString().padStart(2, "0")}:00`
  const horaFin = `${(reserva.hora + reserva.duracion).toString().padStart(2, "0")}:00`

  detalles.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
            <h4 style="color: #c40000; margin-bottom: 16px; font-size: 16px;">Información de la Reserva</h4>
            <div style="margin-bottom: 12px;"><strong>Nombre:</strong> ${reserva.nombres}</div>
            <div style="margin-bottom: 12px;"><strong>Teléfono:</strong> ${reserva.telefono}</div>
            <div style="margin-bottom: 12px;"><strong>Personas:</strong> ${reserva.personas}</div>
            <div style="margin-bottom: 12px;"><strong>Estado:</strong> <span style="background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">Ocupado</span></div>
        </div>
        <div>
            <h4 style="color: #c40000; margin-bottom: 16px; font-size: 16px;">Detalles del Horario</h4>
            <div style="margin-bottom: 12px;"><strong>Día:</strong> ${diaTexto}</div>
            <div style="margin-bottom: 12px;"><strong>Horario:</strong> ${horaInicio} - ${horaFin}</div>
            <div style="margin-bottom: 12px;"><strong>Duración:</strong> ${reserva.duracion} hora(s)</div>
            <div style="margin-bottom: 12px;"><strong>Campo:</strong> Campo Sintético</div>
        </div>
    </div>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <h4 style="color: #c40000; margin-bottom: 12px; font-size: 16px;">Comentarios</h4>
        <p style="background: #f8fafc; padding: 12px; border-radius: 8px; color: #374151;">
            ${reserva.comentarios}
        </p>
    </div>
  `

  document.getElementById("reservation-modal").style.display = "block"
  document.body.style.overflow = "hidden"
}

function crearNuevaReserva(dia, hora) {
  const diaTexto = diasSemana[dia - 1]
  const horaTexto = `${hora.toString().padStart(2, "0")}:00`

  if (confirm(`¿Desea crear una nueva reserva para ${diaTexto} a las ${horaTexto}?`)) {
    mostrarNotificacion("Redirigiendo a registro de reservas...", "info")
    setTimeout(() => {
      window.location.href = "./registroReservas.html"
    }, 1000)
  }
}

function editarReserva() {
  mostrarNotificacion("Redirigiendo a edición de reserva...", "info")
  cerrarModal()
  setTimeout(() => {
    window.location.href = "./gestionReservas.html"
  }, 1000)
}

function cerrarModal() {
  document.getElementById("reservation-modal").style.display = "none"
  document.body.style.overflow = "auto"
}

function actualizarSemanaActual() {
  const inicioSemana = new Date(semanaActual)
  inicioSemana.setDate(semanaActual.getDate() - semanaActual.getDay() + 1)
  const finSemana = new Date(inicioSemana)
  finSemana.setDate(inicioSemana.getDate() + 6)
  const formatoFecha = { day: "numeric", month: "long", year: "numeric" }
  const textoSemana = `Semana del ${inicioSemana.toLocaleDateString("es-ES", formatoFecha)} - ${finSemana.toLocaleDateString("es-ES", formatoFecha)}`
  document.getElementById("current-week").textContent = textoSemana
}

function cambiarSemana(direccion) {
  const nuevaFecha = new Date(semanaActual)
  nuevaFecha.setDate(nuevaFecha.getDate() + direccion * 7)
  semanaActual = nuevaFecha
  actualizarSemanaActual()
  renderizarHorarios()
  mostrarNotificacion(`Mostrando semana ${direccion === 1 ? "siguiente" : "anterior"}`, "info")
}

function mostrarNotificacion(mensaje, tipo = "info") {
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion ${tipo}`
  notificacion.textContent = mensaje
  notificacion.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 12px 24px;
    border-radius: 8px; color: white; font-weight: 500; z-index: 1001;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `
  switch (tipo) {
    case "success": notificacion.style.background = "#059669"; break
    case "error": notificacion.style.background = "#dc2626"; break
    case "info": notificacion.style.background = "#2563eb"; break
    default: notificacion.style.background = "#6b7280"
  }
  document.body.appendChild(notificacion)
  setTimeout(() => {
    notificacion.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      if (document.body.contains(notificacion)) document.body.removeChild(notificacion)
    }, 300)
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
`
document.head.appendChild(style)

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

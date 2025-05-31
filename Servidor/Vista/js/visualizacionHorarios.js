// Variables globales
const reservasHorarios = [
  {
    id: 1,
    nombres: "Patrik Laura Ynga",
    dia: 1, // Lunes = 1, Martes = 2, etc.
    hora: 9,
    duracion: 3, // 3 horas
    telefono: "958046785",
    personas: 10,
    comentarios: "CAMPO SINTÉTICO",
  },
  {
    id: 2,
    nombres: "Daniel Infante Cornelio",
    dia: 2, // Martes
    hora: 12,
    duracion: 2, // 2 horas
    telefono: "958064756",
    personas: 12,
    comentarios: "CAMPO SINTÉTICO",
  },
  {
    id: 3,
    nombres: "María González López",
    dia: 3, // Miércoles
    hora: 16,
    duracion: 2,
    telefono: "987654321",
    personas: 8,
    comentarios: "CAMPO SINTÉTICO",
  },
  {
    id: 4,
    nombres: "Carlos Rodríguez",
    dia: 5, // Viernes
    hora: 14,
    duracion: 2,
    telefono: "912345678",
    personas: 15,
    comentarios: "CAMPO SINTÉTICO",
  },
]

let semanaActual = new Date()

// Horarios disponibles (8:00 AM a 10:00 PM)
const horariosDisponibles = []
for (let i = 8; i <= 22; i++) {
  horariosDisponibles.push(i)
}

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  renderizarHorarios()
  actualizarEstadisticas()
  actualizarSemanaActual()
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
  document.getElementById("reservation-modal").addEventListener("click", function (e) {
    if (e.target === this) {
      cerrarModal()
    }
  })
}

// Renderizar tabla de horarios simplificada
function renderizarHorarios() {
  const tbody = document.getElementById("schedule-tbody")
  tbody.innerHTML = ""

  horariosDisponibles.forEach((hora) => {
    const fila = document.createElement("tr")

    // Celda de hora
    const celdaHora = document.createElement("td")
    celdaHora.className = "time-cell"
    celdaHora.textContent = `${hora.toString().padStart(2, "0")}:00`
    fila.appendChild(celdaHora)

    // Celdas para cada día de la semana
    for (let dia = 1; dia <= 7; dia++) {
      const celda = document.createElement("td")
      const reserva = obtenerReservaPorDiaYHora(dia, hora)

      if (reserva) {
        // Verificar si es la primera hora de la reserva
        if (hora === reserva.hora) {
          const divReserva = document.createElement("div")
          divReserva.className = "reservation-cell ocupado"
          divReserva.textContent = reserva.nombres
          divReserva.onclick = () => mostrarDetallesReserva(reserva.id)

          // Hacer que la celda ocupe múltiples filas si la duración es mayor a 1
          if (reserva.duracion > 1) {
            celda.rowSpan = reserva.duracion
          }

          celda.appendChild(divReserva)
        } else if (estaEnRangoReserva(reserva, hora)) {
          // Esta celda está ocupada por una reserva que comenzó antes
          celda.style.display = "none"
          continue
        }
      } else {
        // Celda disponible
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

// Obtener reserva por día y hora
function obtenerReservaPorDiaYHora(dia, hora) {
  return reservasHorarios.find((reserva) => {
    return reserva.dia === dia && hora >= reserva.hora && hora < reserva.hora + reserva.duracion
  })
}

// Verificar si una hora está en el rango de una reserva
function estaEnRangoReserva(reserva, hora) {
  return hora > reserva.hora && hora < reserva.hora + reserva.duracion
}

// Ir a hoy
function irAHoy() {
  semanaActual = new Date()
  actualizarSemanaActual()
  renderizarHorarios()
  mostrarNotificacion("Mostrando semana actual", "success")
}

// Cambiar semana
function cambiarSemana(direccion) {
  const nuevaFecha = new Date(semanaActual)
  nuevaFecha.setDate(nuevaFecha.getDate() + direccion * 7)
  semanaActual = nuevaFecha

  actualizarSemanaActual()
  renderizarHorarios()

  const textoDir = direccion === 1 ? "siguiente" : "anterior"
  mostrarNotificacion(`Mostrando semana ${textoDir}`, "info")
}

// Actualizar texto de semana actual
function actualizarSemanaActual() {
  const inicioSemana = new Date(semanaActual)
  inicioSemana.setDate(semanaActual.getDate() - semanaActual.getDay() + 1)

  const finSemana = new Date(inicioSemana)
  finSemana.setDate(inicioSemana.getDate() + 6)

  const formatoFecha = { day: "numeric", month: "long", year: "numeric" }
  const textoSemana = `Semana del ${inicioSemana.toLocaleDateString("es-ES", formatoFecha)} - ${finSemana.toLocaleDateString("es-ES", formatoFecha)}`

  document.getElementById("current-week").textContent = textoSemana
}

// Actualizar horarios
function actualizarHorarios() {
  mostrarNotificacion("Actualizando horarios...", "info")

  // Agregar efecto de rotación al icono
  const btnRefresh = document.querySelector(".btn-refresh i")
  btnRefresh.style.animation = "spin 1s linear infinite"

  setTimeout(() => {
    // Quitar animación
    btnRefresh.style.animation = ""

    // Simular actualización de datos
    renderizarHorarios()
    actualizarEstadisticas()
    mostrarNotificacion("Horarios actualizados exitosamente", "success")
  }, 1500)
}

// Mostrar detalles de reserva
function mostrarDetallesReserva(id) {
  const reserva = reservasHorarios.find((r) => r.id === id)
  if (!reserva) return

  const detalles = document.getElementById("reservation-details")
  const diaTexto = diasSemana[reserva.dia - 1]
  const horaInicio = `${reserva.hora.toString().padStart(2, "0")}:00`
  const horaFin = `${(reserva.hora + reserva.duracion).toString().padStart(2, "0")}:00`

  detalles.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h4 style="color: #c40000; margin-bottom: 16px; font-size: 16px;">Información de la Reserva</h4>
                <div style="margin-bottom: 12px;">
                    <strong>Nombre:</strong> ${reserva.nombres}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Teléfono:</strong> ${reserva.telefono}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Personas:</strong> ${reserva.personas}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Estado:</strong> 
                    <span style="background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                        Ocupado
                    </span>
                </div>
            </div>
            <div>
                <h4 style="color: #c40000; margin-bottom: 16px; font-size: 16px;">Detalles del Horario</h4>
                <div style="margin-bottom: 12px;">
                    <strong>Día:</strong> ${diaTexto}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Horario:</strong> ${horaInicio} - ${horaFin}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Duración:</strong> ${reserva.duracion} hora(s)
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Campo:</strong> Campo Sintético
                </div>
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

// Crear nueva reserva
function crearNuevaReserva(dia, hora) {
  const diaTexto = diasSemana[dia - 1]
  const horaTexto = `${hora.toString().padStart(2, "0")}:00`

  if (confirm(`¿Desea crear una nueva reserva para ${diaTexto} a las ${horaTexto}?`)) {
    mostrarNotificacion("Redirigiendo a registro de reservas...", "info")
    // Aquí se redirigiría al formulario de registro con los datos prellenados
    setTimeout(() => {
      window.location.href = "./registroReservas.html"
    }, 1000)
  }
}

// Editar reserva
function editarReserva() {
  mostrarNotificacion("Redirigiendo a edición de reserva...", "info")
  cerrarModal()
  // Aquí se redirigiría al formulario de edición
  setTimeout(() => {
    window.location.href = "./gestionReservas.html"
  }, 1000)
}

// Cerrar modal
function cerrarModal() {
  document.getElementById("reservation-modal").style.display = "none"
  document.body.style.overflow = "auto"
}

// Actualizar estadísticas simplificadas
function actualizarEstadisticas() {
  const totalSlots = 7 * horariosDisponibles.length // 7 días × horas disponibles
  const slotsOcupados = reservasHorarios.reduce((total, reserva) => total + reserva.duracion, 0)
  const slotsDisponibles = totalSlots - slotsOcupados

  // Reservas de hoy (simulado - día actual)
  const hoy = new Date().getDay() || 7 // Convertir domingo (0) a 7
  const reservasHoy = reservasHorarios.filter((r) => r.dia === hoy).length

  document.getElementById("stat-disponibles").textContent = slotsDisponibles
  document.getElementById("stat-ocupadas").textContent = slotsOcupados
  document.getElementById("stat-hoy").textContent = reservasHoy
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

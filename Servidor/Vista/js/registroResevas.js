// Función para manejar responsive - MOVIDA AL INICIO
function toggleSidebar() {
  console.log("toggleSidebar llamada") // Debug

  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")

  console.log("Sidebar:", sidebar) // Debug
  console.log("Overlay:", overlay) // Debug

  if (!sidebar || !overlay) {
    console.error("No se encontraron los elementos sidebar u overlay")
    return
  }

  sidebar.classList.toggle("open")
  console.log("Sidebar classes:", sidebar.classList.toString()) // Debug

  if (sidebar.classList.contains("open")) {
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
    console.log("Sidebar abierto") // Debug
  } else {
    overlay.classList.remove("active")
    document.body.style.overflow = ""
    console.log("Sidebar cerrado") // Debug
  }
}

// Event listener para redimensionar ventana
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("sidebar-overlay")

    if (sidebar && overlay) {
      sidebar.classList.remove("open")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    }
  }
})

window.addEventListener("pageshow", (event) => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    window.location.reload()
  }
})

// Datos simulados de reservas existentes (base de datos)
const reservasExistentes = {
  "lunes-10:00": true,
  "lunes-14:00": true,
  "martes-09:00": true,
  "martes-16:00": true,
  "miercoles-11:00": true,
  "miercoles-15:00": true,
  "jueves-13:00": true,
  "viernes-10:00": true,
  "viernes-17:00": true,
  "sabado-08:00": true,
  "sabado-12:00": true,
  "sabado-18:00": true,
  "domingo-14:00": true,
  "domingo-19:00": true,
}

// Generar la tabla de horarios
function initializeScheduleTable() {
  const scheduleBody = document.getElementById("schedule-body")
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]
  const weekDays = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]

  scheduleBody.innerHTML = ""

  timeSlots.forEach((time, index) => {
    const row = document.createElement("tr")

    // Celda de hora
    const timeCell = document.createElement("td")
    timeCell.className = "time-cell"
    timeCell.textContent = time
    row.appendChild(timeCell)

    // Celdas de días
    weekDays.forEach((day) => {
      const dayCell = document.createElement("td")
      const slotDiv = document.createElement("div")
      const slotId = `${day}-${time}`

      // Verificar si el horario está ocupado en la base de datos
      const isOccupied = reservasExistentes[slotId] || false

      slotDiv.className = isOccupied ? "slot-cell occupied" : "slot-cell available"
      slotDiv.setAttribute("data-time", time)
      slotDiv.setAttribute("data-day", day)

      const slotText = document.createElement("span")
      slotText.className = "slot-text"
      slotText.textContent = isOccupied ? "Ocupado" : "Disponible"

      slotDiv.appendChild(slotText)
      dayCell.appendChild(slotDiv)
      row.appendChild(dayCell)

      // NO agregar evento click - solo mostrar información
    })

    scheduleBody.appendChild(row)
  })
}

// Función para actualizar horarios desde la base de datos
function actualizarHorariosDesdeDB() {
  console.log("Actualizando horarios desde la base de datos...")
  initializeScheduleTable()
  mostrarNotificacion("Horarios actualizados desde la base de datos", "info")
}

// Funciones del formulario
function reservar() {
  const codigo = document.getElementById("codigo").value
  const nombre = document.getElementById("nombre").value
  const telefono = document.getElementById("telefono").value
  const personas = document.getElementById("personas").value
  const dia = document.getElementById("dia").value
  const horaEntrada = document.getElementById("hora-entrada").value
  const horaSalida = document.getElementById("hora-salida").value
  const comentarios = document.getElementById("comentarios").value

  if (!codigo || !nombre || !telefono || !personas || !dia || !horaEntrada || !horaSalida) {
    mostrarNotificacion("Por favor complete todos los campos obligatorios", "error")
    return
  }

  // Simular reserva
  mostrarNotificacion("Reserva creada exitosamente", "success")
  limpiarCampos()
}

function limpiarCampos() {
  document.getElementById("codigo").value = ""
  document.getElementById("nombre").value = ""
  document.getElementById("telefono").value = ""
  document.getElementById("personas").value = ""
  document.getElementById("dia").value = ""
  document.getElementById("hora-entrada").value = ""
  document.getElementById("hora-salida").value = ""
  document.getElementById("comentarios").value = ""

  mostrarNotificacion("Campos limpiados", "info")
}

// Agregar estilos adicionales para los estados disponible/ocupado
const additionalStyles = document.createElement("style")
additionalStyles.textContent = `
    .slot-cell.available {
        background: #dcfce7 !important;
        border: 2px solid #16a34a;
    }
    
    .slot-cell.available .slot-text {
        color: #16a34a;
        font-weight: 600;
    }
    
    .slot-cell.occupied {
        background: #fee2e2 !important;
        border: 2px solid #dc2626;
        cursor: not-allowed;
    }
    
    .slot-cell.occupied .slot-text {
        color: #dc2626;
        font-weight: 600;
    }
    
    .slot-cell:hover {
        transform: none !important;
    }
    
    .slot-cell.available:hover {
        background: #bbf7d0 !important;
    }
    
    .slot-cell.occupied:hover {
        background: #fecaca !important;
    }
`
document.head.appendChild(additionalStyles)

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

// Agregar estilos de animación para notificaciones
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
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
document.head.appendChild(notificationStyles)

// Inicializar cuando el DOM esté listo - CORREGIDO
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado") // Debug

  // Inicializar tabla
  initializeScheduleTable()

  // Configurar botón hamburguesa
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const overlay = document.getElementById("sidebar-overlay")

  console.log("Mobile menu btn:", mobileMenuBtn) // Debug
  console.log("Overlay:", overlay) // Debug

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Botón hamburguesa clickeado") // Debug
      toggleSidebar()
    })
  } else {
    console.error("No se encontró el botón de menú móvil")
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      console.log("Overlay clickeado") // Debug
      toggleSidebar()
    })
  } else {
    console.error("No se encontró el overlay")
  }
})

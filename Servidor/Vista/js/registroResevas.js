// Función para manejar responsive - Mejorada
function toggleSidebar() {
  console.log("toggleSidebar llamada")

  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")

  console.log("Sidebar:", sidebar)
  console.log("Overlay:", overlay)

  if (!sidebar || !overlay) {
    console.error("No se encontraron los elementos sidebar u overlay")
    return
  }

  sidebar.classList.toggle("open")
  console.log("Sidebar classes:", sidebar.classList.toString())

  if (sidebar.classList.contains("open")) {
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
    console.log("Sidebar abierto")
  } else {
    overlay.classList.remove("active")
    document.body.style.overflow = ""
    console.log("Sidebar cerrado")
  }
}

// Función para manejar el menú de navegación móvil - NUEVA
function toggleMobileNav() {
  const mobileNavMenu = document.getElementById("mobile-nav-menu")

  if (!mobileNavMenu) {
    console.error("No se encontró el menú de navegación móvil")
    return
  }

  mobileNavMenu.classList.toggle("active")
}

// Event listener para redimensionar ventana - Mejorado
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("sidebar-overlay")
    const mobileNavMenu = document.getElementById("mobile-nav-menu")

    if (sidebar && overlay) {
      sidebar.classList.remove("open")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    }

    if (mobileNavMenu) {
      mobileNavMenu.classList.remove("active")
    }
  }
})

// Prevenir cache en navegación
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

  timeSlots.forEach((time) => {
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

// Función para mostrar notificaciones - Mejorada
function mostrarNotificacion(mensaje, tipo = "info") {
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion ${tipo}`
  notificacion.textContent = mensaje

  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    z-index: 1003;
    animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    max-width: 300px;
    word-wrap: break-word;
  `

  switch (tipo) {
    case "success":
      notificacion.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)"
      break
    case "error":
      notificacion.style.background = "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
      break
    case "info":
      notificacion.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
      break
    default:
      notificacion.style.background = "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
  }

  document.body.appendChild(notificacion)

  setTimeout(() => {
    notificacion.style.animation = "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion)
      }
    }, 400)
  }, 4000)
}

// Agregar estilos de animación para notificaciones - Mejorados
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    to {
      transform: translateX(100%) scale(0.8);
      opacity: 0;
    }
  }
`
document.head.appendChild(notificationStyles)

// Función para manejar el teclado en móvil
function handleMobileKeyboard() {
  if (window.innerWidth <= 768) {
    // Detectar cuando se abre el teclado virtual
    window.addEventListener("resize", () => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        // Ajustar viewport cuando el teclado está abierto
        setTimeout(() => {
          document.activeElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 300)
      }
    })
  }
}

// Inicializar cuando el DOM esté listo - Mejorado
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado")

  // Inicializar tabla
  initializeScheduleTable()

  // Configurar botón hamburguesa
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const overlay = document.getElementById("sidebar-overlay")

  console.log("Mobile menu btn:", mobileMenuBtn)
  console.log("Overlay:", overlay)

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Botón hamburguesa clickeado")
      toggleSidebar()
    })
  } else {
    console.error("No se encontró el botón de menú móvil")
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Overlay clickeado")
      toggleSidebar()
    })
  } else {
    console.error("No se encontró el overlay")
  }

  // Configurar botón de navegación móvil
  const mobileNavBtn = document.getElementById("mobile-nav-button")
  const mobileNavClose = document.getElementById("mobile-nav-close")

  if (mobileNavBtn) {
    mobileNavBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Botón de navegación móvil clickeado")
      toggleMobileNav()
    })
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Botón cerrar navegación móvil clickeado")
      toggleMobileNav()
    })
  }

  // Inicializar manejo de teclado móvil
  handleMobileKeyboard()

  // Cerrar sidebar al hacer clic en enlaces de navegación en móvil
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        const sidebar = document.getElementById("sidebar")
        const overlay = document.getElementById("sidebar-overlay")

        if (sidebar && overlay) {
          sidebar.classList.remove("open")
          overlay.classList.remove("active")
          document.body.style.overflow = ""
        }
      }
    })
  })

  // Cerrar menú de navegación móvil al hacer clic en un enlace
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item")
  mobileNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const mobileNavMenu = document.getElementById("mobile-nav-menu")
      if (mobileNavMenu) {
        mobileNavMenu.classList.remove("active")
      }
    })
  })

  // Prevenir zoom en inputs en iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.style.fontSize = "16px"
      })
    })
  }

  // Mostrar notificación de bienvenida
  setTimeout(() => {
    mostrarNotificacion("Sistema de reservas cargado correctamente", "success")
  }, 1000)
})

// Función para manejar orientación en móvil
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    // Cerrar sidebar si está abierto al cambiar orientación
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("sidebar-overlay")
    const mobileNavMenu = document.getElementById("mobile-nav-menu")

    if (sidebar && overlay && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open")
      overlay.classList.remove("active")
      document.body.style.overflow = ""
    }

    if (mobileNavMenu && mobileNavMenu.classList.contains("active")) {
      mobileNavMenu.classList.remove("active")
    }
  }, 100)
})

// Función para optimizar rendimiento en scroll
let ticking = false

function updateScrollPosition() {
  // Aquí puedes agregar lógica adicional para el scroll si es necesario
  ticking = false
}

document.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition)
      ticking = true
    }
  },
  { passive: true },
)

// Cerrar menú de navegación móvil al hacer clic fuera
document.addEventListener("click", (e) => {
  const mobileNavMenu = document.getElementById("mobile-nav-menu")
  const mobileNavButton = document.getElementById("mobile-nav-button")

  if (
    mobileNavMenu &&
    mobileNavMenu.classList.contains("active") &&
    mobileNavButton &&
    !mobileNavMenu.contains(e.target) &&
    !mobileNavButton.contains(e.target)
  ) {
    mobileNavMenu.classList.remove("active")
  }
})



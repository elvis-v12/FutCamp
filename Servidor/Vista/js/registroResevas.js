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
  // Simular llamada a la base de datos
  console.log("Actualizando horarios desde la base de datos...")

  // Aquí iría la lógica real para obtener datos del servidor
  // Por ahora simulamos con datos estáticos

  // Regenerar la tabla con los datos actualizados
  initializeScheduleTable()

  mostrarNotificacion("Horarios actualizados desde la base de datos", "info")
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

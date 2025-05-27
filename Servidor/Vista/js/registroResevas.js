// Variables globales
let selectedSlots = [];

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeScheduleTable();
    setupEventListeners();
});

// Generar la tabla de horarios
function initializeScheduleTable() {
    const scheduleBody = document.getElementById('schedule-body');
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
    ];
    const weekDays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    scheduleBody.innerHTML = '';

    timeSlots.forEach((time, index) => {
        const row = document.createElement('tr');
        
        // Celda de hora
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.textContent = time;
        row.appendChild(timeCell);

        // Celdas de días
        weekDays.forEach(day => {
            const dayCell = document.createElement('td');
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot-cell';
            slotDiv.setAttribute('data-time', time);
            slotDiv.setAttribute('data-day', day);
            
            const slotText = document.createElement('span');
            slotText.className = 'slot-text';
            slotText.textContent = 'Disponible';
            
            slotDiv.appendChild(slotText);
            dayCell.appendChild(slotDiv);
            row.appendChild(dayCell);

            // Agregar evento click
            slotDiv.addEventListener('click', function() {
                toggleSlotSelection(this);
            });
        });

        scheduleBody.appendChild(row);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para los botones de navegación
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Agregar clase active al item clickeado
            this.classList.add('active');
        });
    });

    // Event listener para el botón de logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            alert('Sesión cerrada exitosamente');
            // Aquí iría la lógica de logout real
        }
    });

    // Event listener para el botón de búsqueda
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        buscarEstudiante();
    });

    // Event listener para validación en tiempo real
    const codigoInput = document.getElementById('codigo');
    codigoInput.addEventListener('input', function() {
        if (this.value.length >= 3) {
            // Simular búsqueda automática
            setTimeout(() => {
                if (this.value === '12345') {
                    document.getElementById('nombre').value = 'Juan Pérez García';
                    document.getElementById('telefono').value = '555-0123';
                }
            }, 500);
        }
    });
}

// Función para seleccionar/deseleccionar slots de horario
function toggleSlotSelection(slotElement) {
    const time = slotElement.getAttribute('data-time');
    const day = slotElement.getAttribute('data-day');
    const slotId = `${day}-${time}`;

    if (slotElement.classList.contains('selected')) {
        // Deseleccionar
        slotElement.classList.remove('selected');
        slotElement.style.background = '#dcfce7';
        slotElement.querySelector('.slot-text').textContent = 'Disponible';
        selectedSlots = selectedSlots.filter(slot => slot !== slotId);
    } else {
        // Seleccionar
        slotElement.classList.add('selected');
        slotElement.style.background = '#3b82f6';
        slotElement.style.color = 'white';
        slotElement.querySelector('.slot-text').textContent = 'Seleccionado';
        selectedSlots.push(slotId);
        
        // Auto-llenar los campos de día y hora si no están llenos
        const diaSelect = document.getElementById('dia');
        const horaEntrada = document.getElementById('hora-entrada');
        
        if (!diaSelect.value) {
            diaSelect.value = day;
        }
        if (!horaEntrada.value) {
            horaEntrada.value = time;
        }
    }

    console.log('Slots seleccionados:', selectedSlots);
}

// Función para buscar estudiante
function buscarEstudiante() {
    const codigo = document.getElementById('codigo').value;
    
    if (!codigo) {
        alert('Por favor ingrese un código de estudiante');
        return;
    }

    // Simular búsqueda en base de datos
    const estudiantes = {
        '12345': {
            nombre: 'Juan Pérez García',
            telefono: '555-0123'
        },
        '67890': {
            nombre: 'María González López',
            telefono: '555-0456'
        },
        '11111': {
            nombre: 'Carlos Rodríguez Martín',
            telefono: '555-0789'
        }
    };

    if (estudiantes[codigo]) {
        document.getElementById('nombre').value = estudiantes[codigo].nombre;
        document.getElementById('telefono').value = estudiantes[codigo].telefono;
        
        // Mostrar mensaje de éxito
        mostrarNotificacion('Estudiante encontrado exitosamente', 'success');
    } else {
        mostrarNotificacion('Estudiante no encontrado', 'error');
        document.getElementById('nombre').value = '';
        document.getElementById('telefono').value = '';
    }
}

// Función para realizar la reserva
function reservar() {
    // Obtener todos los valores del formulario
    const formData = {
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        personas: document.getElementById('personas').value,
        dia: document.getElementById('dia').value,
        horaEntrada: document.getElementById('hora-entrada').value,
        horaSalida: document.getElementById('hora-salida').value,
        comentarios: document.getElementById('comentarios').value
    };

    // Validar campos obligatorios
    if (!formData.codigo || !formData.nombre || !formData.telefono || 
        !formData.personas || !formData.dia || !formData.horaEntrada || !formData.horaSalida) {
        mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
        return;
    }

    // Validar que la hora de salida sea posterior a la de entrada
    if (formData.horaEntrada >= formData.horaSalida) {
        mostrarNotificacion('La hora de salida debe ser posterior a la hora de entrada', 'error');
        return;
    }

    // Simular guardado de reserva
    console.log('Datos de la reserva:', formData);
    console.log('Slots seleccionados:', selectedSlots);

    // Mostrar confirmación
    mostrarNotificacion('Reserva realizada exitosamente', 'success');
    
    // Limpiar formulario después de 2 segundos
    setTimeout(() => {
        limpiarCampos();
    }, 2000);
}

// Función para limpiar todos los campos
function limpiarCampos() {
    // Limpiar inputs
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('personas').value = '';
    document.getElementById('dia').value = '';
    document.getElementById('hora-entrada').value = '';
    document.getElementById('hora-salida').value = '';
    document.getElementById('comentarios').value = '';

    // Limpiar slots seleccionados
    selectedSlots.forEach(slotId => {
        const [day, time] = slotId.split('-');
        const slotElement = document.querySelector(`[data-day="${day}"][data-time="${time}"]`);
        if (slotElement) {
            slotElement.classList.remove('selected');
            slotElement.style.background = '#dcfce7';
            slotElement.style.color = '';
            slotElement.querySelector('.slot-text').textContent = 'Disponible';
        }
    });
    selectedSlots = [];

    mostrarNotificacion('Campos limpiados exitosamente', 'info');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

    // Estilos para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    // Colores según el tipo
    switch(tipo) {
        case 'success':
            notificacion.style.background = '#16a34a';
            break;
        case 'error':
            notificacion.style.background = '#dc2626';
            break;
        case 'info':
            notificacion.style.background = '#2563eb';
            break;
        default:
            notificacion.style.background = '#6b7280';
    }

    // Agregar al DOM
    document.body.appendChild(notificacion);

    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Función para manejar responsive (opcional)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Event listener para redimensionar ventana
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});
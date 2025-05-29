// Variables globales
let reservas = [];
let reservasFiltradas = [];
fetch("../../Servidor/Controlador/gestionReservas.php")
    .then(response => response.json())
    .then(data => {
        reservas = data.map(reserva => ({
            ...reserva,
            fechaCreacion: new Date(reserva.fechaCreacion) // Convertir fecha desde string
        }));

        // Aquí puedes llamar a una función para renderizar las reservas en la interfaz
        console.log(reservas); // solo como ejemplo
        reservasFiltradas = [...reservas];
        renderizarReservas();
        actualizarContadores();
    })
    .catch(error => {
        console.error("JS Error al obtener las reservas:", error);
    });

let reservaEditando = null;
let paginaActual = 1;
const reservasPorPagina = 10;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderizarReservas();
    actualizarContadores();
});

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para navegación
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Event listener para logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            mostrarNotificacion('Sesión cerrada exitosamente', 'info');
        }
    });

    // Event listener para cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });

    // Event listener para cerrar modal al hacer click fuera
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModal();
        }
    });
}

// Renderizar tabla de reservas
function renderizarReservas() {
    const tbody = document.getElementById('reservas-tbody');
    const inicio = (paginaActual - 1) * reservasPorPagina;
    const fin = inicio + reservasPorPagina;
    const reservasPagina = reservasFiltradas.slice(inicio, fin);

    tbody.innerHTML = '';

    if (reservasPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    No se encontraron reservas
                </td>
            </tr>
        `;
        return;
    }

    reservasPagina.forEach((reserva, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <div class="row-number">${inicio + index + 1}</div>
            </td>
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
            <td>
                <span style="text-transform: capitalize; font-weight: 500;">${reserva.dia}</span>
            </td>
            <td>
                <span style="font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">
                    ${reserva.horaEntrada}:00
                </span>
            </td>
            <td>
                <span style="font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">
                    ${reserva.horaSalida}:00
                </span>
            </td>
            <td>
                <span style="color: #6b7280; font-style: italic;">${reserva.comentarios}</span>
            </td>
            <td>
                <span class="status-badge-table status-${reserva.estado}">
                    ${reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn-edit" onclick="editarReserva(${reserva.id})" title="Editar reserva">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn-delete" onclick="eliminarReserva(${reserva.id})" title="Eliminar reserva">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });

    actualizarPaginacion();
}

// Filtrar reservas
function filtrarReservas() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterDay = document.getElementById('filter-day').value;

    reservasFiltradas = reservas.filter(reserva => {
        const matchesSearch = 
            reserva.nombre.toLowerCase().includes(searchTerm) ||
            reserva.telefono.includes(searchTerm) ||
            reserva.comentarios.toLowerCase().includes(searchTerm);
        
        const matchesDay = !filterDay || reserva.dia === filterDay;

        return matchesSearch && matchesDay;
    });

    paginaActual = 1;
    renderizarReservas();
    actualizarContadores();
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-day').value = '';
    reservasFiltradas = [...reservas];
    paginaActual = 1;
    renderizarReservas();
    actualizarContadores();
    mostrarNotificacion('Filtros limpiados', 'info');
}

// Editar reserva
function editarReserva(id) {
    reservaEditando = reservas.find(r => r.id === id);
    if (!reservaEditando) return;

    // Llenar el formulario del modal
    document.getElementById('edit-nombre').value = reservaEditando.nombre;
    document.getElementById('edit-telefono').value = reservaEditando.telefono;
    document.getElementById('edit-personas').value = reservaEditando.personas;
    document.getElementById('edit-dia').value = reservaEditando.dia;
    document.getElementById('edit-hora-entrada').value = reservaEditando.horaEntrada;
    document.getElementById('edit-hora-salida').value = reservaEditando.horaSalida;
    document.getElementById('edit-comentarios').value = reservaEditando.comentarios;

    // Mostrar modal
    document.getElementById('edit-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Guardar edición
function guardarEdicion() {
    if (!reservaEditando) return;

    // Validar formulario
    const nombre = document.getElementById('edit-nombre').value.trim();
    const telefono = document.getElementById('edit-telefono').value.trim();
    const personas = parseInt(document.getElementById('edit-personas').value);
    const dia = document.getElementById('edit-dia').value;
    const horaEntrada = document.getElementById('edit-hora-entrada').value;
    const horaSalida = document.getElementById('edit-hora-salida').value;
    const comentarios = document.getElementById('edit-comentarios').value.trim();

    if (!nombre || !telefono || !personas || !dia || !horaEntrada || !horaSalida) {
        mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
        return;
    }

    if (horaEntrada >= horaSalida) {
        mostrarNotificacion('La hora de salida debe ser posterior a la hora de entrada', 'error');
        return;
    }

    // Actualizar reserva
    const index = reservas.findIndex(r => r.id === reservaEditando.id);
    if (index !== -1) {
        reservas[index] = {
            ...reservaEditando,
            nombre,
            telefono,
            personas,
            dia,
            horaEntrada,
            horaSalida,
            comentarios
        };

        // Actualizar reservas filtradas
        filtrarReservas();
        cerrarModal();
        mostrarNotificacion('Reserva actualizada exitosamente', 'success');
    }
}

// Eliminar reserva
function eliminarReserva(id) {
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return;

    if (confirm(`¿Está seguro que desea eliminar la reserva de ${reserva.nombre}?`)) {
        reservas = reservas.filter(r => r.id !== id);
        filtrarReservas();
        mostrarNotificacion('Reserva eliminada exitosamente', 'success');
    }
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    reservaEditando = null;
}

// Agregar nueva reserva
function agregarReserva() {
    mostrarNotificacion('Redirigiendo al formulario de registro...', 'info');
    // Aquí iría la lógica para navegar al formulario de registro
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Cambiar página
function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
    
    if (direccion === -1 && paginaActual > 1) {
        paginaActual--;
    } else if (direccion === 1 && paginaActual < totalPaginas) {
        paginaActual++;
    }
    
    renderizarReservas();
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
    const pageNumbers = document.querySelector('.page-numbers');
    
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = `btn-page-number ${i === paginaActual ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            paginaActual = i;
            renderizarReservas();
        };
        pageNumbers.appendChild(btn);
    }

    // Actualizar botones anterior/siguiente
    const btnAnterior = document.querySelector('.btn-page');
    const btnSiguiente = document.querySelectorAll('.btn-page')[1];
    
    if (btnAnterior) btnAnterior.disabled = paginaActual === 1;
    if (btnSiguiente) btnSiguiente.disabled = paginaActual === totalPaginas;
}

// Actualizar contadores
function actualizarContadores() {
    const totalReservas = reservas.length;
    const reservasActivas = reservas.filter(r => r.estado === 'activa').length;
    const reservasMostradas = reservasFiltradas.length;

    document.getElementById('total-reservas').textContent = `${reservasActivas} Reservas Activas`;
    document.getElementById('total-count').textContent = totalReservas;
    document.getElementById('showing-count').textContent = reservasMostradas;
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;

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
    `;

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

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
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
`;
document.head.appendChild(style);

// Función para exportar datos (funcionalidad adicional)
function exportarReservas() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Nombre,Teléfono,Personas,Día,Hora Entrada,Hora Salida,Comentarios,Estado\n"
        + reservas.map(r => 
            `${r.id},"${r.nombre}",${r.telefono},${r.personas},${r.dia},${r.horaEntrada},${r.horaSalida},"${r.comentarios}",${r.estado}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reservas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    mostrarNotificacion('Archivo CSV descargado exitosamente', 'success');
}

// Función para manejar responsive
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
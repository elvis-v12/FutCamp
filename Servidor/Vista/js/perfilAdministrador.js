// Variables globales
let modoEdicion = false;
let datosOriginales = {};

// Datos del administrador (estos vendrían de la base de datos PHP)
let adminData = {
    id: 1,
    nombre: "Juan Carlos",
    apellido: "Pérez González",
    email: "admin@sistemadeportivo.com",
    usuario: "admin_principal"
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    cargarDatosAdmin();
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
}

// Cargar datos del administrador
function cargarDatosAdmin() {
    // Cargar información del administrador
    document.getElementById('nombre').value = adminData.nombre;
    document.getElementById('apellido').value = adminData.apellido;
    document.getElementById('email').value = adminData.email;
    document.getElementById('usuario').value = adminData.usuario;

    // Actualizar información del header del perfil
    document.getElementById('admin-name').textContent = `${adminData.nombre} ${adminData.apellido}`;

    // Guardar datos originales para cancelar edición
    datosOriginales = { ...adminData };
}

// Toggle modo edición
function toggleEditMode() {
    modoEdicion = !modoEdicion;
    const inputs = document.querySelectorAll('#admin-form input');
    const editBtn = document.getElementById('edit-btn-text');
    const actionButtons = document.getElementById('action-buttons');

    if (modoEdicion) {
        // Habilitar edición
        inputs.forEach(input => {
            input.disabled = false;
            input.style.background = 'white';
        });
        editBtn.textContent = 'Cancelar Edición';
        actionButtons.style.display = 'flex';
        mostrarNotificacion('Modo de edición activado', 'info');
    } else {
        // Deshabilitar edición
        inputs.forEach(input => {
            input.disabled = true;
            input.style.background = '#f9fafb';
        });
        editBtn.textContent = 'Editar Perfil';
        actionButtons.style.display = 'none';
        
        // Restaurar datos originales
        cargarDatosAdmin();
        mostrarNotificacion('Edición cancelada', 'info');
    }
}

// Guardar cambios
function guardarCambios() {
    // Validar formulario
    if (!validarFormulario()) {
        return;
    }

    // Recopilar datos del formulario
    const datosActualizados = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        email: document.getElementById('email').value.trim(),
        usuario: document.getElementById('usuario').value.trim()
    };

    // Simular llamada a la API/PHP
    mostrarNotificacion('Guardando cambios...', 'info');
    
    setTimeout(() => {
        // Actualizar datos globales
        Object.assign(adminData, datosActualizados);
        
        // Actualizar interfaz
        document.getElementById('admin-name').textContent = `${adminData.nombre} ${adminData.apellido}`;
        
        // Salir del modo edición
        modoEdicion = false;
        toggleEditMode();
        
        mostrarNotificacion('Perfil actualizado exitosamente', 'success');
        
        // Aquí iría la llamada real a PHP
        // enviarDatosAPHP(datosActualizados);
    }, 1500);
}

// Cancelar edición
function cancelarEdicion() {
    toggleEditMode();
}

// Validar formulario
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const usuario = document.getElementById('usuario').value.trim();

    if (!nombre) {
        mostrarNotificacion('El nombre es obligatorio', 'error');
        return false;
    }

    if (!apellido) {
        mostrarNotificacion('El apellido es obligatorio', 'error');
        return false;
    }

    if (!email || !validarEmail(email)) {
        mostrarNotificacion('Ingrese un email válido', 'error');
        return false;
    }

    if (!usuario) {
        mostrarNotificacion('El nombre de usuario es obligatorio', 'error');
        return false;
    }

    if (usuario.length < 3) {
        mostrarNotificacion('El nombre de usuario debe tener al menos 3 caracteres', 'error');
        return false;
    }

    return true;
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Cambiar avatar
function cambiarAvatar() {
    mostrarNotificacion('Funcionalidad de cambio de avatar en desarrollo', 'info');
    // Aquí iría la lógica para subir una nueva imagen
}

// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        mostrarNotificacion('Cerrando sesión...', 'info');
        setTimeout(() => {
            // Aquí iría la redirección al login
            window.location.href = 'login.html';
        }, 1500);
    }
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
            notificacion.style.background = '#059669';
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

// Funciones para integración con PHP (ejemplos)
function enviarDatosAPHP(datos) {
    // Ejemplo de llamada AJAX a PHP
    /*
    fetch('api/actualizar_perfil.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarNotificacion('Perfil actualizado exitosamente', 'success');
        } else {
            mostrarNotificacion('Error al actualizar perfil: ' + data.message, 'error');
        }
    })
    .catch(error => {
        mostrarNotificacion('Error de conexión', 'error');
    });
    */
}

// Función para cargar datos desde PHP
function cargarDatosDesdeServidor() {
    // Ejemplo de carga de datos desde el servidor
    /*
    fetch('api/obtener_perfil.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            adminData = data.admin;
            cargarDatosAdmin();
        }
    })
    .catch(error => {
        mostrarNotificacion('Error al cargar datos del perfil', 'error');
    });
    */
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
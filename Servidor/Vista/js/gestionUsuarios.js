
// Variables globales
let usuarios = [];
let usuariosFiltrados = [];
let usuarioEditando = null;
let paginaActual = 1;
const usuariosPorPagina = 10;

// Cargar datos al iniciar
fetch("../../Servidor/Controlador/gestionUsuarios.php")
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data)) {
            if (data.error === "Sesión expirada.") {
                alert("Tu sesión ha expirado. Por favor vuelve a iniciar sesión.");
                window.location.href = "../Vista/index.html";
            }
            return;
        }

        usuarios = data.map(usuario => ({
            ...usuario,
            estado: parseInt(usuario.estado),
            fechaRegistro: new Date(usuario.fechaRegistro).toLocaleDateString("es-ES")
        }));

        usuariosFiltrados = [...usuarios];
        renderizarUsuarios();
        actualizarContadores();
    })
    .catch(error => {
        console.error("JS Error al obtener los usuarios:", error);
    });

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderizarUsuarios();
    actualizarContadores();
});

function setupEventListeners() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                mostrarNotificacion('Sesión cerrada exitosamente', 'info');
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarModal();
    });

    document.getElementById('user-modal')?.addEventListener('click', function(e) {
        if (e.target === this) cerrarModal();
    });
}

// Renderizar tabla de usuarios SIN botones
function renderizarUsuarios() {
    const tbody = document.getElementById('usuarios-tbody');
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

    tbody.innerHTML = '';

    if (usuariosPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-users" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                    No se encontraron usuarios
                </td>
            </tr>
        `;
        return;
    }

usuariosPagina.forEach((usuario) => {
    const fila = document.createElement('tr');
    const iniciales = usuario.nombres.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();

    fila.innerHTML = `
        <td><div class="user-id">${usuario.id}</div></td>
        <td><span style="font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${usuario.codigo}</span></td>
        <td>
            <div class="user-avatar">
                <div class="avatar-circle">${iniciales}</div>
                <div class="user-info">
                    <h4>${usuario.usuario}</h4>
                    <span>@${usuario.usuario}</span>
                </div>
            </div>
        </td>
        <td><div style="font-weight: 600; color: #1f2937;">${usuario.nombres}</div></td>
        <td><span style="color: #6b7280;">${usuario.telefono}</span></td>
        <td><span style="color: #2563eb; font-size: 13px;">${usuario.email}</span></td>
        <td>
            <span class="status-badge-table ${usuario.estado === 1 ? 'status-activo' : 'status-inactivo'}">
                ${usuario.estado === 1 ? 'Activo' : 'Inactivo'}
            </span>
        </td>
        <td><span style="color: #6b7280; font-size: 13px;">${usuario.fechaRegistro}</span></td>
        <td>
            <div class="actions-cell">
                <button class="btn-edit" title="Editar usuario">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-toggle" title="${usuario.estado === 1 ? 'Deshabilitar' : 'Habilitar'} usuario">
                    <i class="fas fa-${usuario.estado === 1 ? 'ban' : 'check'}"></i>
                    ${usuario.estado === 1 ? 'Deshabilitar' : 'Habilitar'}
                </button>
                <button class="btn-delete" title="Eliminar usuario">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </td>
    `;

    // Asignar eventos seguros con addEventListener
    const btnEditar = fila.querySelector('.btn-edit');
    const btnToggle = fila.querySelector('.btn-toggle');
    const btnEliminar = fila.querySelector('.btn-delete');

    btnEditar.addEventListener('click', () => editarUsuario(usuario.id));
    btnToggle.addEventListener('click', () => toggleUsuario(usuario.id));
    btnEliminar.addEventListener('click', () => eliminarUsuario(usuario.id));

    tbody.appendChild(fila);
});


    actualizarPaginacion();
}

function filtrarUsuarios() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterEstado = document.getElementById('filter-estado').value;

    usuariosFiltrados = usuarios.filter(usuario => {
        const matchesSearch = usuario.codigo.toLowerCase().includes(searchTerm)
            || usuario.usuario.toLowerCase().includes(searchTerm)
            || usuario.nombres.toLowerCase().includes(searchTerm)
            || usuario.email.toLowerCase().includes(searchTerm);
        const matchesEstado = !filterEstado || usuario.estado.toString() === filterEstado;
        return matchesSearch && matchesEstado;
    });

    paginaActual = 1;
    renderizarUsuarios();
    actualizarContadores();
}

function limpiarFiltros() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-estado').value = '';
    usuariosFiltrados = [...usuarios];
    paginaActual = 1;
    renderizarUsuarios();
    actualizarContadores();
    mostrarNotificacion('Filtros limpiados', 'info');
}

function cerrarModal() {
    document.getElementById('user-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    usuarioEditando = null;
}

function actualizarContadores() {
    const totalUsuarios = usuarios.length;
    const usuariosMostrados = usuariosFiltrados.length;

    document.getElementById('total-usuarios').textContent = `${totalUsuarios} Usuarios Registrados`;
    document.getElementById('total-count').textContent = totalUsuarios;
    document.getElementById('showing-count').textContent = usuariosMostrados;
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = `btn-page-number ${i === paginaActual ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            paginaActual = i;
            renderizarUsuarios();
        };
        pageNumbers.appendChild(btn);
    }

    const btnAnterior = document.querySelector('.btn-page');
    const btnSiguiente = document.querySelectorAll('.btn-page')[1];

    if (btnAnterior) btnAnterior.disabled = paginaActual === 1;
    if (btnSiguiente) btnSiguiente.disabled = paginaActual === totalPaginas;
}

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
        case 'success': notificacion.style.background = '#059669'; break;
        case 'error': notificacion.style.background = '#dc2626'; break;
        case 'info': notificacion.style.background = '#2563eb'; break;
        default: notificacion.style.background = '#6b7280';
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

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Agregar nuevo usuario
function agregarUsuario() {
    usuarioEditando = null;
    document.getElementById('modal-title').textContent = 'Agregar Estudiante';

    // Limpiar formulario
    document.getElementById('user-form').reset();
    document.getElementById('user-estado').value = '1';

    // Mostrar modal
    document.getElementById('user-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Exportar usuarios
function exportarUsuarios() {
    // Convertir a formato para SheetJS
    const data = usuarios.map(u => ({
        ID: u.id,
        Código: u.codigo,
        Usuario: u.usuario,
        Nombres: u.nombres,
        Teléfono: u.telefono,
        Email: u.email,
        Estado: u.estado === 1 ? "Activo" : "Inactivo",
        "Fecha Registro": new Date(u.fechaRegistro).toLocaleDateString("es-PE")
    }));

    // Crear hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    // Exportar como archivo .xlsx
    XLSX.writeFile(workbook, "estudiantes.xlsx");

    mostrarNotificacion('Archivo Excel generado exitosamente', 'success');
}
function guardarUsuario() {
    const codigo = document.getElementById('user-codigo').value.trim();
    const usuario = document.getElementById('user-usuario').value.trim();
    const nombres = document.getElementById('user-nombres').value.trim();
    const telefono = document.getElementById('user-telefono').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const estado = parseInt(document.getElementById('user-estado').value);

    if (!codigo || !usuario || !nombres || !telefono || !email) {
        mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarNotificacion('Por favor ingrese un email válido', 'error');
        return;
    }

    const codigoExiste = usuarios.some(u => u.codigo === codigo && (!usuarioEditando || u.id !== usuarioEditando.id));
    const usuarioExiste = usuarios.some(u => u.usuario === usuario && (!usuarioEditando || u.id !== usuarioEditando.id));

    if (codigoExiste) {
        mostrarNotificacion('El código de usuario ya existe', 'error');
        return;
    }
    if (usuarioExiste) {
        mostrarNotificacion('El nombre de usuario ya existe', 'error');
        return;
    }

    if (usuarioEditando) {
        // Actualizar usuario existente
        if (usuarioEditando) {
    // ACTUALIZAR usuario existente (método PUT)
    fetch("../../Servidor/Controlador/gestionUsuarios.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: usuarioEditando.id,
            codigo,
            usuario,
            nombres,
            telefono,
            email,
            estado
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Object.assign(usuarioEditando, {
                codigo,
                usuario,
                nombres,
                telefono,
                email,
                estado
            });
            mostrarNotificacion("Usuario actualizado exitosamente", "success");
            filtrarUsuarios();
            cerrarModal();
        } else {
            mostrarNotificacion("Error: " + (data.message || data.error), "error");
        }
    })
    .catch(err => {
        console.error(err);
        mostrarNotificacion("Error de red o servidor", "error");
    });
}

    } else {
        // Crear nuevo usuario
        fetch("../../Servidor/Controlador/gestionUsuarios.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                codigo,
                usuario,
                nombres,
                telefono,
                email,
                estado
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                usuarios.push({
                    id: parseInt(data.id),
                    codigo,
                    usuario,
                    nombres,
                    telefono,
                    email,
                    estado,
                    fechaRegistro: new Date().toLocaleDateString('es-ES')
                });
                mostrarNotificacion('Usuario guardado correctamente', 'success');
                filtrarUsuarios();
                cerrarModal();
            } else {
                mostrarNotificacion('Error: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarNotificacion('Error de red o servidor', 'error');
        });
    }
}


// cambiar de estado de usuario 
function toggleUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    const nuevoEstado = usuario.estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? "habilitar" : "deshabilitar";

    if (confirm(`¿Está seguro que desea ${accion} al usuario ${usuario.nombres}?`)) {
        fetch('../../Servidor/Controlador/toggleUsuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: usuario.id, estado: nuevoEstado })  // ← IMPORTANTE: `usuario.id`, no `id`
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                usuario.estado = nuevoEstado;
                filtrarUsuarios();
                mostrarNotificacion(`Usuario ${accion}do exitosamente`, 'success');
            } else {
                mostrarNotificacion('Error al cambiar estado: ' + response.message, 'error');
            }
        })
        .catch(err => {
            mostrarNotificacion('Error de red al cambiar estado', 'error');
            console.error(err);
        });
    }
}


window.toggleUsuario = toggleUsuario;

//editar el usuario
function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        mostrarNotificacion("Usuario no encontrado", "error");
        return;
    }

    usuarioEditando = usuario; // ← importante para saber si es edición o nuevo

    document.getElementById('modal-title').textContent = 'Editar Estudiante';

    // Rellenar el formulario con los datos del usuario
    document.getElementById('user-codigo').value = usuario.codigo;
    document.getElementById('user-usuario').value = usuario.usuario;
    document.getElementById('user-nombres').value = usuario.nombres;
    document.getElementById('user-telefono').value = usuario.telefono;
    document.getElementById('user-email').value = usuario.email;
    document.getElementById('user-estado').value = usuario.estado.toString();

    // Mostrar el modal
    document.getElementById('user-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

//elimininar usuarios
function eliminarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        mostrarNotificacion("Usuario no encontrado", "error");
        return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar (desactivar) al usuario "${usuario.nombres}"?`)) {
        fetch("../../Servidor/Controlador/eliminarUsuario.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: usuario.id })
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                usuario.estado = 0; // Marcar como inactivo
                mostrarNotificacion("Usuario desactivado exitosamente", "success");
                filtrarUsuarios(); // Para que desaparezca si hay filtros activos
                renderizarUsuarios();
                actualizarContadores();
            } else {
                mostrarNotificacion("Error al desactivar: " + response.message, "error");
            }
        })
        .catch(err => {
            console.error(err);
            mostrarNotificacion("Error de red al desactivar", "error");
        });
    }
}


window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
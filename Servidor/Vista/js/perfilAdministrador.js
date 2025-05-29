// Cargar perfil al iniciar
document.addEventListener('DOMContentLoaded', () => {
    fetch('../Controlador/perfilAdministrador.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const perfil = data.data;
                document.getElementById('nombre').value = perfil.nombres;
                document.getElementById('apellido').value = perfil.apellidos;
                document.getElementById('email').value = perfil.correo;
                document.getElementById('usuario').value = perfil.usuario;

                document.getElementById('admin-name').textContent = perfil.nombres + ' ' + perfil.apellidos;
                document.getElementById('estado').textContent = perfil.estado == 1 ? 'Activo' : 'Inactivo';

                // Mostrar imagen desde el blob en base64
                if (perfil.imagen_blob) {
                    const preview = document.getElementById('preview-img');
                    if (preview) {
                        preview.src = perfil.imagen_blob;
                    }
                }
            } else {
                alert('Error al cargar el perfil: ' + data.error);
            }
        })
        .catch(err => {
            console.error('Error al obtener el perfil:', err);
            alert('No se pudo cargar el perfil.');
        });
});

// Activar modo edición
function toggleEditMode() {
    const fields = ['nombre', 'apellido', 'email', 'usuario', 'imagen_perfil'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.disabled = false;
    });
    document.getElementById('action-buttons').style.display = 'flex';
    document.getElementById('edit-btn-text').textContent = 'Editando...';
}

// Cancelar edición
function cancelarEdicion() {
    location.reload(); // Restaura los valores originales
}

// Guardar cambios
function guardarCambios() {
    const form = document.getElementById('admin-form');
    const formData = new FormData(form);

    fetch('../Controlador/perfilAdministrador.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Perfil actualizado.');
            // Si se devuelve nueva imagen, actualizar preview sin recargar
            if (data.imagen_blob) {
                const preview = document.getElementById('preview-img');
                if (preview) {
                    preview.src = data.imagen_blob;
                }
            }
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Error al guardar el perfil:', err);
        alert('No se pudo actualizar el perfil.');
    });
}

// Cerrar sesión
function cerrarSesion() {
    fetch('../Controlador/logout.php')
        .then(() => {
            window.location.href = '../Vista/index.html';
        });
}

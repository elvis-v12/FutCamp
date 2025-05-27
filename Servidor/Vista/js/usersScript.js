document.addEventListener('DOMContentLoaded', function () {
    const tablaEstudiantes = document.getElementById('tablaEstudiantes').getElementsByTagName('tbody')[0];

    // Función para obtener y mostrar los estudiantes
    function obtenerEstudiantes() {
        fetch('../api/usuario/getEstudiantes.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los estudiantes.');
                }
                return response.json();
            })
            .then(data => {
                // Limpiar la tabla antes de llenarla
                tablaEstudiantes.innerHTML = '';

                // Llenar la tabla con los datos de los estudiantes
                data.forEach(estudiante => {
                    let row = tablaEstudiantes.insertRow();
                    row.innerHTML = `
                        <td>${estudiante.id_estudiante}</td>
                        <td>${estudiante.cod_estudiante}</td>
                        <td>${estudiante.usuario}</td>
                        <td>${estudiante.nombres}</td>
                        <td>${estudiante.telefono}</td>
                        <td>${estudiante.email}</td>
                        <td>${estudiante.estado}</td>
                        <td>
                            <button class="btn-deshabilitar" data-id="${estudiante.id_estudiante}">Deshabilitar</button>
                            <button class="btn-habilitar" data-id="${estudiante.id_estudiante}"">Habilitar</button>
                        </td>
                    `;
                    // Mostrar botón de deshabilitar o habilitar según el estado del estudiante
                    if (estudiante.estado == 1) {
                        row.querySelector('.btn-deshabilitar').style.display = 'inline-block';
                        row.querySelector('.btn-habilitar').style.display = 'none';
                    } else {
                        row.querySelector('.btn-deshabilitar').style.display = 'none';
                        row.querySelector('.btn-habilitar').style.display = 'inline-block';
                    }

                });

                // Agregar evento de clic a los botones de deshabilitar
                const btnsDeshabilitar = document.getElementsByClassName('btn-deshabilitar');
                Array.from(btnsDeshabilitar).forEach(btn => {
                    btn.addEventListener('click', function () {
                        const estudianteId = this.getAttribute('data-id');
                        deshabilitarEstudiante(estudianteId);
                    });
                });

                // Agregar evento de clic a los botones de habilitar
                const btnsHabilitar = document.getElementsByClassName('btn-habilitar');
                Array.from(btnsHabilitar).forEach(btn => {
                    btn.addEventListener('click', function () {
                        const estudianteId = this.getAttribute('data-id');
                        habilitarEstudiante(estudianteId);
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los estudiantes.');
            });
    }

    // Función para deshabilitar un estudiante
    function deshabilitarEstudiante(idEstudiante) {
        fetch(`../api/usuario/deshabilitarUsuario.php?id=${idEstudiante}`, {
            method: 'PUT',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo deshabilitar al estudiante.');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Mostrar mensaje de éxito o error
                obtenerEstudiantes(); // Actualizar la tabla de estudiantes
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo deshabilitar al estudiante.');
            });
    }

    // Función para habilitar un estudiante
    function habilitarEstudiante(idEstudiante) {
        fetch(`../api/usuario/habilitarUsuario.php?id=${idEstudiante}`, {
            method: 'PUT',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo habilitar al estudiante.');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Mostrar mensaje de éxito o error
                obtenerEstudiantes(); // Actualizar la tabla de estudiantes
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo habilitar al estudiante.');
            });
    }

    // Cargar estudiantes al cargar la página
    obtenerEstudiantes();
});

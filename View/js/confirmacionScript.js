document.addEventListener('DOMContentLoaded', function () {
    // Obtener el código de estudiante desde el campo oculto en el formulario
    var cod_estudiante = document.querySelector('input[name="cod_estudiante"]').value;

    // Agregar evento al formulario de confirmación
    document.getElementById('confirmarForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        var confirmar = event.submitter.value; // Obtener el valor del botón presionado ('si' o 'no')

        // Llamar a la función para confirmar la reserva
        confirmarReserva(confirmar, cod_estudiante);
    });

    // Función para confirmar o no la reserva
    function confirmarReserva(confirmar, cod_estudiante) {
        // Crear objeto FormData con los datos a enviar
        var formData = new FormData();
        formData.append('confirmar', confirmar);
        formData.append('cod_estudiante', cod_estudiante);

        // Realizar la solicitud AJAX
        fetch('http://localhost/Proyecto_FutCamp/api/reservas/confirmarReserva.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Mostrar mensaje según la respuesta del servidor
                if (confirmar === 'si') {
                    alert('¡Reserva confirmada exitosamente!');
                } else {
                    alert('No confirmaste la reserva.');
                }
                // Opcional: redireccionar a otra página después de mostrar el mensaje
                window.location.href = '../View/loginEstudiante.html'; // Cambia la ruta según tu estructura de archivos
            })
            .catch(error => {
                console.error('Error al confirmar la reserva:', error);
                alert('Error al confirmar la reserva.');
            });
    }
});

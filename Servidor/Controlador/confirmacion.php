<?php
// confirmacion.php

// Asegurarse de recibir el código del estudiante desde el enlace del correo
if (isset($_GET['cod_estudiante'])) {
    $cod_estudiante = $_GET['cod_estudiante'];

    // Mostrar el formulario de confirmación de reserva
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmar Reserva</title>
        <link rel="stylesheet" href="css/styleConfirmacion.css">
        <link rel="icon" href="images/logo.png" type="image/jpeg">
    </head>
    <body>
        <div class="imagen_futcamp">
            <img src="images/image.png" alt="Logo" class="logo">
        </div>
        <div class="container">
            <div class="LFormulario">
                <h1>CONFIRMA TU RESERVA</h1>
                <form id="confirmarForm" method="POST" action="api/reservas/confirmarReserva.php">
                    <input type="hidden" name="cod_estudiante" value="<?php echo $cod_estudiante; ?>">
                    <div class="label-container">
                        <label for="reserva">Confirma tu reserva:</label>
                    </div>
                    <div class="buttons-container">
                        <button type="submit" name="confirmar" value="si">Confirmar</button>
                        <button type="submit" name="confirmar" value="no">No Confirmar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Incluir el script externo -->
        <script src="js/confirmacionScript.js"></script>
    </body>
    </html>
    <?php
} else {
    echo 'No se ha proporcionado un código de estudiante válido.';
}
?>

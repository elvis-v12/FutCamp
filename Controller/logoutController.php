<?php
// Inicia la sesión.
session_start();
// Destruye todas las sesiones.
session_destroy();
// Redirige al usuario según su rol.
if ($_SESSION['rol'] == 'Administrador') {
    header("Location: ../View/index.html"); // Redirige al index.html si es administrador
} elseif ($_SESSION['rol'] == 'Usuario') {
    header("Location: ../View/loginEstudiante.html"); // Redirige a loginEstudiante.html si es usuario
} else {
    header("Location: ../View/index.html"); // Por defecto, redirige al index.html
}
exit;
?>

<?php
// Inicia la sesión
session_start();

// Verifica si el usuario ha iniciado sesión
if (!isset($_SESSION['usuario'])) {
    // Si no hay sesión iniciada, redirige a la página de inicio de sesión
    header("Location: ../View/index.php");
    exit;
}

// Verifica si el estado del usuario es 1 (habilitado) o 0 (deshabilitado)
if ($_SESSION['estado'] == 0) {
    // Si el estado es 0, destruye la sesión y redirige a un mensaje de usuario deshabilitado
    session_unset();
    session_destroy();
    header("Location: ../View/index.php");
    exit;
}

// Obtiene el rol del usuario de la sesión
$rol = $_SESSION['rol'];
?>
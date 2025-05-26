<?php
session_start();

// Tiempo límite de inactividad en segundos (por ejemplo, 30 minutos)
$inactive = 1800; 

// Comprobar si la sesión está activa
if (isset($_SESSION['timeout'])) {
    // Calcular el tiempo de inactividad
    $session_life = time() - $_SESSION['timeout'];
    if ($session_life > $inactive) {
        // Destruir la sesión si excede el tiempo de inactividad
        session_unset();
        session_destroy();
        header("Location: ../View/index.html");
        exit;
    }
}

// Actualizar el tiempo de la última actividad
$_SESSION['timeout'] = time();

// Verifica si el usuario ha iniciado sesión
if (!isset($_SESSION['usuario'])) {
    // Si no hay sesión iniciada, redirige a la página de inicio de sesión
    header("Location: ../View/index.html");
    exit;
}

// Obtiene el rol del usuario de la sesión
$rol = $_SESSION['rol'];
?>

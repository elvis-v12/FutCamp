<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$stmt = $db->prepare("SELECT nombres FROM usuarios WHERE id_usuario = ?");
$stmt->execute([$_SESSION['id_usuario']]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

// Validar que haya resultado
if ($usuario && isset($usuario['nombres'])) {
    echo json_encode(["nombres" => $usuario['nombres']]);
} else {
    echo json_encode(["error" => "Usuario no encontrado"]);
}

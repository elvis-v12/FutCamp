<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

$codigo = $_GET['codigo'] ?? null;

if (!$codigo) {
    echo json_encode(["error" => "Código no proporcionado"]);
    exit;
}

$stmt = $db->prepare("SELECT nombres, telefono FROM estudiantes WHERE cod_estudiante = ?");
$stmt->execute([$codigo]);
$estudiante = $stmt->fetch(PDO::FETCH_ASSOC);

if ($estudiante) {
    echo json_encode($estudiante);
} else {
    echo json_encode(["error" => "Estudiante no encontrado"]);
}

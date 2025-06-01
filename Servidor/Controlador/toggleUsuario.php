<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

// Leer datos JSON del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$estado = $data['estado'] ?? null;

// Validar que se reciban correctamente
if ($id === null || $estado === null) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    // IMPORTANTE: Usa `$db` si esa es tu variable de conexión
    $sql = "UPDATE estudiantes SET estado = ? WHERE id_estudiante = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$estado, $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No se actualizó el estado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

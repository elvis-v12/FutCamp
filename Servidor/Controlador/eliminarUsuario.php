<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Sesión expirada."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID no recibido"]);
    exit;
}

try {
    $sql = "UPDATE estudiantes SET estado = 0 WHERE id_estudiante = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontró el usuario o ya estaba eliminado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

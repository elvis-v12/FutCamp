<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php"); // conexión PDO en $db

try {
    // Recibir datos JSON
    $data = json_decode(file_get_contents("php://input"), true);

    $codigo = $data['codigo'];
    $telefono = $data['telefono'];
    $num_personas = $data['personas'];
    $dia = $data['dia'];
    $hora_entrada = $data['hora_entrada'];
    $hora_salida = $data['hora_salida'];
    $comentarios = $data['comentarios'];

    // Buscar ID del estudiante
    $stmt = $db->prepare("SELECT id_estudiante FROM estudiantes WHERE cod_estudiante = ?");
    $stmt->execute([$codigo]);
    $estudiante = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$estudiante) {
        echo json_encode(["error" => "Estudiante no encontrado"]);
        exit;
    }

    $id_estudiante = $estudiante['id_estudiante'];
    $id_usuario = $_SESSION['id_usuario'] ?? 1;

    // Registrar reserva
    $stmt = $db->prepare("
        INSERT INTO reserva (id_estudiante, telefono, num_personas, dia_reserva, hora_entrada, hora_salida, comentarios, estado, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Activa', ?)
    ");
    $stmt->execute([
        $id_estudiante, $telefono, $num_personas, date("Y-m-d", strtotime("next " . $dia)),
        $hora_entrada, $hora_salida, $comentarios, $id_usuario
    ]);

    echo json_encode(["success" => true, "message" => "Reserva registrada correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

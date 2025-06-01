<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $codigo = $data['codigo'];
    $telefono = $data['telefono'];
    $num_personas = $data['personas'];
    $dia = ucfirst(strtolower($data['dia']));
    $hora_entrada = $data['hora_entrada'];
    $hora_salida = $data['hora_salida'];
    $comentarios = $data['comentarios'];
    $fecha = date("Y-m-d", strtotime("next " . $dia));
    $id_usuario = $_SESSION['id_usuario'] ?? 1;

    // Validar que la hora de entrada sea menor a la salida
    if (strtotime($hora_entrada) >= strtotime($hora_salida)) {
        echo json_encode(["error" => "La hora de entrada debe ser menor que la hora de salida"]);
        exit;
    }

    // Buscar ID del estudiante
    $stmt = $db->prepare("SELECT id_estudiante FROM estudiantes WHERE cod_estudiante = ?");
    $stmt->execute([$codigo]);
    $estudiante = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$estudiante) {
        echo json_encode(["error" => "Estudiante no encontrado"]);
        exit;
    }

    $id_estudiante = $estudiante['id_estudiante'];

    // Buscar o insertar el horario (como ocupado, estado = 0)
    $stmt = $db->prepare("SELECT id_horario FROM horarios WHERE dia = ? AND hora_inicio = ? AND hora_fin = ?");
    $stmt->execute([$dia, $hora_entrada, $hora_salida]);
    $horario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$horario) {
        $estado_horario = 0; // No disponible
        $stmt = $db->prepare("INSERT INTO horarios (dia, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?)");
        $stmt->execute([$dia, $hora_entrada, $hora_salida, $estado_horario]);
        $id_horario = $db->lastInsertId();
    } else {
        $id_horario = $horario['id_horario'];
    }

    // Insertar la reserva
    $stmt = $db->prepare("
        INSERT INTO reserva (
            id_estudiante, telefono, num_personas, dia_reserva,
            hora_entrada, hora_salida, comentarios, estado,
            id_usuario, id_horario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Activa', ?, ?)
    ");
    $stmt->execute([
        $id_estudiante, $telefono, $num_personas, $fecha,
        $hora_entrada, $hora_salida, $comentarios, $id_usuario, $id_horario
    ]);

    echo json_encode(["success" => true, "message" => "Reserva registrada correctamente."]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

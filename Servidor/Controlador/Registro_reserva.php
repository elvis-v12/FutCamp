<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $codigo = $data['codigo'];
    $telefono = $data['telefono'];
    $num_personas = $data['personas'];
    $dia = $data['dia'];
    $fechaReserva = $data['fechaReserva'];
    $hora_entrada = $data['horaEntrada'];
    $hora_salida = $data['horaSalida'];
    $comentarios = $data['comentarios'];

    // ✅ Usuario que realiza la acción
    $id_usuario = $_SESSION['id_usuario'] ?? 1;

    // Validación de horas
    if (strtotime($hora_entrada) >= strtotime($hora_salida)) {
        echo json_encode(["error" => "La hora de entrada debe ser menor que la de salida."]);
        exit;
    }

    // Buscar estudiante y validar si está activo
    $stmt = $db->prepare("SELECT id_estudiante, estado FROM estudiantes WHERE cod_estudiante = ?");
    $stmt->execute([$codigo]);
    $estudiante = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$estudiante) {
        echo json_encode(["error" => "Estudiante no encontrado."]);
        exit;
    }

    if ((int)$estudiante['estado'] !== 1) {
        echo json_encode(["error" => "Estudiante deshabilitado. No puede hacer reservas."]);
        exit;
    }

    $id_estudiante = $estudiante['id_estudiante'];

    // Validar si ya tiene reserva activa para esa fecha
    $stmt = $db->prepare("SELECT COUNT(*) FROM reserva WHERE id_estudiante = ? AND dia_reserva = ?");
    $stmt->execute([$id_estudiante, $fechaReserva]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(["error" => "Ya tienes una reserva registrada para esa fecha."]);
        exit;
    }

    // Buscar o insertar horario
    $stmt = $db->prepare("SELECT id_horario FROM horarios WHERE dia = ? AND hora_inicio = ? AND hora_fin = ?");
    $stmt->execute([$dia, $hora_entrada, $hora_salida]);
    $horario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$horario) {
        $stmt = $db->prepare("INSERT INTO horarios (dia, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, 0)");
        $stmt->execute([$dia, $hora_entrada, $hora_salida]);
        $id_horario = $db->lastInsertId();
    } else {
        $id_horario = $horario['id_horario'];
    }

    // Registrar reserva
    $stmt = $db->prepare("
        INSERT INTO reserva (
            id_estudiante, telefono, num_personas, dia_reserva,
            hora_entrada, hora_salida, comentarios, estado,
            id_usuario, id_horario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Activa', ?, ?)
    ");
    $stmt->execute([
        $id_estudiante, $telefono, $num_personas, $fechaReserva,
        $hora_entrada, $hora_salida, $comentarios, $id_usuario, $id_horario
    ]);

    echo json_encode(["success" => true, "message" => "Reserva registrada correctamente."]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

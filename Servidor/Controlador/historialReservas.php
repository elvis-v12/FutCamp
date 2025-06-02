<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once("../Modelo/database.php");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Sesión expirada."]);
    exit;
}

try {
    $sql = "SELECT 
                r.id_reserva AS id,
                e.nombres,
                r.dia_reserva AS dia,
                h.hora_inicio AS horaEntrada,
                h.hora_fin AS horaSalida,
                r.num_personas AS personas,
                r.estado,
                r.dia_reserva AS fechaReserva,
                r.hora_entrada AS fechaCreacion
            FROM reserva r
            INNER JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
            INNER JOIN horarios h ON r.id_horario = h.id_horario
            ORDER BY r.dia_reserva DESC";

    $stmt = $db->prepare($sql); // usamos $db como tú ya haces
    $stmt->execute();
    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reservas, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error de base de datos: " . $e->getMessage()]);
}

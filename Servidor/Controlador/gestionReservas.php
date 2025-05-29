<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    // Consulta para obtener todas las reservas con nombres de estudiantes
    $stmt = $db->prepare("
        SELECT 
            r.id_reserva AS id,
            CONCAT(e.nombres, ' ', e.apellidos) AS nombre,
            r.telefono,
            r.num_personas AS personas,
            DAYNAME(r.dia_reserva) AS dia,
            TIME_FORMAT(r.hora_entrada, '%H:%i') AS horaEntrada,
            TIME_FORMAT(r.hora_salida, '%H:%i') AS horaSalida,
            r.comentarios,
            r.estado,
            r.dia_reserva AS fechaCreacion
        FROM futcamp.reserva r
        JOIN futcamp.estudiantes e ON r.id_estudiante = e.id_estudiante
    ");
    
    $stmt->execute();
    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reservas, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

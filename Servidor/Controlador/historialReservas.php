<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    // Consulta para obtener todas las reservas con nombres de estudiantes
    $stmt = $db->prepare("
        SELECT 
            r.id_historial AS id,
            CONCAT(e.nombres, ' ', e.apellidos) AS nombres,
            r.telefono,
            r.num_personas AS personas,
            DAYNAME(r.dia_reserva) AS dia,
            TIME_FORMAT(r.hora_entrada, '%H:%i') AS horaEntrada,
            TIME_FORMAT(r.hora_salida, '%H:%i') AS horaSalida,
            r.comentarios,
            e.cod_estudiante AS codigoEstudiante,
            r.estado,
            h.dia AS fechaReserva,
            r.dia_reserva AS fechaCreacion
        FROM historial r
        JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
        JOIN reserva res ON r.id_reserva = res.id_reserva
        JOIN horarios h ON h.id_horario = res.id_horario
    ");
    
    $stmt->execute();
    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reservas, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

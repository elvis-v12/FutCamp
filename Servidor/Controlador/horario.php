<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    $stmt = $db->query("
        SELECT 
            r.id_reserva AS id,
            e.nombres AS nombres,
            DAYOFWEEK(r.dia_reserva) AS dia,
            HOUR(r.hora_entrada) AS hora,
            TIMESTAMPDIFF(HOUR, r.hora_entrada, r.hora_salida) AS duracion,
            r.telefono AS telefono,
            r.num_personas AS personas,
            r.comentarios AS comentarios
        FROM reserva r
        INNER JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
        WHERE r.estado = 'Confirmada'
    ");

    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reservas);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

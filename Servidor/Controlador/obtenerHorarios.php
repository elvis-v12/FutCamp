<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

$stmt = $db->query("
    SELECT 
        LOWER(h.dia) AS dia,
        DATE_FORMAT(h.hora_inicio, '%H:%i') AS entrada,
        DATE_FORMAT(h.hora_fin, '%H:%i') AS salida
    FROM horarios h
    INNER JOIN reserva r ON h.id_horario = r.id_horario
    WHERE h.estado = 0 AND r.estado = 'Activa'
");


$horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($horarios);
?>

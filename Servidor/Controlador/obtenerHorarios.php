<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

$stmt = $db->query("
    SELECT 
        DAYNAME(dia_reserva) AS dia,
        TIME_FORMAT(hora_entrada, '%H:%i') AS entrada,
        TIME_FORMAT(hora_salida, '%H:%i') AS salida
    FROM reserva
    WHERE estado = 'Activa'
");

$horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($horarios);
?>

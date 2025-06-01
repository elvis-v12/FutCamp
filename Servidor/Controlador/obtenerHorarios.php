<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

$stmt = $db->query("
    SELECT 
        LOWER(dia) AS dia,
        DATE_FORMAT(hora_inicio, '%H:%i') AS entrada,
        DATE_FORMAT(hora_fin, '%H:%i') AS salida
    FROM horarios
    WHERE estado = 0
");

$horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($horarios);
?>

<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Sesión expirada."]);
    exit;
}

if (isset($_SESSION['id_usuario'])) {
    header("Location: ../Vista/gestionEstudiantes.html");
    exit;
}

try {
    $stmt = $db->prepare("
        SELECT 
            u.id_usuario AS id, 
            CONCAT(u.nombres, ' ', u.apellidos) AS nombres, 
            u.correo AS email,
            u.usuario, 
            u.estado,
            e.cod_estudiante AS codigo,
            r.telefono,
            r.dia_reserva AS fechaRegistro
        FROM usuarios u
        JOIN estudiantes e ON u.usuario = e.usuario
        JOIN reserva r ON r.id_estudiante = e.id_estudiante
    ");

    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($usuarios, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

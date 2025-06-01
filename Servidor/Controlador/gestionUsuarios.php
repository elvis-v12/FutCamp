<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Sesión expirada."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // CONSULTA PARA LISTAR TODOS LOS ESTUDIANTES
    try {
        $stmt = $db->query("SELECT id_estudiante AS id, cod_estudiante AS codigo, usuario, nombres, telefono, email, estado, fecha_registro AS fechaRegistro FROM estudiantes");
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // REGISTRO NUEVO ESTUDIANTE
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Datos inválidos."]);
        exit;
    }

    try {
        $stmt = $db->prepare("INSERT INTO estudiantes (cod_estudiante, usuario, nombres, telefono, email, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $data['codigo'],
            $data['usuario'],
            $data['nombres'],
            $data['telefono'],
            $data['email'],
            $data['estado']
        ]);

        echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // ACTUALIZACIÓN DE USUARIO
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id'])) {
        echo json_encode(["error" => "Datos inválidos."]);
        exit;
    }

    try {
        $stmt = $db->prepare("UPDATE estudiantes SET cod_estudiante = ?, usuario = ?, nombres = ?, telefono = ?, email = ?, estado = ? WHERE id_estudiante = ?");
        $stmt->execute([
            $data['codigo'],
            $data['usuario'],
            $data['nombres'],
            $data['telefono'],
            $data['email'],
            $data['estado'],
            $data['id']
        ]);

        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

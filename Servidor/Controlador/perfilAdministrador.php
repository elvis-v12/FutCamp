<?php
session_start();
ob_clean();
header('Content-Type: application/json');
require_once("../Modelo/database.php");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/errores_perfil.log');

$id = $_SESSION['id_usuario'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->prepare("SELECT nombres, apellidos, correo, usuario, estado, imagen_blob FROM usuarios WHERE id_usuario = :id");
        $stmt->execute(['id' => $id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && $usuario['imagen_blob']) {
            $usuario['imagen_blob'] = 'data:image/jpeg;base64,' . base64_encode($usuario['imagen_blob']);
        }

        echo json_encode(['success' => true, 'data' => $usuario]);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombres = $_POST['nombres'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $usuario = $_POST['usuario'] ?? '';
    $imagenBinaria = null;
    $imagenBase64 = null;

    if (isset($_FILES['imagen_perfil']) && $_FILES['imagen_perfil']['error'] === UPLOAD_ERR_OK) {
        $imagenBinaria = file_get_contents($_FILES['imagen_perfil']['tmp_name']);
        $imagenBase64 = 'data:image/jpeg;base64,' . base64_encode($imagenBinaria);
    }

    try {
        $sql = "UPDATE usuarios SET nombres = :nombres, apellidos = :apellidos, correo = :correo, usuario = :usuario";
        $params = [
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'correo' => $correo,
            'usuario' => $usuario,
            'id' => $id
        ];

        if ($imagenBinaria) {
            $sql .= ", imagen_blob = :imagen_blob";
            $params['imagen_blob'] = $imagenBinaria;
        }

        $sql .= " WHERE id_usuario = :id";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['success' => true, 'imagen' => $imagenBase64]);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

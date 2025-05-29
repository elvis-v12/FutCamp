<?php
header('Content-Type: application/json');
include "../Modelo/database.php";

$response = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = trim($_POST['usuario'] ?? '');
    $nombres = trim($_POST['nombres'] ?? '');
    $apellidos = trim($_POST['apellidos'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $contra = $_POST['contra'] ?? '';
    $confirmar = $_POST['confirmar'] ?? '';

    if (!$usuario || !$nombres || !$apellidos || !$correo || !$contra || !$confirmar) {
        echo json_encode(['success' => false, 'error' => 'Completa todos los campos.']);
        exit;
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Correo inválido.']);
        exit;
    }

    if ($contra !== $confirmar) {
        echo json_encode(['success' => false, 'error' => 'Las contraseñas no coinciden.']);
        exit;
    }

    // Verificar si ya existe el usuario o correo
    $sql = "SELECT COUNT(*) FROM usuarios WHERE correo = :correo OR usuario = :usuario";
    $stmt = $db->prepare($sql);
    $stmt->execute(['correo' => $correo, 'usuario' => $usuario]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'error' => 'El usuario o correo ya están registrados.']);
        exit;
    }

    $hashedPassword = password_hash($contra, PASSWORD_BCRYPT);

    $sqlInsert = "INSERT INTO usuarios (nombres, apellidos, correo, contra, usuario) 
                  VALUES (:nombres, :apellidos, :correo, :contra, :usuario)";
    $stmtInsert = $db->prepare($sqlInsert);

    try {
        $stmtInsert->execute([
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'correo' => $correo,
            'contra' => $hashedPassword,
            'usuario' => $usuario
        ]);

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Error del servidor: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método inválido']);
}
?>

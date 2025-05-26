<?php
include '../config/database.php'; // Incluir archivo de conexión a la base de datos
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST["usuario"] ?? '';
    $password = $_POST["contrasena"] ?? '';

    if (empty($usuario) || empty($password)) {
        http_response_code(400);
        echo json_encode(array('error' => 'Rellene todos los campos'));
        exit;
    }

    $sql = "SELECT * FROM usuarios WHERE usuario = :usuario AND rol = 'Usuario'";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':usuario', $usuario);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user['estado'] == 0) {
            http_response_code(403);
            echo json_encode(array('error' => 'Su cuenta está deshabilitada. Comuníquese con el administrador.'));
            exit;
        }

        if ($password == $user['contrasena']) {
            $_SESSION['usuario'] = $user['usuario'];
            $_SESSION['rol'] = $user['rol'];
            echo json_encode(array('success' => 'Inicio de sesión exitoso', 'redirect' => '../View/home.php'));
        } else {
            http_response_code(401);
            echo json_encode(array('error' => 'Usuario/Contraseña incorrecta'));
        }
    } else {
        http_response_code(401);
        echo json_encode(array('error' => 'Usuario/Contraseña incorrecta'));
    }
} else {
    http_response_code(405);
    echo json_encode(array('error' => 'Método no permitido'));
}
?>

<?php
header('Content-Type: application/json');
session_start();
include "../Modelo/database.php";

// Middleware de sesión
if (isset($_POST['verificar_sesion'])) {
    if (isset($_SESSION['id_usuario'])) {
        echo json_encode(['success' => true, 'redirect' => '../Vista/gestionEstudiantes.html']);
    } else {
        echo json_encode(['success' => false]);
    }
    exit;
}

// Middleware directo
if (!isset($_POST['email']) && isset($_SESSION['id_usuario'])) {
    echo json_encode(['success' => true, 'redirect' => '../Vista/gestionEstudiantes.html']);
    exit;
}

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $email = $email . '@ucvvirtual.edu.pe';

    $sql = "SELECT * FROM usuarios WHERE correo = :email";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute(['email' => $email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            if ($usuario['estado'] == 1) {
                if (password_verify($password, $usuario["contra"])) {
                    $_SESSION['id_usuario'] = $usuario['id_usuario'];
                    $_SESSION['usuario'] = $usuario['usuario'];

                    // Actualizar acceso
                    $sqlUpdate = "UPDATE registros SET fecha_acceso = NOW(), tipo_acceso = 'login' WHERE id_usuario = :id";
                    $stmtUpdate = $db->prepare($sqlUpdate);
                    $stmtUpdate->execute(['id' => $usuario['id_usuario']]);

                    echo json_encode(['success' => true, 'redirect' => '../Vista/gestionEstudiantes.html']);
                    exit;
                } else {
                    $response['success'] = false;
                    $response['error'] = 'Contraseña incorrecta';
                }
            } else {
                $response['success'] = false;
                $response['error'] = 'Cuenta inactiva';
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'Usuario no encontrado';
        }
    } catch (Exception $e) {
        $response['success'] = false;
        $response['error'] = 'Error del servidor: ' . $e->getMessage();
    }

    echo json_encode($response);
    exit;
}
?>

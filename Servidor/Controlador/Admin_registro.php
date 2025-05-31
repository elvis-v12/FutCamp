<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
include "../Modelo/database.php";
require_once '../../Api/phpMailer/PHPMailerAutoload.php';

header('Content-Type: application/json');

// Asegurar que solo acepte POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$nombres = trim($_POST['nombres'] ?? '');
$apellidos = trim($_POST['apellidos'] ?? '');
$correo = trim($_POST['correo'] ?? '');
if (!str_ends_with($correo, '@ucvvirtual.edu.pe')) {
    $correo .= '@ucvvirtual.edu.pe';
}

$usuario = trim($_POST['usuario'] ?? '');
$password = $_POST['contra'] ?? '';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        sendError("Correo inválido");
    }

    $stmt = $db->prepare("SELECT * FROM usuarios WHERE correo = :correo OR usuario = :usuario");
    $stmt->bindParam(':correo', $correo);
    $stmt->bindParam(':usuario', $usuario);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        sendError("El correo o usuario ya están registrados");
    }

    $db->beginTransaction();

    $stmt = $db->prepare("INSERT INTO usuarios (nombres, apellidos, correo, contra, usuario, estado) 
                          VALUES (:nombres, :apellidos, :correo, :contra, :usuario, 0)");
    $stmt->bindParam(':nombres', $nombres);
    $stmt->bindParam(':apellidos', $apellidos);
    $stmt->bindParam(':correo', $correo);
    $stmt->bindParam(':contra', $hashed_password);
    $stmt->bindParam(':usuario', $usuario);
    $stmt->execute();

    $id_usuario = $db->lastInsertId();

    $stmt = $db->prepare("INSERT INTO registros (id_usuario, fecha_acceso, tipo_acceso) 
                          VALUES (:id_usuario, NOW(), 2)");
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();

    $db->commit();
    // OTP
    $otp = rand(100000, 999999);
    $_SESSION['otp'] = $otp;
    $_SESSION['mail'] = $correo;

    // Enviar correo
    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';

    $mail->Username = 'elvisvegaucv@gmail.com'; // Tu correo
    $mail->Password = 'wyit nukc fqsg sqwh '; // Tu contraseña de aplicación

    $mail->CharSet = 'UTF-8';
    $mail->setFrom('elvisvegaucv@gmail.com', 'FutCamp - Verificación');
    $mail->addAddress($correo);
    $mail->isHTML(true);
    $mail->Subject = "Código de verificación de cuenta";
    $mail->Body = "
        <h3>Hola $nombres,</h3>
        <p>Gracias por registrarte en FutCamp.</p>
        <p>Tu código de verificación es: <strong>$otp</strong></p>
        <p>Ingresa este código en la pantalla de verificación para activar tu cuenta.</p>
    ";

    if (!$mail->send()) {
        sendError("Error al enviar correo: " . $mail->ErrorInfo);
    }

    // Éxito
    echo json_encode(['success' => true, 'redirect' => '../Controlador/verificacion.php']);
    exit;

} catch (PDOException $e) {
    $db->rollBack();
    sendError("Error en la base de datos: " . $e->getMessage());
}

// Función de error estructurada
function sendError($msg) {
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

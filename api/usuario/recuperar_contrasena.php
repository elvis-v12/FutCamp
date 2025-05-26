<?php
require '../../vendor/autoload.php';
include '../config/database.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['correo'] ?? null;

    if (!$email) {
        echo "<script>
            alert('El correo es obligatorio');
            window.location.href = '../../View/olvidarContrasena.html';
            </script>";
        exit;
    }

    $stmt = $db->prepare("SELECT u.id_usuario, e.nombres FROM usuarios u JOIN estudiantes e ON u.usuario = e.usuario WHERE e.email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $token = bin2hex(random_bytes(50));
        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $stmt = $db->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)");
        $stmt->bindParam(':user_id', $user['id_usuario']);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires_at', $expiry);
        $stmt->execute();

        $resetLink = "http://localhost/Proyecto_FutCamp/View/restablecerContrasena.html?token=" . $token;

        if (sendResetEmail($email, $resetLink, $user['nombres'])) {
            echo "<script>
                alert('Correo de restablecimiento de contraseña enviado.');
                window.location.href = '../../View/index.html';
                </script>";
        } else {
            echo "<script>
                alert('No se pudo enviar el correo.');
                window.location.href = '../../View/index.html';
                </script>";
        }
    } else {
        echo "<script>
            alert('Correo no encontrado');
            window.location.href = '../../View/olvidarContrasena.html';
            </script>";
    }
}

function sendResetEmail($to, $link, $name) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'FutCampUcv@gmail.com';
        $mail->Password = 'g t n g b v h c g s p h e p s t';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('FutCampUcv@gmail.com', 'FutCampUcv');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = 'Restablecimiento de Password';
        $mail->Body    = "Hola $name,<br>Haga clic en el siguiente enlace para restablecer su contraseña:<br><a href='$link'>$link</a>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('Error al enviar el correo: ' . $mail->ErrorInfo);
        return false;
    }
}
?>

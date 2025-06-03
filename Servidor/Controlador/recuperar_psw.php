<?php
session_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recuperación de contraseña</title>
    <link rel="icon" type="image/x-icon" href="img/ucvitoFut.ico">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../Vista/css/r-password.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div class="wrapper">
        <form action="#" method="POST">
            <h1>Recupera tu contraseña</h1>
            <div class="input-box">
                <input type="text" id="email" name="email" placeholder="Ingresar Correo Electrónico" required>
            </div>
            <button type="submit" class="btn" name="recuperar">RECUPERAR</button>
            <div class="register-link">
              <p>Volver a <a href="../Vista/index.html">Iniciar sesión</a></p>
            </div>
        </form>
    </div>
</body>
</html>

<?php
include "../Modelo/database.php";
require_once '../../Api/phpMailer/PHPMailerAutoload.php';

if (isset($_POST["recuperar"])) {
    $email = trim($_POST['email']);

    // Asegurarse que tenga @ucvvirtual.edu.pe
    if (!str_ends_with($email, '@ucvvirtual.edu.pe')) {
        $email .= '@ucvvirtual.edu.pe';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo '<script>alert("El correo electrónico ingresado no es válido.");</script>';
        exit;
    }

    $stmt = $db->prepare('SELECT * FROM usuarios WHERE correo = :email');
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $fetch = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$fetch) {
        echo '<script>alert("No encontramos una cuenta asociada a ese correo.");</script>';
        exit;
    }

    if ($fetch['estado'] == 0) {
        echo '<script>alert("Su cuenta no está verificada. Por favor, verifíquela antes de recuperar la contraseña."); window.location.href="../Vista/index.html";</script>';
        exit;
    }

    $token = bin2hex(random_bytes(20));

    $stmt = $db->prepare('UPDATE usuarios SET token = :token WHERE correo = :email');
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $_SESSION['token'] = $token;
    $_SESSION['email'] = $email;

    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';

    $mail->Username = 'elvisvegaucv@gmail.com';
    $mail->Password = 'wyit nukc fqsg sqwh';

    $mail->CharSet = 'UTF-8';
    $mail->setFrom('elvisvegaucv@gmail.com', 'FutCamp - Recuperación');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = "Recuperación de contraseña";
    $mail->Body = '
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width:600px;margin:auto;padding:20px;border:1px solid #ccc;border-radius:8px;">
            <h2 style="background:#0059b3;color:white;padding:10px;text-align:center;">Restablecer Contraseña</h2>
            <p>Hola, <strong>' . htmlspecialchars($fetch['nombres']) . '</strong>,</p>
            <p>Has solicitado restablecer tu contraseña en FutCamp.</p>
            <p>Haz clic en el siguiente enlace para cambiarla:</p>
            <p style="text-align:center;margin:20px 0;">
               <a href="http://localhost/FutCamp/Servidor/Controlador/restablecer_psw.php?token=' . $token . '"
                style="background:#0059b3;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
                Restablecer Contraseña
                </a>
            </p>
            <p>Si tú no solicitaste esto, ignora este mensaje.</p>
            <p><strong>FutCamp</strong></p>
        </div>
    </body>
    </html>';

    if ($mail->send()) {
        header('Location: ../Vista/notificacion.html');
        exit;
    } else {
        echo '<script>alert("Error al enviar el correo. Intente más tarde.");</script>';
    }
}
?>
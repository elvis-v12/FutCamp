<?php
session_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de cuenta</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="../Vista/css/style.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div class="wrapper">
        <!-- Formulario de Verificación de cuenta -->
        <form action="#" method="POST">
            <h1>Verificación de cuenta</h1>
            <div class="input-box">
                <input type="text" id="otp" name="otp_code" placeholder="Ingresar Código OTP" required>
            </div>
            <button type="submit" class="btn" name="verificar">VERIFICAR</button>
        </form>
    </div>
</body>
</html>

<?php
include "../Modelo/database.php";

if (isset($_POST["verificar"])) {
    if (isset($_SESSION['otp']) && isset($_SESSION['mail'])) {
        $otp = $_SESSION['otp'];
        $email = $_SESSION['mail'];
        $otp_code = $_POST['otp_code'];

        if ($otp != $otp_code) {
            echo '<script>alert("Código OTP no válido, por favor inténtalo de nuevo.");</script>';
        } else {
            try {
                $db->beginTransaction();

                //  Cambiado a 'correo'
                $stmt = $db->prepare('UPDATE usuarios SET estado = 1 WHERE correo = :email');
                $stmt->bindParam(':email', $email);
                $stmt->execute();

                $stmt = $db->prepare('SELECT id_usuario FROM usuarios WHERE correo = :email');
                $stmt->bindParam(':email', $email);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                $id_usuario = $user['id_usuario'];

                $stmt = $db->prepare('UPDATE registros SET tipo_acceso = 1, fecha_acceso = NOW() WHERE id_usuario = :id_usuario');
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->execute();

                $db->commit();

                echo '<script>alert("Verificación de cuenta realizada, puedes iniciar sesión ahora."); window.location.replace("../Vista/index.html");</script>';
            } catch (PDOException $e) {
                $db->rollBack();
                echo '<script>alert("Hubo un error en la verificación: ' . $e->getMessage() . '");</script>';
            }
        }
    } else {
        echo '<script>alert("No hemos podido verificar tu cuenta. Por favor, intenta registrarte de nuevo.");</script>';
    }
}
?>

<?php
session_start();
include "../Modelo/database.php";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña</title>
    <link rel="icon" type="image/x-icon" href="img/ucvitoFut.ico">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="../Vista/css/style.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div class="wrapper">
          <!-- Restablecer contraseña -->
          <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST">
            <div class="logo">
                <img src="../Vista/img/ucvitoFut.ico">
                <h1>Recuperar Contraseña</h1>
            </div>
            <div class="input-box">
              <input type="password" id="password" name="password" placeholder="Contraseña" required>
            </div>
            <div class="input-box">
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirmar contraseña" required>
            </div>
        
            <button type="submit" class="btn" name="restablecer">RESTABLECER</button>
          </form>
    </div>
</body>
</html>

<?php
include "../Modelo/database.php";

// Verificar si la sesión ya existe
if (!isset($_SESSION['token']) || !isset($_SESSION['email'])) {
    header('Location: ../Vista/index.html');
    exit;
}
if (isset($_POST["restablecer"])) {
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];

    // Verifica existencia de sesión
    if (!isset($_SESSION['email']) || !isset($_SESSION['token'])) {
        echo "<script>alert('Sesión expirada. Solicita de nuevo el enlace de recuperación.'); window.location.replace('../Vista/index.html');</script>";
        exit;
    }

    $email = $_SESSION['email']; // Recuperar ANTES de destruir
    $token = $_SESSION['token'];

    // Validar coincidencia de contraseñas
    if ($password !== $confirm_password) {
        echo "<script>alert('Las contraseñas no coinciden.');</script>";
        exit;
    }

    // Hashear contraseña
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Actualizar la contraseña y eliminar el token
        $stmt = $db->prepare("UPDATE usuarios SET contra = :password, token = NULL WHERE correo = :email AND token = :token");
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        // Destruir sesión después de usar
        unset($_SESSION['email']);
        unset($_SESSION['token']);

        echo "<script>alert('Contraseña restablecida con éxito.'); window.location.replace('../Vista/index.html');</script>";
        exit;
    } catch (PDOException $e) {
        echo "<script>alert('Error al restablecer contraseña. Inténtalo más tarde.');</script>";
        exit;
    }
}

?>
<?php
require '../../vendor/autoload.php';
include '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $token = $_POST['token'] ?? null;
    $nuevaContrasena = $_POST['nuevaContrasena'] ?? null;
    $confirmarContrasena = $_POST['confirmarContrasena'] ?? null;

    if (!$token || !$nuevaContrasena || !$confirmarContrasena) {
        echo "<script>
            alert('Todos los campos son obligatorios');
            window.location.href = '../../View/restablecerContrasena.html';
            </script>";
        exit;
    }

    if ($nuevaContrasena !== $confirmarContrasena) {
        echo "<script>
            alert('Las contraseñas no coinciden');
            window.location.href = '../../View/restablecerContrasena.html';
            </script>";
        exit;
    }

    $stmt = $db->prepare("SELECT * FROM password_resets WHERE token = :token AND expires_at > NOW()");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $reset = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($reset) {
        $stmt = $db->prepare("UPDATE usuarios SET contrasena = :contrasena WHERE id_usuario = :id_usuario");
        $stmt->bindParam(':contrasena', $nuevaContrasena);
        $stmt->bindParam(':id_usuario', $reset['user_id']);
        $usuarioActualizado = $stmt->execute();

        $stmt = $db->prepare("UPDATE estudiantes SET contrasena = :contrasena WHERE usuario = (SELECT usuario FROM usuarios WHERE id_usuario = :id_usuario)");
        $stmt->bindParam(':contrasena', $nuevaContrasena);
        $stmt->bindParam(':id_usuario', $reset['user_id']);
        $estudianteActualizado = $stmt->execute();

        if ($usuarioActualizado && $estudianteActualizado) {
            $stmt = $db->prepare("DELETE FROM password_resets WHERE token = :token");
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            echo "<script>
                alert('Contraseña actualizada correctamente');
                window.location.href = '../../View/index.html';
                </script>";
        } else {
            echo "<script>
                alert('No se pudo actualizar la contraseña');
                window.location.href = '../../View/restablecerContrasena.html';
                </script>";
        }
    } else {
        echo "<script>
            alert('Token inválido o expirado');
            window.location.href = '../../View/index.html';
            </script>";
    }
} else {
    echo "<script>
        alert('Método no permitido');
        window.location.href = '../../View/index.html';
        </script>";
}
?>

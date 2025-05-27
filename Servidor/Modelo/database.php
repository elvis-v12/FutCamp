<?php
$hostname = "localhost";
$dbname = "futcamp";
$username = "root";
$password = "";

// Conexión a la base de datos
try {
    $db = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Se conecto correctamente a la base de datos";
} catch (PDOException $e) {
    echo "Error al conectarse a la base de datos" . $e->getmessage();
    exit;
}
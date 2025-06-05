<?php
$hostname = "localhost";
$dbname = "futcamp";
$username = "root";
$password = "";

// Conexión a la base de datos
try {
    // Agregar el parámetro charset=utf8 en la cadena de conexión
    $db = new PDO("mysql:host=$hostname;dbname=$dbname;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Conexión fallida: " . $e->getMessage()]));
}
<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        // Obtener todas las reservas con datos asociados
        $stmt = $db->prepare("
            SELECT 
                r.id_reserva AS id_reserva,
                e.nombres AS nombres,
                e.telefono AS telefono,
                r.num_personas,
                r.dia_reserva,
                h.hora_inicio AS hora_entrada,
                h.hora_fin AS hora_salida,
                r.comentarios,
                r.estado
            FROM reserva r
            INNER JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
            INNER JOIN horarios h ON r.id_horario = h.id_horario
            ORDER BY r.dia_reserva DESC, h.hora_inicio ASC
        ");
        $stmt->execute();
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reservas, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);
        $accion = $data["accion"] ?? "";

        // ---------------- EDITAR RESERVA ----------------
        if ($accion === "editar") {
            $id = $data['id'];
            $telefono = $data['telefono'];
            $personas = $data['personas'];
            $dia = ucfirst(strtolower($data['dia']));
            $horaEntrada = $data['horaEntrada'];
            $horaSalida = $data['horaSalida'];
            $comentarios = $data['comentarios'];

            if (strtotime($horaEntrada) >= strtotime($horaSalida)) {
                echo json_encode(["error" => "La hora de entrada debe ser menor que la hora de salida"]);
                exit;
            }

            // Buscar o insertar horario
            $stmt = $db->prepare("SELECT id_horario FROM horarios WHERE dia = ? AND hora_inicio = ? AND hora_fin = ?");
            $stmt->execute([$dia, $horaEntrada, $horaSalida]);
            $horario = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$horario) {
                $stmt = $db->prepare("INSERT INTO horarios (dia, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, 0)");
                $stmt->execute([$dia, $horaEntrada, $horaSalida]);
                $id_horario = $db->lastInsertId();
            } else {
                $id_horario = $horario['id_horario'];
            }

            // Actualizar reserva
            $stmt = $db->prepare("
                UPDATE reserva 
                SET telefono = ?, num_personas = ?, dia_reserva = ?, 
                    hora_entrada = ?, hora_salida = ?, comentarios = ?, id_horario = ?
                WHERE id_reserva = ?
            ");
            $stmt->execute([
                $telefono, $personas, date("Y-m-d"), // puedes cambiar esta línea si deseas conservar la fecha anterior
                $horaEntrada, $horaSalida, $comentarios,
                $id_horario, $id
            ]);

            echo json_encode(["success" => true, "message" => "Reserva actualizada correctamente."]);
            exit;
        }

      // ---------------- DESACTIVAR RESERVA ----------------
if ($accion === "desactivar") {
    $id = $data['id'];
    $stmt = $db->prepare("UPDATE reserva SET estado = 'inactiva' WHERE id_reserva = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true, "message" => "Reserva desactivada correctamente."]);
    exit;
}

        // Acción no reconocida
        echo json_encode(["error" => "Acción no reconocida."]);
        exit;
    }

    // Método no permitido
    echo json_encode(["error" => "Método HTTP no permitido."]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

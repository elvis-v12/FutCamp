<?php
session_start();
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
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

        if ($accion === "editar") {
            $id = $data['id'];
            $telefono = $data['telefono'];
            $personas = $data['personas'];
            $dia = $data['dia']; // formato YYYY-MM-DD
            $horaEntrada = $data['horaEntrada'];
            $horaSalida = $data['horaSalida'];
            $comentarios = $data['comentarios'];

            if (strtotime($horaEntrada) >= strtotime($horaSalida)) {
                echo json_encode(["error" => "La hora de entrada debe ser menor que la de salida"]);
                exit;
            }

            // Convertir fecha a nombre del día en español
            $fechaObj = new DateTime($dia);
            $nombre_dia = strtolower($fechaObj->format('l'));
            $dias_es = [
                "monday" => "lunes",
                "tuesday" => "martes",
                "wednesday" => "miércoles",
                "thursday" => "jueves",
                "friday" => "viernes",
                "saturday" => "sábado",
                "sunday" => "domingo"
            ];
            $diaTexto = $dias_es[$nombre_dia];

            // Obtener id_horario actual de la reserva
            $stmt = $db->prepare("SELECT id_horario FROM reserva WHERE id_reserva = ?");
            $stmt->execute([$id]);
            $reserva = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$reserva) {
                echo json_encode(["error" => "Reserva no encontrada"]);
                exit;
            }

            $id_horario = $reserva['id_horario'];

            // Actualizar la tabla horarios con el día como texto y las horas
            $stmt = $db->prepare("UPDATE horarios SET dia = ?, hora_inicio = ?, hora_fin = ? WHERE id_horario = ?");
            $stmt->execute([$diaTexto, $horaEntrada, $horaSalida, $id_horario]);

            // Actualizar tabla reserva con la fecha original
            $stmt = $db->prepare("
                UPDATE reserva 
                SET telefono = ?, num_personas = ?, dia_reserva = ?, 
                    hora_entrada = ?, hora_salida = ?, comentarios = ?
                WHERE id_reserva = ?
            ");
            $stmt->execute([
                $telefono, $personas, $dia,
                $horaEntrada, $horaSalida, $comentarios,
                $id
            ]);

            echo json_encode(["success" => true, "message" => "Reserva actualizada correctamente."]);
            exit;
        }

        if ($accion === "desactivar") {
            $id = $data['id'];
            $stmt = $db->prepare("UPDATE reserva SET estado = 'inactiva' WHERE id_reserva = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => true, "message" => "Reserva desactivada correctamente."]);
            exit;
        }

        echo json_encode(["error" => "Acción no reconocida"]);
        exit;
    }

    echo json_encode(["error" => "Método HTTP no permitido"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

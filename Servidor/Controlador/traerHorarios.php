<?php
header("Content-Type: application/json");
require_once("../Modelo/database.php");

try {
    $stmt = $db->prepare("
        SELECT 
            r.id_reserva AS id,
            e.nombres,
            h.dia,
            h.hora_inicio,
            h.hora_fin,
            r.telefono,
            r.num_personas AS personas,
            r.comentarios,
            r.dia_reserva
        FROM reserva r
        INNER JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
        INNER JOIN horarios h ON r.id_horario = h.id_horario
        WHERE r.estado = 'Activa'
    ");
    $stmt->execute();
    $reservas = [];

    $diasNumericos = [
        "lunes" => 1,
        "martes" => 2,
        "miércoles" => 3,
        "miercoles" => 3,
        "jueves" => 4,
        "viernes" => 5,
        "sábado" => 6,
        "sabado" => 6,
        "domingo" => 7
    ];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $horaInicio = intval(substr($row['hora_inicio'], 0, 2));
        $horaFin = intval(substr($row['hora_fin'], 0, 2));
        $duracion = $horaFin - $horaInicio;
        if ($duracion <= 0) continue;

        $diaTexto = mb_strtolower(trim($row['dia']), 'UTF-8');
        $diaNumero = $diasNumericos[$diaTexto] ?? 0;

        $reservas[] = [
            "id" => (int)$row['id'],
            "nombres" => $row['nombres'],
            "dia" => $diaNumero,
            "hora" => $horaInicio,
            "duracion" => $duracion,
            "telefono" => $row['telefono'],
            "personas" => (int)$row['personas'],
            "comentarios" => $row['comentarios'],
            "fecha" => $row['dia_reserva']  // ← ✅ NUEVO CAMPO para filtrado por semana
        ];
    }

    echo json_encode($reservas);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

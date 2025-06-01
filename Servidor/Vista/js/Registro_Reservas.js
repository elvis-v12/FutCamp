function reservar() {
    const codigo = document.getElementById("codigo").value;
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const personas = document.getElementById("personas").value;
    const dia = document.getElementById("dia").value;
    const hora_entrada = document.getElementById("hora-entrada").value;
    const hora_salida = document.getElementById("hora-salida").value;
    const comentarios = document.getElementById("comentarios").value;

    if (!codigo || !telefono || !personas || !dia || !hora_entrada || !hora_salida) {
        alert("Por favor completa todos los campos requeridos.");
        return;
    }

    fetch("../Controlador/Registro_reserva.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            codigo, telefono, personas, dia,
            hora_entrada, hora_salida, comentarios
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            limpiarCampos();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => {
        console.error("Error al enviar la reserva:", err);
    });
}

function limpiarCampos() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("personas").value = "";
    document.getElementById("dia").value = "";
    document.getElementById("hora-entrada").value = "";
    document.getElementById("hora-salida").value = "";
    document.getElementById("comentarios").value = "";
}

  function cargarHorarios() {
    const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    const horas = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00"
    ];

    const tabla = document.getElementById("schedule-body");
    tabla.innerHTML = "";

    for (let h of horas) {
        const fila = document.createElement("tr");
        const celdaHora = document.createElement("td");
        celdaHora.innerHTML = `<i class="fas fa-clock"></i> ${h}`;
        fila.appendChild(celdaHora);

        for (let d of dias) {
            const celda = document.createElement("td");
            celda.setAttribute("data-dia", d);
            celda.setAttribute("data-hora", h);
            celda.textContent = "Disponible";
            celda.style.textAlign = "center";
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }

    // Pintar horarios reservados
    fetch("../Controlador/obtenerHorarios.php")
        .then(res => res.json())
        .then(data => {
            data.forEach(reserva => {
                const { dia, entrada } = reserva;
                const diaLower = dia.toLowerCase();
                const celda = document.querySelector(`td[data-dia="${diaLower}"][data-hora="${entrada}"]`);
                if (celda) {
                    celda.textContent = "Reservado";
                    celda.style.backgroundColor = "#f8d7da";
                    celda.style.color = "#721c24";
                    celda.style.fontWeight = "bold";
                }
            });
        });
}
window.onload = () => {
    cargarHorarios();
    // ... ya estaba esto:
   fetch("../Controlador/obtenerUsuario.php")
        .then(res => res.json())
        .then(data => {
    if (data.nombres) {
        document.getElementById("nombre-usuario").textContent = data.nombres.split(' ')[0];
    }
});

}

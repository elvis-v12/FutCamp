function reservar() {
    const codigo = document.getElementById("codigo").value;
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const personas = document.getElementById("personas").value;
    const fechaReserva = document.getElementById("fecha-reserva").value;
    const horaEntrada = document.getElementById("hora-entrada").value;
    const horaSalida = document.getElementById("hora-salida").value;
    const comentarios = document.getElementById("comentarios").value;

    if (!codigo || !telefono || !personas || !fechaReserva || !horaEntrada || !horaSalida) {
        alert("Por favor completa todos los campos requeridos.");
        return;
    }

    if (horaEntrada >= horaSalida) {
        alert("La hora de entrada debe ser menor que la hora de salida.");
        return;
    }

    const [diaStr, mesStr, anioStr] = fechaReserva.split("/");
const fechaISO = `${anioStr}-${mesStr}-${diaStr}`;
const dia = new Date(fechaISO).toLocaleDateString("es-ES", { weekday: 'long' }).toLowerCase();
console.log("Día interpretado:", dia);  // te mostrará 'lunes', 'martes', etc.


    fetch("../Controlador/Registro_reserva.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            codigo,
            telefono,
            personas,
            fechaReserva,
            horaEntrada,
            horaSalida,
            comentarios,
            dia,
            accion: "registrar"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            limpiarCampos();
            cargarHorarios(); // Actualiza horarios disponibles
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
    document.getElementById("fecha-reserva").value = "";
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
            celda.style.backgroundColor = "#d4edda"; // verde claro
            celda.style.color = "#155724";
            celda.style.fontWeight = "bold";

            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }

    const diaMap = {
        'lunes': 'lunes',
        'martes': 'martes',
        'miércoles': 'miércoles',
        'jueves': 'jueves',
        'viernes': 'viernes',
        'sábado': 'sábado',
        'domingo': 'domingo'
    };

    fetch("../Controlador/obtenerHorarios.php")
        .then(res => res.json())
        .then(data => {
            data.forEach(reserva => {
                const { dia, entrada, salida } = reserva;
                const diaMapped = diaMap[dia.toLowerCase()] ?? dia.toLowerCase();

                let start = horas.indexOf(entrada);
                let end = horas.indexOf(salida);

                if (start !== -1 && end !== -1) {
                    for (let i = start; i < end; i++) {
                        const celda = document.querySelector(`td[data-dia="${diaMapped}"][data-hora="${horas[i]}"]`);
                        if (celda) {
                            celda.textContent = "Reservado";
                            celda.style.backgroundColor = "#f8d7da"; // rojo
                            celda.style.color = "#721c24";
                            celda.style.fontWeight = "bold";
                        }
                    }
                }
            });
        });
}

window.onload = () => {
    cargarHorarios();

    fetch("../Controlador/obtenerUsuario.php")
        .then(res => res.json())
        .then(data => {
            if (data.nombres) {
                document.getElementById("nombre-usuario").textContent = data.nombres.split(' ')[0];
            }
        });

    document.querySelector(".search-btn").addEventListener("click", () => {
        const codigo = document.getElementById("codigo").value.trim();
        if (!codigo) return;

        fetch(`../../Servidor/Controlador/obtenerEstudiante.php?codigo=${codigo}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                document.getElementById("nombre").value = data.nombres;
                document.getElementById("telefono").value = data.telefono;
            });
    });
};

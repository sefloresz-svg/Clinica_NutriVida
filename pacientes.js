document.addEventListener("DOMContentLoaded", function () {
    cargarPacientes();
});

function cargarPacientes() {
    let tabla = document.getElementById("tablaPacientes");
    if (!tabla) return;

    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];

    if (citasGuardadas.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">No hay pacientes con citas registradas en el sistema.</td>
            </tr>
        `;
        return;
    }

    let html = "";
    citasGuardadas.forEach(cita => {
        html += `
            <tr>
                <td class="fw-bold">${cita.paciente}</td>
                <td>${cita.rut || 'N/A'}</td>
                <td>${cita.fecha} - ${cita.hora} hrs</td>
                <td>${cita.servicio}</td>
                <td><span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">Activo</span></td>
            </tr>
        `;
    });

    tabla.innerHTML = html;
}

function filtrarPacientes() {
    let filtro = document.getElementById("inputBuscar").value.toLowerCase();
    let filas = document.querySelectorAll("#tablaPacientes tr");

    filas.forEach(fila => {
        let textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}
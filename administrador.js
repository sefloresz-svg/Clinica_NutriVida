document.addEventListener("DOMContentLoaded", function () {
    cargarCitasEnAdmin();
});

function cargarCitasEnAdmin() {
    const tbody = document.getElementById("tablaCitasAdmin");
    if (!tbody) return;

    const citas = JSON.parse(localStorage.getItem("citas")) || [];

    if (citas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No hay citas agendadas en el sistema.</td></tr>`;
        return;
    }

    let html = "";
    citas.forEach(cita => {
        html += `
            <tr>
                <td><strong>${cita.paciente}</strong><br><small style="color: #64748b;">RUT: ${cita.rut}</small></td>
                <td>${cita.servicio}</td>
                <td>${cita.nutricionista}</td>
                <td>${cita.fecha} - ${cita.hora} hrs</td>
                <td><span class="badge confirmado">${cita.estado || 'Confirmada'}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}
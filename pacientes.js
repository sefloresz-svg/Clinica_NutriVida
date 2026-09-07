document.addEventListener("DOMContentLoaded", function () {
    cargarPacientes();
});

// Extrae las palabras clave del nombre ignorando títulos como Nut., Dra., Dr.
function obtenerPalabrasClave(nombre) {
    if (!nombre) return [];
    let ignorar = ["nut.", "nut", "dra.", "dra", "dr.", "dr"];
    return nombre.toLowerCase()
        .split(" ")
        .map(p => p.trim())
        .filter(p => p.length > 1 && !ignorar.includes(p));
}

function coincidenNombres(nombre1, nombre2) {
    let palabras1 = obtenerPalabrasClave(nombre1);
    let palabras2 = obtenerPalabrasClave(nombre2);

    // Retorna true si comparten al menos un nombre o apellido principal (ej: carolina o fuentes)
    return palabras1.some(p => palabras2.includes(p));
}

function cargarPacientes() {
    let tabla = document.getElementById("tablaPacientes");
    if (!tabla) return;

    let sesion = JSON.parse(sessionStorage.getItem("sesionNutriVida")) || {};
    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];

    let citasVisibles = [];

    if (sesion.rol === "Admin") {
        citasVisibles = citasGuardadas;
    } else if (sesion.rol === "Nutricionista") {
        citasVisibles = citasGuardadas.filter(c => coincidenNombres(c.nutricionista, sesion.nombre));
    }

    if (citasVisibles.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No tienes citas ni pacientes asignados en tu agenda actualmente.
                </td>
            </tr>
        `;
        return;
    }

    let html = "";
    citasVisibles.forEach((c) => {
        html += `
            <tr>
                <td class="fw-bold">${c.paciente}</td>
                <td>${c.rut || 'N/A'}</td>
                <td>${c.fecha} - ${c.hora} hrs</td>
                <td>${c.servicio}</td>
                <td><span class="badge bg-purple-subtle text-dark">${c.nutricionista}</span></td>
                <td>
                    <button class="btn btn-sm text-white fw-bold" style="background-color: #6b21a8;" 
                        onclick="abrirModalFicha('${c.rut}', '${c.paciente}', '${c.nutricionista}')">
                        Ficha Clínica
                    </button>
                </td>
            </tr>
        `;
    });

    tabla.innerHTML = html;
}

function abrirModalFicha(rut, pacienteNombre, nutricionistaCita) {
    let sesion = JSON.parse(sessionStorage.getItem("sesionNutriVida")) || {};

    if (sesion.rol === "Nutricionista" && !coincidenNombres(nutricionistaCita, sesion.nombre)) {
        alert("Acceso Denegado: No puedes ver los datos clínicos de pacientes asignados a otros nutricionistas.");
        return;
    }

    document.getElementById("fichaRut").value = rut;
    document.getElementById("fichaRutMostrar").value = rut;
    document.getElementById("fichaNombre").value = pacienteNombre;
    document.getElementById("fichaNutriAsignado").value = nutricionistaCita;

    let fichas = JSON.parse(localStorage.getItem("fichasClinicas")) || {};
    let fichaExistente = fichas[rut];

    if (fichaExistente) {
        document.getElementById("fichaPeso").value = fichaExistente.peso || "";
        document.getElementById("fichaEstatura").value = fichaExistente.estatura || "";
        document.getElementById("fichaDiagnostico").value = fichaExistente.diagnostico || "";
        document.getElementById("fichaIndicaciones").value = fichaExistente.indicaciones || "";
    } else {
        document.getElementById("fichaPeso").value = "";
        document.getElementById("fichaEstatura").value = "";
        document.getElementById("fichaDiagnostico").value = "";
        document.getElementById("fichaIndicaciones").value = "";
    }

    let modal = new bootstrap.Modal(document.getElementById("modalFicha"));
    modal.show();
}

function guardarFichaClinica(event) {
    event.preventDefault();

    let rut = document.getElementById("fichaRut").value;
    let peso = document.getElementById("fichaPeso").value;
    let estatura = document.getElementById("fichaEstatura").value;
    let diagnostico = document.getElementById("fichaDiagnostico").value.trim();
    let indicaciones = document.getElementById("fichaIndicaciones").value.trim();
    let nutriAsignado = document.getElementById("fichaNutriAsignado").value;

    let fichas = JSON.parse(localStorage.getItem("fichasClinicas")) || {};

    fichas[rut] = {
        peso: peso,
        estatura: estatura,
        diagnostico: diagnostico,
        indicaciones: indicaciones,
        nutricionista: nutriAsignado,
        ultimaActualizacion: new Date().toLocaleDateString()
    };

    localStorage.setItem("fichasClinicas", JSON.stringify(fichas));

    alert("¡Ficha clínica guardada con éxito!");

    let modalElement = document.getElementById("modalFicha");
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
}

function filtrarPacientes() {
    let filtro = document.getElementById("inputBuscar").value.toLowerCase();
    let filas = document.querySelectorAll("#tablaPacientes tr");

    filas.forEach(fila => {
        let textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
}
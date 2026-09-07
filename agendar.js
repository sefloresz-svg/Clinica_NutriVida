let nutricionistas = [
    { codigo: "NUT001", nombre: "Nut. Carolina Fuentes M." },
    { codigo: "NUT002", nombre: "Nut. Rodrigo Sepúlveda A." },
    { codigo: "NUT003", nombre: "Nut. Daniela Morales C." },
    { codigo: "NUT004", nombre: "Nut. Felipe Araya R." }
];

let servicios = [
    { codigo: "CN001", nombre: "Primera consulta nutricional ($35.000)" },
    { codigo: "CN002", nombre: "Control nutricional ($25.000)" },
    { codigo: "PL001", nombre: "Plan pérdida de peso - 1 mes ($65.000)" },
    { codigo: "PL003", nombre: "Plan nutrición deportiva ($70.000)" },
    { codigo: "EV001", nombre: "Antropometría completa ($18.000)" }
];

document.addEventListener("DOMContentLoaded", function () {
    cargarOpcionesSelects();
    autocompletarDatos();
    mostrarCitasGuardadas();
});

function cargarOpcionesSelects() {
    let selectNutri = document.getElementById("selectNutricionista");
    let selectServ = document.getElementById("selectServicio");

    if (!selectNutri || !selectServ) return;

    selectNutri.innerHTML = '<option value="">Seleccione un profesional</option>';
    selectServ.innerHTML = '<option value="">Seleccione un servicio</option>';

    for (let i = 0; i < nutricionistas.length; i++) {
        selectNutri.innerHTML += `<option value="${nutricionistas[i].nombre}">${nutricionistas[i].nombre}</option>`;
    }

    for (let i = 0; i < servicios.length; i++) {
        selectServ.innerHTML += `<option value="${servicios[i].nombre}">${servicios[i].nombre}</option>`;
    }

    let servicioElegido = localStorage.getItem("servicioSeleccionado");
    if (servicioElegido) {
        let servEncontrado = servicios.find(s => s.codigo === servicioElegido);
        if (servEncontrado) selectServ.value = servEncontrado.nombre;
        localStorage.removeItem("servicioSeleccionado");
    }

    let nutriElegido = localStorage.getItem("nutricionistaSeleccionado");
    if (nutriElegido) {
        let nutriEncontrado = nutricionistas.find(n => n.codigo === nutriElegido);
        if (nutriEncontrado) selectNutri.value = nutriEncontrado.nombre;
        localStorage.removeItem("nutricionistaSeleccionado");
    }
}

function autocompletarDatos() {
    let sesion = JSON.parse(sessionStorage.getItem("sesionNutriVida"));
    let campoNombre = document.getElementById("nombrePaciente");
    if (sesion && sesion.nombre && campoNombre) {
        campoNombre.value = sesion.nombre;
    }
}

function validarYAgendar(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombrePaciente").value.trim();
    let rut = document.getElementById("rutPaciente").value.trim();
    let servicio = document.getElementById("selectServicio").value;
    let nutricionista = document.getElementById("selectNutricionista").value;
    let fecha = document.getElementById("fechaCita").value;
    let hora = document.getElementById("horaCita").value;
    let motivo = document.getElementById("motivoCita").value.trim();

    let mensajeError = document.getElementById("mensajeError");
    let mensajeExito = document.getElementById("mensajeExito");

    if (mensajeError) mensajeError.textContent = "";
    if (mensajeExito) mensajeExito.textContent = "";

    if (nombre.length < 3) {
        if (mensajeError) mensajeError.textContent = "El nombre del paciente debe tener al menos 3 caracteres.";
        return;
    }

    if (!servicio || !nutricionista) {
        if (mensajeError) mensajeError.textContent = "Por favor seleccione un servicio y un nutricionista.";
        return;
    }

    let nuevaCita = {
        id: Date.now(),
        paciente: nombre,
        rut: rut,
        servicio: servicio,
        nutricionista: nutricionista,
        fecha: fecha,
        hora: hora,
        motivo: motivo || "Sin especificación",
        estado: "Confirmada"
    };

    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
    citasGuardadas.push(nuevaCita);
    localStorage.setItem("citas", JSON.stringify(citasGuardadas));

    if (mensajeExito) mensajeExito.textContent = "¡Cita agendada con éxito en Clínica NutriVida!";
    
    document.getElementById("formAgendar").reset();
    autocompletarDatos();
    mostrarCitasGuardadas();
}

function mostrarCitasGuardadas() {
    let listaCitasDiv = document.getElementById("listaCitas");
    if (!listaCitasDiv) return;

    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];

    if (citasGuardadas.length === 0) {
        listaCitasDiv.innerHTML = "<p class='text-muted'>No tienes citas agendadas actualmente.</p>";
        return;
    }

    let html = "<ul class='list-group'>";
    for (let i = 0; i < citasGuardadas.length; i++) {
        let c = citasGuardadas[i];
        html += `
            <li class='list-group-item mb-2 rounded border'>
                <strong>Cita #${i + 1}</strong> - ${c.fecha} a las ${c.hora} hrs.<br>
                <strong>Paciente:</strong> ${c.paciente} (${c.rut})<br>
                <strong>Atiende:</strong> ${c.nutricionista}<br>
                <strong>Servicio:</strong> ${c.servicio}<br>
                <button class='btn btn-sm btn-outline-danger mt-2' onclick='cancelarCita(${i})'>Cancelar Cita</button>
            </li>
        `;
    }
    html += "</ul>";
    listaCitasDiv.innerHTML = html;
}

function cancelarCita(posicion) {
    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
        citasGuardadas.splice(posicion, 1);
        localStorage.setItem("citas", JSON.stringify(citasGuardadas));
        mostrarCitasGuardadas();
    }
}
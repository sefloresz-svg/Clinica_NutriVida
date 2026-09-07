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

const BLOQUES_HORARIOS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
];

document.addEventListener("DOMContentLoaded", function () {
    configurarRestriccionesFecha();
    cargarOpcionesSelects();
    cargarHorariosSelect();
    autocompletarDatos();
    mostrarCitasGuardadas();
});

// Valida únicamente el FORMATO: sin puntos y con guión (Ej: 12345678-9)
function validarRut(rut) {
    let regex = /^\d{7,8}-[0-9kK]$/;
    return regex.test(rut.trim());
}

function configurarRestriccionesFecha() {
    let inputFecha = document.getElementById("fechaCita");
    if (!inputFecha) return;

    let hoy = new Date().toISOString().split("T")[0];
    inputFecha.setAttribute("min", hoy);

    inputFecha.addEventListener("change", function () {
        if (!this.value) return;
        
        const [year, month, day] = this.value.split('-').map(Number);
        const fechaElegida = new Date(year, month - 1, day);
        const diaSemana = fechaElegida.getDay();

        let mensajeError = document.getElementById("mensajeError");

        if (diaSemana === 0 || diaSemana === 6) {
            if (mensajeError) mensajeError.textContent = "La clínica atiende solo de Lunes a Viernes. Elige un día hábil.";
            this.value = "";
        } else {
            if (mensajeError) mensajeError.textContent = "";
        }
    });
}

function cargarHorariosSelect() {
    let selectHora = document.getElementById("horaCita");
    if (!selectHora) return;

    selectHora.innerHTML = '<option value="">Seleccione hora</option>';
    BLOQUES_HORARIOS.forEach(hora => {
        selectHora.innerHTML += `<option value="${hora}">${hora} hrs</option>`;
    });
}

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

    // VALIDACIÓN DE FORMATO DE RUT
    if (!validarRut(rut)) {
        if (mensajeError) mensajeError.textContent = "Formato de RUT inválido. Debe ser sin puntos y con guión (Ej: 12345678-9).";
        return;
    }

    if (!servicio || !nutricionista || !fecha || !hora) {
        if (mensajeError) mensajeError.textContent = "Por favor completa todos los campos del formulario.";
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
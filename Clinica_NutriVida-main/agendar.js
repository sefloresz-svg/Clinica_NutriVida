// Data extraída del caso NutriVida
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

// 1. Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    cargarOpcionesSelects();
    autocompletarDatos();
    mostrarCitasGuardadas();
});

// Carga dinámicamente las opciones en los <select>
function cargarOpcionesSelects() {
    let selectNutri = document.getElementById("selectNutricionista");
    let selectServ = document.getElementById("selectServicio");

    for (let i = 0; i < nutricionistas.length; i++) {
        selectNutri.innerHTML += `<option value="${nutricionistas[i].nombre}">${nutricionistas[i].nombre}</option>`;
    }

    for (let i = 0; i < servicios.length; i++) {
        selectServ.innerHTML += `<option value="${servicios[i].codigo}">${servicios[i].nombre}</option>`;
    }

    // Si viene desde "servicios.html", autoselecciona el servicio elegido
    let servicioElegido = localStorage.getItem("servicioSeleccionado");
    if (servicioElegido) {
        selectServ.value = servicioElegido;
        localStorage.removeItem("servicioSeleccionado"); // Limpia el temporal
    }
    // Para que el botón "Agendar hora con este profesional"
    let nutriElegido = localStorage.getItem("nutricionistaSeleccionado");
    if (nutriElegido) {
        selectNutri.value = nutriElegido;
        localStorage.removeItem("nutricionistaSeleccionado"); // Limpiar valor temporal
}
}

// Autocompleta el nombre del usuario si está logueado
function autocompletarDatos() {
    let usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesion"));
    if (usuarioSesion && usuarioSesion.nombre) {
        document.getElementById("nombrePaciente").value = usuarioSesion.nombre;
    }
}

// 2. Validación y Agendamiento
function validarYAgendar(event) {
    event.preventDefault(); // Evita recargar la página

    let nombre = document.getElementById("nombrePaciente").value.trim();
    let rut = document.getElementById("rutPaciente").value.trim();
    let servicio = document.getElementById("selectServicio").value;
    let nutricionista = document.getElementById("selectNutricionista").value;
    let fecha = document.getElementById("fechaCita").value;
    let hora = document.getElementById("horaCita").value;
    let motivo = document.getElementById("motivoCita").value.trim();

    let mensajeError = document.getElementById("mensajeError");
    let mensajeExito = document.getElementById("mensajeExito");

    mensajeError.textContent = "";
    mensajeExito.textContent = "";

    // VALIDACIÓN 1: Nombre con mínimo 3 caracteres
    if (nombre.length < 3) {
        mensajeError.textContent = "El nombre del paciente debe tener al menos 3 caracteres.";
        return;
    }

    // VALIDACIÓN 2: Fecha no sea anterior a hoy
    let fechaSeleccionada = new Date(fecha);
    let fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
        mensajeError.textContent = "La fecha de la cita no puede ser una fecha pasada.";
        return;
    }

    // Objeto de la cita a guardar
    let nuevaCita = {
        id: Date.now(), // ID único basado en tiempo
        paciente: nombre,
        rut: rut,
        servicio: servicio,
        nutricionista: nutricionista,
        fecha: fecha,
        hora: hora,
        motivo: motivo || "Sin especificación",
        estado: "Confirmada"
    };

    // Guardar en LocalStorage (Arreglo de citas)
    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
    citasGuardadas.push(nuevaCita);
    localStorage.setItem("citas", JSON.stringify(citasGuardadas));

    // Feedback al usuario y limpieza del formulario
    mensajeExito.textContent = "¡Cita agendada con éxito en Clínica NutriVida!";
    document.getElementById("formAgendar").reset();
    autocompletarDatos(); // Vuelve a rellenar el nombre del usuario logueado

    mostrarCitasGuardadas();
}

// 3. Renderizar el listado desde LocalStorage
function mostrarCitasGuardadas() {
    let listaCitasDiv = document.getElementById("listaCitas");
    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];

    if (citasGuardadas.length === 0) {
        listaCitasDiv.innerHTML = "<p>No tienes citas agendadas actualmente.</p>";
        return;
    }

    let html = "<ul>";
    for (let i = 0; i < citasGuardadas.length; i++) {
        let c = citasGuardadas[i];
        html += `
            <li>
                <strong>Cita #${i + 1}</strong> - ${c.fecha} a las ${c.hora} hrs.<br>
                <strong>Paciente:</strong> ${c.paciente} (${c.rut})<br>
                <strong>Atiende:</strong> ${c.nutricionista}<br>
                <strong>Servicio (Código):</strong> ${c.servicio}<br>
                <button onclick="cancelarCita(${i})">Cancelar Cita</button>
                <hr>
            </li>
        `;
    }
    html += "</ul>";
    listaCitasDiv.innerHTML = html;
}

// Función para Eliminar del arreglo (Requisito CRUD)
function cancelarCita(posicion) {
    let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
    
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
        citasGuardadas.splice(posicion, 1); // Elimina de la posición
        localStorage.setItem("citas", JSON.stringify(citasGuardadas)); // Actualiza localStorage
        mostrarCitasGuardadas(); // Redibuja la vista
    }
}
// Arreglo de servicios extraídos de la ficha oficial de NutriVida
let servicios = [
    {
        codigo: "CN001",
        tipo: "Consulta",
        nombre: "Primera consulta nutricional",
        duracion: "50 min",
        modalidad: "Presencial",
        precio: 35000,
        descripcion: "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio."
    },
    {
        codigo: "CN002",
        tipo: "Consulta",
        nombre: "Control nutricional (seguimiento)",
        duracion: "30 min",
        modalidad: "Presencial",
        precio: 25000,
        descripcion: "Seguimiento mensual: medición de indicadores y ajuste del plan vigente."
    },
    {
        codigo: "PL001",
        tipo: "Plan especializado",
        nombre: "Plan pérdida de peso (1 mes)",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: 65000,
        descripcion: "Incluye primera consulta + 1 control quincenal + plan personalizado + seguimiento WhatsApp."
    },
    {
        codigo: "PL003",
        tipo: "Plan especializado",
        nombre: "Plan nutrición deportiva (1 mes)",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: 70000,
        descripcion: "Para deportistas y personas con actividad física frecuente. Cálculo de requerimientos."
    },
    {
        codigo: "PL005",
        tipo: "Plan especializado",
        nombre: "Plan alimentación vegetariana/vegana",
        duracion: "1 mes",
        modalidad: "Presencial",
        precio: 68000,
        descripcion: "Garantiza aporte adecuado de proteínas, hierro, vitamina B12 y calcio sin productos animales."
    }
];

function cargarServicios() {
    let contenedor = document.getElementById("contenedorServicios");
    let html = "";

    for (let i = 0; i < servicios.length; i++) {
        html += `
        <div class="tarjeta-servicio">
            <span class="etiqueta">${servicios[i].tipo}</span>
            <h3>${servicios[i].nombre}</h3>
            <p><strong>Código:</strong> ${servicios[i].codigo}</p>
            <p><strong>Duración / Modalidad:</strong> ${servicios[i].duracion} | ${servicios[i].modalidad}</p>
            <p>${servicios[i].descripcion}</p>
            <p class="precio">Precio: $${servicios[i].precio}</p>
            <button onclick="seleccionarServicio('${servicios[i].codigo}')">Reservar este servicio</button>
            <hr>
        </div>
        `;
    }

    contenedor.innerHTML = html;
}

function seleccionarServicio(codigo) {
    // Guarda el código seleccionado para autocompletar en el agendamiento
    localStorage.setItem("servicioSeleccionado", codigo);
    window.location.href = "agendar.html";
}

// Ejecución al cargar el archivo
cargarServicios();
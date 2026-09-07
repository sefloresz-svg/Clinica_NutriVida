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

function mostrarServicios() {
    let contenedor = document.getElementById("contenedorServicios");
    let html = "";

    for (let i = 0; i < servicios.length; i++) {
        let s = servicios[i];
        html += `
            <div class="tarjeta-servicio">
                <div>
                    <span class="tipo-badge">${s.tipo}</span>
                    <h3>${s.nombre}</h3>
                    <p class="detalles"><strong>Código:</strong> ${s.codigo}</p>
                    <p class="detalles"><strong>Duración:</strong> ${s.duracion} | ${s.modalidad}</p>
                    <p>${s.descripcion}</p>
                </div>
                <div>
                    <div class="precio">$${s.precio.toLocaleString("es-CL")}</div>
                    <button type="button" class="btn-reservar" onclick="seleccionarServicio('${s.codigo}')">
                        Reservar este servicio
                    </button>
                </div>
            </div>
        `;
    }

    contenedor.innerHTML = html;
}

function seleccionarServicio(codigo) {
    localStorage.setItem("servicioSeleccionado", codigo);
    window.location.href = "agendar.html";
}

// Ejecutar al cargar
mostrarServicios();
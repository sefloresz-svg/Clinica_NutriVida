// Arreglo de datos del equipo clínico
let equipo = [
    {
        codigo: "NUT001",
        nombre: "Nut. Carolina Fuentes M.",
        titulo: "Licenciada en Nutrición y Dietética, Universidad de La Frontera",
        especialidad: "Nutrición Clínica y Pérdida de Peso",
        registro: "RNPI-45821",
        descripcion: "Especialista con más de 8 años de experiencia en tratamiento integral de la obesidad y reeducación alimentaria."
    },
    {
        codigo: "NUT002",
        nombre: "Nut. Rodrigo Sepúlveda A.",
        titulo: "Master en Nutrición Deportiva",
        especialidad: "Rendimiento Deportivo y Antropometría ISAK II",
        registro: "RNPI-52109",
        descripcion: "Asesor nutricional para deportistas de alto rendimiento y personas con estilo de vida activo en la Región de La Araucanía."
    },
    {
        codigo: "NUT003",
        nombre: "Nut. Daniela Morales C.",
        titulo: "Diplomada en Alimentación Basada en Plantas",
        especialidad: "Alimentación Vegetariana y Vegana",
        registro: "RNPI-61430",
        descripcion: "Acompañamiento en la transición hacia dietas vegetarianas/veganas asegurando un óptimo aporte de nutrientes sin déficit."
    },
    {
        codigo: "NUT004",
        nombre: "Nut. Felipe Araya R.",
        titulo: "Especialista en Nutrición Metabólica y Pediátrica",
        especialidad: "Diabetes, Hipertensión y Salud Infantil",
        registro: "RNPI-39871",
        descripcion: "Enfocado en la gestión de patologías crónicas no transmisibles y hábitos alimentarios en etapa escolar."
    }
];

// Función para renderizar el equipo en la vista
function cargarEquipo() {
    const contenedor = document.getElementById("contenedorNutricionistas");
    if (!contenedor) return;

    let html = "";
    equipo.forEach((nutri, index) => {
        html += `
            <div class="tarjeta-nutri">
                <h3>${nutri.nombre}</h3>
                <img src="${nutri.foto}" alt="${nutri.nombre}" class="foto-nutri" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
                <span class="especialidad-tag">${nutri.especialidad}</span>
                
                <div class="acciones-nutri">
                    <button class="btn-detalle" onclick="verDescripcion(${index})">Ver descripción</button>
                    <button class="btn-agendar-nutri" onclick="agendarCon('${nutri.codigo}')">Agendar Cita</button>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

function verDescripcion(index) {
    const nutri = nutricionistas[index];
    document.getElementById("modalNombre").innerText = nutri.nombre;
    document.getElementById("modalTexto").innerText = nutri.descripcion;
    document.getElementById("modalDetalle").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modalDetalle").style.display = "none";
}

function agendarCon(codigoNutri) {
    localStorage.setItem("nutricionistaSeleccionado", codigoNutri);
    window.location.href = "agendar.html";
}

cargarEquipo();
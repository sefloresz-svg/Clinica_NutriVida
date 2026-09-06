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
function mostrarEquipo() {
    let contenedor = document.getElementById("contenedorEquipo");
    let html = "";

    for (let i = 0; i < equipo.length; i++) {
        let prof = equipo[i];
        html += `
            <div class="tarjeta-profesional" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
                <h3>${prof.nombre}</h3>
                <p><strong>Especialidad:</strong> ${prof.especialidad}</p>
                <p><strong>Formación:</strong> ${prof.titulo}</p>
                <p><strong>Registro Minsal:</strong> ${prof.registro}</p>
                <p>${prof.descripcion}</p>
                <button type="button" onclick="agendarConProfesional('${prof.nombre}')">Agendar hora con este profesional</button>
            </div>
        `;
    }

    contenedor.innerHTML = html;
}

// Guarda la preferencia y redirige al formulario de reserva
function agendarConProfesional(nombreNutricionista) {
    localStorage.setItem("nutricionistaSeleccionado", nombreNutricionista);
    window.location.href = "agendar.html";
}

// Ejecución inicial al cargar el script
mostrarEquipo();
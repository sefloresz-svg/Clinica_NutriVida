document.addEventListener("DOMContentLoaded", () => {
    const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
    let paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual === "") paginaActual = "index.html";

    // 1. Redirigir a login si no hay sesión
    if (!sesionGuardada && paginaActual !== "login.html") {
        window.location.href = "login.html";
        return;
    }

    if (!sesionGuardada) return;

    const sesion = JSON.parse(sesionGuardada);

    // 2. Control de acceso/permisos
    const permisosPaginas = {
        "gestion.html": ["Admin"],
        "administrador.html": ["Admin"],
        "pacientes.html": ["Admin", "Nutricionista"],
        "VerPacientes.html": ["Admin", "Nutricionista"],
        "agendar.html": ["Admin", "Paciente"]
    };

    if (permisosPaginas[paginaActual] && !permisosPaginas[paginaActual].includes(sesion.rol)) {
        alert(`Acceso denegado: El rol '${sesion.rol}' no tiene permisos para esta página.`);
        window.location.href = "index.html";
        return;
    }

    // 3. Renderizar usuario en la barra superior (<div id="seccion-usuario"></div>)
    const contenedorUsuario = document.getElementById("seccion-usuario");
    if (contenedorUsuario) {
        contenedorUsuario.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="user-name" style="font-weight: 600; color: #334155;">${sesion.nombre} (${sesion.rol})</span>
                <button class="btn-logout" onclick="cerrarSesion()" style="background-color: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">Cerrar Sesión</button>
            </div>
        `;
    }

    // 4. Mostrar u ocultar botones de navegación según 'data-rol'
    document.querySelectorAll(".nav-links a[data-rol]").forEach(enlace => {
        const rolesPermitidos = enlace.getAttribute("data-rol").split(",");
        if (rolesPermitidos.includes(sesion.rol)) {
            enlace.style.display = "inline-block";
        } else {
            enlace.style.display = "none";
        }
    });
});

function cerrarSesion() {
    sessionStorage.removeItem("sesionNutriVida");
    window.location.href = "login.html";
}
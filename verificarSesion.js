document.addEventListener("DOMContentLoaded", () => {
    aplicarVistasPorRol();
});

function aplicarVistasPorRol() {
    // Recuperar datos de sesión
    const sesionRaw = sessionStorage.getItem("sesionNutriVida");
    const sesion = sesionRaw ? JSON.parse(sesionRaw) : null;
    
    const rolActual = sesion ? sesion.rol : "Invitado";
    const nombreUsuario = sesion ? sesion.nombre : "";

    // 1. Actualizar la barra superior (Nombre + Cerrar Sesión)
    const contenedorUsuario = document.getElementById("seccion-usuario");
    if (contenedorUsuario) {
        if (sesion) {
            contenedorUsuario.innerHTML = `
                <div class="user-session-container">
                    <span class="user-name">👤 <strong>${nombreUsuario}</strong> <small>(${rolActual})</small></span>
                    <button id="btnCerrarSesion" class="btn-logout">Cerrar sesión</button>
                </div>
            `;
            document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);
        } else {
            contenedorUsuario.innerHTML = `
                <div class="user-session-container">
                    <a href="login.html" class="btn-login">Iniciar sesión</a>
                </div>
            `;
        }
    }

    // 2. Controlar la visibilidad de elementos según el atributo data-rol
    const elementosRestringidos = document.querySelectorAll("[data-rol]");

    elementosRestringidos.forEach(elem => {
        // Obtenemos los roles permitidos listados en el atributo HTML (ej: data-rol="Admin,Nutricionista")
        const rolesPermitidos = elem.getAttribute("data-rol").split(",").map(r => r.trim());

        if (rolesPermitidos.includes(rolActual)) {
            elem.style.display = ""; // Mostrar elemento
        } else {
            elem.style.display = "none"; // Ocultar elemento
        }
    });
}

function cerrarSesion() {
    sessionStorage.removeItem("sesionNutriVida");
    window.location.href = "login.html";
}
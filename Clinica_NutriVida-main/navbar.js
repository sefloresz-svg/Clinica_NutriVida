document.addEventListener("DOMContentLoaded", () => {
    const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
    const contenedorUsuario = document.getElementById("seccion-usuario");

    if (sesionGuardada && contenedorUsuario) {
        const sesion = JSON.parse(sesionGuardada);
        
        // Inyecta el nombre del usuario y el botón de cierre de sesión
        contenedorUsuario.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="user-name" style="font-weight: 600; color: #334155;">${sesion.nombre} (${sesion.rol})</span>
                <button class="btn-logout" onclick="cerrarSesion()">Cerrar Sesión</button>
            </div>
        `;

        // Oculta o muestra los enlaces del menú según el rol del usuario
        document.querySelectorAll(".nav-links a[data-rol]").forEach(enlace => {
            const rolesPermitidos = enlace.getAttribute("data-rol").split(",");
            if (!rolesPermitidos.includes(sesion.rol)) {
                enlace.style.display = "none";
            }
        });
    }
});

function cerrarSesion() {
    sessionStorage.removeItem("sesionNutriVida");
    window.location.href = "login.html";
}
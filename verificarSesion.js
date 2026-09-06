// Leemos si hay alguien logueado en el navegador
let usuarioSesion = localStorage.getItem("usuarioSesion");

// Si NO existe sesión guardada, lo mandamos al login de inmediato
if (!usuarioSesion) {
    window.location.href = "login.html";
}
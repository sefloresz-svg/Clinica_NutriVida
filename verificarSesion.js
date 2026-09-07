// Se ejecuta al cargar la página en el <head>
const sesionGuardada = sessionStorage.getItem("sesionNutriVida");

if (!sesionGuardada) {
    // Si no hay sesión activa, redirige inmediatamente al login
    window.location.href = "login.html";
}
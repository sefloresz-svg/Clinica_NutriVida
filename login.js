const USUARIOS = [
    { correo: "admin@nutrivida.cl", nombre: "Administrador", rol: "Admin", clave: "1234" },
    { correo: "nutricionista@nutrivida.cl", nombre: "Dr. Nutricionista", rol: "Nutricionista", clave: "1234" },
    { correo: "usuario@nutrivida.cl", nombre: "Juan Pérez", rol: "Usuario", clave: "1234" }
];

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin") || document.querySelector("form");

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const inputCorreo = document.getElementById("correo") || document.querySelector('input[type="email"]');
            const inputClave = document.getElementById("clave") || document.querySelector('input[type="password"]');

            const correoIngresado = inputCorreo.value.trim().toLowerCase();
            const claveIngresada = inputClave.value.trim();

            const usuario = USUARIOS.find(u => u.correo.toLowerCase() === correoIngresado && u.clave === claveIngresada);

            if (usuario) {
                const sesion = {
                    nombre: usuario.nombre,
                    rol: usuario.rol
                };
                sessionStorage.setItem("sesionNutriVida", JSON.stringify(sesion));
                
                // Redirección directa
                window.location.href = "index.html";
            } else {
                alert("Correo o contraseña incorrectos.\nPrueba con: usuario@nutrivida.cl / 1234");
            }
        });
    }
});
const USUARIOS = [
    { correo: "admin@nutrivida.cl", nombre: "Administrador General", rol: "Admin", clave: "1234" },
    { correo: "nutri@nutrivida.cl", nombre: "Dra. Carolina Fuentes", rol: "Nutricionista", clave: "1234" },
    { correo: "usuario@nutrivida.cl", nombre: "Juan Pérez", rol: "Paciente", clave: "1234" }
];

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.querySelector("form");
    if (!formLogin) return;

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputCorreo = document.getElementById("email") || document.getElementById("correo") || document.querySelector('input[type="email"]');
        const inputClave = document.getElementById("password") || document.getElementById("clave") || document.querySelector('input[type="password"]');

        if (!inputCorreo || !inputClave) {
            alert("Error: No se encontraron los campos en el formulario.");
            return;
        }

        const correo = inputCorreo.value.trim().toLowerCase();
        const clave = inputClave.value.trim();

        const usuario = USUARIOS.find(u => u.correo.toLowerCase() === correo && u.clave === clave);

        if (usuario) {
            sessionStorage.setItem("sesionNutriVida", JSON.stringify({
                nombre: usuario.nombre,
                rol: usuario.rol,
                correo: usuario.correo
            }));
            window.location.href = "index.html";
        } else {
            alert("Correo o contraseña incorrectos.\nPrueba con: admin@nutrivida.cl / 1234");
        }
    });
});
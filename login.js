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

        // 1. Capturamos los campos soportando tanto 'correo'/'email' como 'clave'/'password'
        const inputCorreo = document.getElementById("correo") || document.getElementById("email");
        const inputClave = document.getElementById("clave") || document.getElementById("password");

        if (!inputCorreo || !inputClave) {
            alert("Error: Revisa los IDs de tus campos en el HTML.");
            return;
        }

        const correo = inputCorreo.value.trim().toLowerCase();
        const clave = inputClave.value.trim();

        // 2. Obtenemos la lista de usuarios (sea de la variable global o de localStorage)
        const listaUsuarios = (typeof USUARIOS !== "undefined") 
            ? USUARIOS 
            : JSON.parse(localStorage.getItem("usuarios NutriVida")) || JSON.parse(localStorage.getItem("usuarios")) || [];

        // 3. Validamos las credenciales
        const usuario = listaUsuarios.find(u => u.correo.toLowerCase() === correo && u.clave === clave);

        if (usuario) {
            sessionStorage.setItem("sesionNutriVida", JSON.stringify(usuario));
            window.location.href = "index.html";
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    });
});
// Usuarios registrados de prueba
let usuarios = [
    { correo: "admin@nutrivida.cl", pass: "1234", rol: "admin", nombre: "Administrador" },
    { correo: "nutri@nutrivida.cl", pass: "1234", rol: "nutricionista", nombre: "Nut. Carolina" },
    { correo: "paciente@gmail.com", pass: "1234", rol: "paciente", nombre: "Juan Pérez" }
];

function iniciarSesion() {
    let correo = document.getElementById("correoInput").value;
    let pass = document.getElementById("passInput").value;
    let mensajeError = document.getElementById("mensajeError");

    let usuarioEncontrado = null;

    // Buscamos con un bucle for si coinciden el correo y la clave
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo && usuarios[i].pass === pass) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    if (usuarioEncontrado !== null) {
        // Guardamos el objeto entero transformado a texto con JSON.stringify
        localStorage.setItem("usuarioSesion", JSON.stringify(usuarioEncontrado));
        
        // Redirigimos a la página principal
        window.location.href = "index.html";
    } else {
        mensajeError.textContent = "Correo o contraseña incorrectos.";
    }
}
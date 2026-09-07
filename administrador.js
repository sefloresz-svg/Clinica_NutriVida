document.addEventListener("DOMContentLoaded", function () {
    inicializarUsuariosBase();
    cargarUsuarios();
});

function inicializarUsuariosBase() {
    if (!localStorage.getItem("usuariosSistema")) {
        let usuariosIniciales = [
            { id: 1, nombre: "Administrador General", iden: "admin@nutrivida.cl", rol: "Admin", activo: true },
            { id: 2, nombre: "Nut. Carolina Fuentes", iden: "cfuentes@nutrivida.cl", rol: "Nutricionista", activo: true },
            { id: 3, nombre: "Juan Pérez", iden: "12345678-9", rol: "Paciente", activo: true }
        ];
        localStorage.setItem("usuariosSistema", JSON.stringify(usuariosIniciales));
    }
}

function cargarUsuarios() {
    let tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return;

    let usuarios = JSON.parse(localStorage.getItem("usuariosSistema")) || [];

    let html = "";
    usuarios.forEach((u, index) => {
        let estadoBadge = u.activo 
            ? '<span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1">Activo</span>'
            : '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1">Desactivado</span>';

        html += `
            <tr>
                <td class="fw-bold">${u.nombre}</td>
                <td>${u.iden}</td>
                <td>
                    <select class="form-select form-select-sm w-75" onchange="cambiarRol(${index}, this.value)">
                        <option value="Paciente" ${u.rol === 'Paciente' ? 'selected' : ''}>Paciente</option>
                        <option value="Nutricionista" ${u.rol === 'Nutricionista' ? 'selected' : ''}>Nutricionista</option>
                        <option value="Admin" ${u.rol === 'Admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>${estadoBadge}</td>
                <td>
                    <button class="btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'}" onclick="toggleEstado(${index})">
                        ${u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
            </tr>
        `;
    });

    tabla.innerHTML = html;
}

function guardarUsuario(event) {
    event.preventDefault();

    let nombre = document.getElementById("usrNombre").value.trim();
    let iden = document.getElementById("usrIdentificador").value.trim();
    let rol = document.getElementById("usrRol").value;

    let usuarios = JSON.parse(localStorage.getItem("usuariosSistema")) || [];

    usuarios.push({
        id: Date.now(),
        nombre: nombre,
        iden: iden,
        rol: rol,
        activo: true
    });

    localStorage.setItem("usuariosSistema", JSON.stringify(usuarios));

    document.getElementById("formUsuario").reset();
    
    // Cerrar el Modal
    let modalElement = document.getElementById("modalUsuario");
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    cargarUsuarios();
}

function cambiarRol(index, nuevoRol) {
    let usuarios = JSON.parse(localStorage.getItem("usuariosSistema")) || [];
    usuarios[index].rol = nuevoRol;
    localStorage.setItem("usuariosSistema", JSON.stringify(usuarios));
    cargarUsuarios();
}

function toggleEstado(index) {
    let usuarios = JSON.parse(localStorage.getItem("usuariosSistema")) || [];
    usuarios[index].activo = !usuarios[index].activo;
    localStorage.setItem("usuariosSistema", JSON.stringify(usuarios));
    cargarUsuarios();
}
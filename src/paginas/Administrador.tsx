import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: number;
  nombre: string;
  correoOrRut: string;
  rol: "Admin" | "Nutricionista" | "Paciente";
  estado: "Activo" | "Inactivo";
}

function Administrador() {
  const navigate = useNavigate();
  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");

  // 🔒 Control de acceso exclusivo para rol 'Admin'
  useEffect(() => {
    if (!sesionGuardada) {
      alert("Debes iniciar sesión para acceder al panel administrativo.");
      navigate("/login");
      return;
    }

    const sesion = JSON.parse(sesionGuardada);
    if (sesion.rol !== "Admin") {
      alert("Acceso denegado. Este apartado es exclusivo para Administradores.");
      navigate("/");
    }
  }, [sesionGuardada, navigate]);

  // Cargar usuarios desde sessionStorage o usar los iniciales
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const guardados = sessionStorage.getItem("usuariosNutriVida");
    if (guardados) {
      try {
        return JSON.parse(guardados);
      } catch (e) {
        console.error("Error al parsear usuarios guardados:", e);
      }
    }
    return [
      {
        id: 1,
        nombre: "Administrador General",
        correoOrRut: "admin@nutrivida.cl",
        rol: "Admin",
        estado: "Activo",
      },
      {
        id: 2,
        nombre: "Nut. Carolina Fuentes",
        correoOrRut: "cfuentes@nutrivida.cl",
        rol: "Nutricionista",
        estado: "Activo",
      },
      {
        id: 3,
        nombre: "Juan Pérez",
        correoOrRut: "12345678-9",
        rol: "Paciente",
        estado: "Activo",
      },
    ];
  });

  // Guardar en sessionStorage automáticamente al crear o modificar un usuario
  useEffect(() => {
    sessionStorage.setItem("usuariosNutriVida", JSON.stringify(usuarios));
  }, [usuarios]);

  // Estado para controlar la visibilidad del formulario emergente (Modal)
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estados de los campos del formulario
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreoRut, setNuevoCorreoRut] = useState("");
  const [nuevoRol, setNuevoRol] = useState<"Admin" | "Nutricionista" | "Paciente">("Paciente");

  if (!sesionGuardada) return null;
  const sesion = JSON.parse(sesionGuardada);
  if (sesion.rol !== "Admin") return null;

  // Cambiar rol de un usuario existente
  const manejarCambioRol = (id: number, rolActualizado: "Admin" | "Nutricionista" | "Paciente") => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, rol: rolActualizado } : u))
    );
  };

  // Alternar estado Activo / Inactivo
  const alternarEstado = (id: number) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" }
          : u
      )
    );
  };

  // Función ejecutada al enviar el formulario
  const manejarCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoNombre.trim() || !nuevoCorreoRut.trim()) {
      alert("Por favor completa el nombre y el correo/RUT.");
      return;
    }

    const usuarioNuevo: Usuario = {
      id: Date.now(),
      nombre: nuevoNombre.trim(),
      correoOrRut: nuevoCorreoRut.trim(),
      rol: nuevoRol,
      estado: "Activo",
    };

    // Agregar el nuevo usuario a la lista
    setUsuarios([...usuarios, usuarioNuevo]);

    // Limpiar inputs y cerrar el formulario emergente
    setNuevoNombre("");
    setNuevoCorreoRut("");
    setNuevoRol("Paciente");
    setMostrarModal(false);
  };

  return (
    <div className="container my-4">
      {/* Banner Superior */}
      <div
        className="p-4 p-md-5 rounded-4 text-white mb-4 shadow-sm"
        style={{ backgroundColor: "#6b21a8" }}
      >
        <h1 className="fw-bold mb-2 display-6">Panel de Administración</h1>
        <p className="mb-0 fs-6 opacity-90">
          Resumen operativo de la clínica, reportes y gestión integral de usuarios.
        </p>
      </div>

      {/* Tarjetas Informativas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Citas hoy</span>
            <h2 className="fw-bold text-dark mb-1 display-6">24</h2>
            <span className="text-success small fw-bold">+12% vs. ayer</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Pacientes activos</span>
            <h2 className="fw-bold text-dark mb-1 display-6">186</h2>
            <span className="text-success small fw-bold">+8 nuevos este mes</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Ingresos mes</span>
            <h2 className="fw-bold text-dark mb-1 display-6">$1.8M</h2>
            <span className="text-success small fw-bold">+15% respecto al mes pasado</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Consultas online</span>
            <h2 className="fw-bold text-dark mb-1 display-6">17</h2>
            <span className="text-warning fw-bold small">4 pendientes por confirmar</span>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios y Roles */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Gestión de Usuarios y Roles</h4>
            <p className="text-muted small mb-0">
              Crear, editar roles y activar/desactivar acceso a usuarios.
            </p>
          </div>
          
          {/* BOTÓN CREAR USUARIO QUE ACTIVA EL FORMULARIO */}
          <button
            className="btn text-white rounded-3 px-3 py-2 fw-bold text-nowrap"
            style={{ backgroundColor: "#6b21a8" }}
            onClick={() => setMostrarModal(true)}
          >
            + Crear Usuario
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="border-bottom text-uppercase">
                <th className="text-muted small fw-bold py-3">NOMBRE</th>
                <th className="text-muted small fw-bold py-3">CORREO / RUT</th>
                <th className="text-muted small fw-bold py-3">ROL ASIGNADO</th>
                <th className="text-muted small fw-bold py-3">ESTADO</th>
                <th className="text-muted small fw-bold py-3">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-bottom">
                  <td className="fw-bold text-dark py-3">{u.nombre}</td>
                  <td className="text-muted py-3">{u.correoOrRut}</td>
                  <td className="py-3" style={{ minWidth: "160px" }}>
                    <select
                      className="form-select form-select-sm border-secondary-subtle"
                      value={u.rol}
                      onChange={(e) =>
                        manejarCambioRol(
                          u.id,
                          e.target.value as "Admin" | "Nutricionista" | "Paciente"
                        )
                      }
                    >
                      <option value="Admin">Admin</option>
                      <option value="Nutricionista">Nutricionista</option>
                      <option value="Paciente">Paciente</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        u.estado === "Activo"
                          ? "bg-success-subtle text-success border border-success-subtle"
                          : "bg-secondary-subtle text-secondary border border-secondary-subtle"
                      }`}
                    >
                      {u.estado}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      className={`btn btn-sm fw-semibold rounded-2 px-3 ${
                        u.estado === "Activo"
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                      onClick={() => alternarEstado(u.id)}
                    >
                      {u.estado === "Activo" ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO EMERGENTE (MODAL CON INPUTS) */}
      {mostrarModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Crear Nuevo Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>

              <form onSubmit={manejarCrearUsuario}>
                <div className="modal-body">
                  {/* Input Nombre */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Ej: Dra. María López"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      required
                    />
                  </div>

                  {/* Input Correo / RUT */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Correo Electrónico o RUT
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="mlopez@nutrivida.cl o 12345678-9"
                      value={nuevoCorreoRut}
                      onChange={(e) => setNuevoCorreoRut(e.target.value)}
                      required
                    />
                  </div>

                  {/* Selector Rol */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Rol Asignado
                    </label>
                    <select
                      className="form-select rounded-3"
                      value={nuevoRol}
                      onChange={(e) =>
                        setNuevoRol(
                          e.target.value as "Admin" | "Nutricionista" | "Paciente"
                        )
                      }
                    >
                      <option value="Paciente">Paciente</option>
                      <option value="Nutricionista">Nutricionista</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Botones de acción del formulario */}
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-3 px-3 fw-semibold"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn text-white rounded-3 px-4 fw-bold"
                    style={{ backgroundColor: "#6b21a8" }}
                  >
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Administrador;
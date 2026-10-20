import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: number;
  nombre: string;
  correoOrRut: string;
  rol: string;
  estado: "Activo" | "Inactivo";
}

function Administrador() {
  const navigate = useNavigate();
  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");

  // 🔒 CONTROL DE ACCESO EXCLUSIVO
  // Verifica que exista una sesión activa y que el rol sea exactamente 'Admin'
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

  // Datos mock iniciales idénticos a los de la imagen
  const [usuarios, setUsuarios] = useState<Usuario[]>([
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
  ]);

  // Si no cumple los permisos, evita renderizar la interfaz antes de redirigir
  if (!sesionGuardada) return null;
  const sesion = JSON.parse(sesionGuardada);
  if (sesion.rol !== "Admin") return null;

  // Función para cambiar el rol de un usuario desde la tabla
  const manejarCambioRol = (id: number, nuevoRol: string) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
    );
  };

  // Función para Activar/Desactivar usuarios
  const alternarEstado = (id: number) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" }
          : u
      )
    );
  };

  return (
    <div className="container my-4">
      {/* 1. Banner Principal Púrpura */}
      <div
        className="p-4 p-md-5 rounded-4 text-white mb-4 shadow-sm"
        style={{ backgroundColor: "#6b21a8" }}
      >
        <h1 className="fw-bold mb-2 display-6">Panel de Administración</h1>
        <p className="mb-0 fs-6 opacity-90">
          Resumen operativo de la clínica, reportes y gestión integral de usuarios.
        </p>
      </div>

      {/* 2. Tarjetas de Métricas (KPIs) */}
      <div className="row g-3 mb-4">
        {/* Citas hoy */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Citas hoy</span>
            <h2 className="fw-bold text-dark mb-1 display-6">24</h2>
            <span className="text-success small fw-bold">+12% vs. ayer</span>
          </div>
        </div>

        {/* Pacientes activos */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Pacientes activos</span>
            <h2 className="fw-bold text-dark mb-1 display-6">186</h2>
            <span className="text-success small fw-bold">+8 nuevos este mes</span>
          </div>
        </div>

        {/* Ingresos mes */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Ingresos mes</span>
            <h2 className="fw-bold text-dark mb-1 display-6">$1.8M</h2>
            <span className="text-success small fw-bold">+15% respecto al mes pasado</span>
          </div>
        </div>

        {/* Consultas online */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small fw-bold mb-1">Consultas online</span>
            <h2 className="fw-bold text-dark mb-1 display-6">17</h2>
            <span className="text-warning fw-bold small">4 pendientes por confirmar</span>
          </div>
        </div>
      </div>

      {/* 3. Sección Gestión de Usuarios y Roles */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Gestión de Usuarios y Roles</h4>
            <p className="text-muted small mb-0">
              Crear, editar roles y activar/desactivar acceso a usuarios.
            </p>
          </div>
          <button
            className="btn text-white rounded-3 px-3 py-2 fw-bold text-nowrap"
            style={{ backgroundColor: "#6b21a8" }}
            onClick={() => alert("Formulario para crear un nuevo usuario.")}
          >
            + Crear Usuario
          </button>
        </div>

        {/* Tabla de Usuarios */}
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="border-bottom">
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
                      onChange={(e) => manejarCambioRol(u.id, e.target.value)}
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
    </div>
  );
}

export default Administrador;
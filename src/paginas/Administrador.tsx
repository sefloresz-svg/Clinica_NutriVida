import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Importar la hoja de estilos de la carpeta creada
import "../estilos/admin.css";

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

  if (!sesionGuardada) return null;
  const sesion = JSON.parse(sesionGuardada);
  if (sesion.rol !== "Admin") return null;

  const manejarCambioRol = (id: number, nuevoRol: string) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
    );
  };

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
    <div className="admin-page-wrapper">
      <div className="container my-2">
        
        {/* Banner Principal Claro/Elegante */}
        <div className="admin-header-banner mb-4">
          <h1 className="fw-bold mb-2 display-6">Panel de Administración</h1>
          <p className="mb-0 fs-6 opacity-90">
            Resumen operativo de la clínica, reportes y gestión integral de usuarios.
          </p>
        </div>

        {/* Tarjetas de Métricas (KPIs) */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-card-kpi h-100">
              <span className="admin-kpi-title d-block mb-1">Citas hoy</span>
              <h2 className="admin-kpi-value mb-1">24</h2>
              <span className="text-success small fw-bold">+12% vs. ayer</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-card-kpi h-100">
              <span className="admin-kpi-title d-block mb-1">Pacientes activos</span>
              <h2 className="admin-kpi-value mb-1">186</h2>
              <span className="text-success small fw-bold">+8 nuevos este mes</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-card-kpi h-100">
              <span className="admin-kpi-title d-block mb-1">Ingresos mes</span>
              <h2 className="admin-kpi-value mb-1">$1.8M</h2>
              <span className="text-success small fw-bold">+15% respecto al mes pasado</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="admin-card-kpi h-100">
              <span className="admin-kpi-title d-block mb-1">Consultas online</span>
              <h2 className="admin-kpi-value mb-1">17</h2>
              <span className="text-warning fw-bold small">4 pendientes por confirmar</span>
            </div>
          </div>
        </div>

        {/* Gestión de Usuarios y Roles */}
        <div className="admin-table-card">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">Gestión de Usuarios y Roles</h4>
              <p className="text-muted small mb-0">
                Crear, editar roles y activar/desactivar acceso a usuarios.
              </p>
            </div>
            <button
              className="btn btn-admin-primary px-3 py-2 text-nowrap"
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
                        className="form-select form-select-sm admin-select-role"
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
                            ? "admin-badge-active"
                            : "admin-badge-inactive"
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
    </div>
  );
}

export default Administrador;
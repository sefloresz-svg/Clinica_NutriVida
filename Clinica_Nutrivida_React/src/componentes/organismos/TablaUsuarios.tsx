import type { UsuarioSesion } from "../../utils/api";

interface TablaUsuariosProps {
  usuarios: UsuarioSesion[];
  // id del Admin conectado (no puede cambiarse el rol ni desactivarse a sí mismo)
  idSesion: number;
  alCambiarRol: (id: number, nuevoRol: string) => void;
  alAlternarEstado: (usuario: UsuarioSesion) => void;
}

// Tabla de usuarios del panel de administración
function TablaUsuarios({ usuarios, idSesion, alCambiarRol, alAlternarEstado }: TablaUsuariosProps) {
  return (
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
              <td className="text-muted py-3">
                {u.correo}
                {u.rut && <div className="small">{u.rut}</div>}
              </td>
              <td className="py-3" style={{ minWidth: "160px" }}>
                {/* Un nutricionista tiene perfil en la tabla nutricionista: se maneja desde esa página */}
                {u.rol === "Nutricionista" ? (
                  <div>
                    <span className="fw-semibold text-dark">Nutricionista</span>
                    <div className="small text-muted">Se gestiona en Nutricionistas</div>
                  </div>
                ) : (
                  <select
                    className="form-select form-select-sm admin-select-role"
                    value={u.rol}
                    onChange={(e) => alCambiarRol(u.id, e.target.value)}
                    disabled={u.id === idSesion}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Paciente">Paciente</option>
                  </select>
                )}
              </td>
              <td className="py-3">
                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    u.activo ? "admin-badge-active" : "admin-badge-inactive"
                  }`}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="py-3">
                {u.id !== idSesion && (
                  <button
                    className={`btn btn-sm fw-semibold rounded-2 px-3 ${
                      u.activo ? "btn-outline-danger" : "btn-outline-success"
                    }`}
                    onClick={() => alAlternarEstado(u)}
                  >
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;

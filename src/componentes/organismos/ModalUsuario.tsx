import Input from "../atomos/Input";
import type { FormularioUsuario } from "../../utils/tipos";

interface ModalUsuarioProps {
  formulario: FormularioUsuario;
  enviando: boolean;
  alCambiar: (campo: string, valor: string) => void;
  alGuardar: (e: React.FormEvent) => void;
  alCerrar: () => void;
}

// Modal "+ Crear Usuario" del panel de administración
function ModalUsuario({ formulario, enviando, alCambiar, alGuardar, alCerrar }: ModalUsuarioProps) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <form onSubmit={alGuardar}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold text-dark">Crear Usuario</h5>
              <button type="button" className="btn-close" onClick={alCerrar}></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold small">Nombre completo</label>
                <Input tipo="text" nombre="nombre" valor={formulario.nombre}
                  alCambiar={(valor) => alCambiar("nombre", valor)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small">RUT (opcional, sin puntos y con guion)</label>
                <Input tipo="text" nombre="rut" valor={formulario.rut} placeholder="12345678-5"
                  alCambiar={(valor) => alCambiar("rut", valor)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small">Correo</label>
                <Input tipo="email" nombre="correo" valor={formulario.correo}
                  alCambiar={(valor) => alCambiar("correo", valor)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small">Contraseña (mínimo 8 caracteres)</label>
                <Input tipo="password" nombre="contrasena" valor={formulario.contrasena}
                  alCambiar={(valor) => alCambiar("contrasena", valor)} />
              </div>
              <div className="mb-1">
                <label className="form-label fw-bold small">Rol</label>
                {/* Sin "Nutricionista": esa cuenta necesita perfil y horarios, se crea en la página Nutricionistas */}
                <select className="form-select" value={formulario.rol}
                  onChange={(e) => alCambiar("rol", e.target.value)}>
                  <option value="Paciente">Paciente</option>
                  <option value="Admin">Admin</option>
                </select>
                <small className="text-muted">
                  Para que un nutricionista aparezca en el equipo, créalo desde la página Nutricionistas.
                </small>
              </div>
            </div>
            <div className="modal-footer border-0 bg-light">
              <button type="button" className="btn btn-secondary fw-bold px-4 rounded-3" onClick={alCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success fw-bold px-4 rounded-3" disabled={enviando}>
                {enviando ? "Enviando..." : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalUsuario;

import Input from "../atomos/Input";
import type { FormularioNutricionista } from "../../utils/tipos";

interface ModalNutricionistaProps {
  formulario: FormularioNutricionista;
  editando: boolean;
  enviando: boolean;
  alCambiar: (campo: string, valor: string) => void;
  alGuardar: (e: React.FormEvent) => void;
  alCerrar: () => void;
}

// Modal para crear o editar un nutricionista (solo Admin)
function ModalNutricionista({ formulario, editando, enviando, alCambiar, alGuardar, alCerrar }: ModalNutricionistaProps) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <form onSubmit={alGuardar}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold text-dark">
                {editando ? "Editar Nutricionista" : "Nuevo Nutricionista"}
              </h5>
              <button type="button" className="btn-close" onClick={alCerrar}></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold small">Nombre (sin "Nut.")</label>
                <Input tipo="text" nombre="nombre" valor={formulario.nombre} placeholder="Carolina Fuentes M."
                  alCambiar={(valor) => alCambiar("nombre", valor)} />
              </div>
              {/* El correo y la contraseña solo se piden al crear la cuenta */}
              {!editando && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Correo de acceso</label>
                    <Input tipo="email" nombre="correo" valor={formulario.correo}
                      alCambiar={(valor) => alCambiar("correo", valor)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Contraseña (mínimo 8 caracteres)</label>
                    <Input tipo="password" nombre="contrasena" valor={formulario.contrasena}
                      alCambiar={(valor) => alCambiar("contrasena", valor)} />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label fw-bold small">Especialidad</label>
                <Input tipo="text" nombre="especialidad" valor={formulario.especialidad}
                  alCambiar={(valor) => alCambiar("especialidad", valor)} />
              </div>
              <div className="mb-1">
                <label className="form-label fw-bold small">URL de la foto (opcional)</label>
                <Input tipo="text" nombre="fotoUrl" valor={formulario.fotoUrl}
                  alCambiar={(valor) => alCambiar("fotoUrl", valor)} />
              </div>
              {!editando && (
                <div className="mt-3">
                  <label className="form-label fw-bold small">Jornada de atención</label>
                  <select className="form-select" value={formulario.jornada}
                    onChange={(e) => alCambiar("jornada", e.target.value)}>
                    <option value="Manana">Mañana (08:00 - 12:30)</option>
                    <option value="Tarde">Tarde (14:00 - 18:00)</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer border-0 bg-light">
              <button type="button" className="btn btn-secondary fw-bold px-4 rounded-3" onClick={alCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success fw-bold px-4 rounded-3" disabled={enviando}>
                {enviando ? "Enviando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalNutricionista;

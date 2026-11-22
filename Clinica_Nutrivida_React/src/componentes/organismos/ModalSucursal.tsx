import Input from "../atomos/Input";
import type { FormularioSucursal } from "../../utils/tipos";

interface ModalSucursalProps {
  formulario: FormularioSucursal;
  editando: boolean;
  enviando: boolean;
  alCambiar: (campo: string, valor: string) => void;
  alGuardar: (e: React.FormEvent) => void;
  alCerrar: () => void;
}

// Modal para crear o editar una sucursal (solo Admin)
function ModalSucursal({ formulario, editando, enviando, alCambiar, alGuardar, alCerrar }: ModalSucursalProps) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <form onSubmit={alGuardar}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold text-dark">
                {editando ? "Editar Sucursal" : "Nueva Sucursal"}
              </h5>
              <button type="button" className="btn-close" onClick={alCerrar}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small">Nombre</label>
                  <Input tipo="text" nombre="nombre" valor={formulario.nombre}
                    alCambiar={(valor) => alCambiar("nombre", valor)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small">Sector</label>
                  <Input tipo="text" nombre="sector" valor={formulario.sector}
                    alCambiar={(valor) => alCambiar("sector", valor)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Dirección</label>
                  <Input tipo="text" nombre="direccion" valor={formulario.direccion}
                    alCambiar={(valor) => alCambiar("direccion", valor)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small">Teléfono</label>
                  <Input tipo="text" nombre="telefono" valor={formulario.telefono}
                    alCambiar={(valor) => alCambiar("telefono", valor)} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small">Correo</label>
                  <Input tipo="email" nombre="correo" valor={formulario.correo}
                    alCambiar={(valor) => alCambiar("correo", valor)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Horario de atención</label>
                  <Input tipo="text" nombre="horario" valor={formulario.horario}
                    placeholder="Lunes a Viernes: 09:00 - 18:00 hrs"
                    alCambiar={(valor) => alCambiar("horario", valor)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">URL del mapa de Google (opcional)</label>
                  <Input tipo="text" nombre="mapaUrl" valor={formulario.mapaUrl}
                    alCambiar={(valor) => alCambiar("mapaUrl", valor)} />
                </div>
              </div>
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

export default ModalSucursal;

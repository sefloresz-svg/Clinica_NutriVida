import Input from "../atomos/Input";
import type { FormularioServicio } from "../../utils/tipos";

interface ModalServicioProps {
  formulario: FormularioServicio;
  editando: boolean;
  enviando: boolean;
  alCambiar: (campo: string, valor: string) => void;
  alGuardar: (e: React.FormEvent) => void;
  alCerrar: () => void;
}

// Modal para crear o editar un servicio (solo Admin)
function ModalServicio({ formulario, editando, enviando, alCambiar, alGuardar, alCerrar }: ModalServicioProps) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <form onSubmit={alGuardar}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold text-dark">
                {editando ? "Editar Servicio" : "Nuevo Servicio"}
              </h5>
              <button type="button" className="btn-close" onClick={alCerrar}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-4">
                  <label className="form-label fw-bold small">Código</label>
                  <Input tipo="text" nombre="codigo" valor={formulario.codigo} placeholder="CN003"
                    alCambiar={(valor) => alCambiar("codigo", valor)} />
                </div>
                <div className="col-8">
                  <label className="form-label fw-bold small">Título</label>
                  <Input tipo="text" nombre="titulo" valor={formulario.titulo}
                    alCambiar={(valor) => alCambiar("titulo", valor)} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold small">Tipo</label>
                  <select className="form-select" value={formulario.tipo}
                    onChange={(e) => alCambiar("tipo", e.target.value)}>
                    <option value="Consulta">Consulta</option>
                    <option value="Plan especializado">Plan especializado</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold small">Modalidad</label>
                  <select className="form-select" value={formulario.modalidad}
                    onChange={(e) => alCambiar("modalidad", e.target.value)}>
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold small">Duración</label>
                  <Input tipo="text" nombre="duracion" valor={formulario.duracion} placeholder="50 min"
                    alCambiar={(valor) => alCambiar("duracion", valor)} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold small">Precio (sin puntos)</label>
                  <Input tipo="number" nombre="precio" valor={formulario.precio} placeholder="35000"
                    alCambiar={(valor) => alCambiar("precio", valor)} />
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

export default ModalServicio;

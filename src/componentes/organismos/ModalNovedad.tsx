import Input from "../atomos/Input";
import type { FormularioNovedad } from "../../utils/tipos";

interface ModalNovedadProps {
  formulario: FormularioNovedad;
  editando: boolean;
  enviando: boolean;
  alCambiar: (campo: string, valor: string) => void;
  alGuardar: (e: React.FormEvent) => void;
  alCerrar: () => void;
}

// Modal para publicar o editar una novedad (solo Admin)
function ModalNovedad({ formulario, editando, enviando, alCambiar, alGuardar, alCerrar }: ModalNovedadProps) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <form onSubmit={alGuardar}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold text-dark">
                {editando ? "Editar Artículo" : "Publicar Novedad"}
              </h5>
              <button type="button" className="btn-close" onClick={alCerrar}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-bold small">Título</label>
                  <Input tipo="text" nombre="titulo" valor={formulario.titulo}
                    alCambiar={(valor) => alCambiar("titulo", valor)} />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold small">Categoría</label>
                  <Input tipo="text" nombre="categoria" valor={formulario.categoria}
                    alCambiar={(valor) => alCambiar("categoria", valor)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Resumen</label>
                  <textarea className="form-control" rows={2} value={formulario.resumen}
                    onChange={(e) => alCambiar("resumen", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Contenido completo</label>
                  <textarea className="form-control" rows={5} value={formulario.contenido}
                    onChange={(e) => alCambiar("contenido", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">URL de la imagen (opcional)</label>
                  <Input tipo="text" nombre="imagenUrl" valor={formulario.imagenUrl}
                    alCambiar={(valor) => alCambiar("imagenUrl", valor)} />
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

export default ModalNovedad;

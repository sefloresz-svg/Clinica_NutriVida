import { formatearFecha } from "../../utils/api";
import { IMAGEN_POR_DEFECTO } from "../moleculas/CardNovedad";
import type { Novedad } from "../../utils/tipos";

interface ModalLeerNovedadProps {
  novedad: Novedad;
  alCerrar: () => void;
}

// Modal para leer el artículo completo (pacientes, nutricionistas y visitas)
function ModalLeerNovedad({ novedad, alCerrar }: ModalLeerNovedadProps) {
  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header border-0 bg-light">
            <div>
              <span className="badge bg-success-subtle text-success fw-semibold mb-1">
                {novedad.categoria}
              </span>
              <h5 className="modal-title fw-bold text-dark">{novedad.titulo}</h5>
            </div>
            <button type="button" className="btn-close" onClick={alCerrar}></button>
          </div>

          <div className="modal-body p-4">
            <img
              src={novedad.imagenUrl || IMAGEN_POR_DEFECTO}
              alt={novedad.titulo}
              className="w-100 rounded-3 mb-3 shadow-sm"
              style={{ maxHeight: "280px", objectFit: "cover" }}
            />
            <p className="text-muted small mb-3">
              <strong>Publicado el:</strong> {formatearFecha(novedad.fechaPublicacion)}
            </p>
            <div className="text-dark leading-relaxed">
              {novedad.contenido}
            </div>
          </div>

          <div className="modal-footer border-0 bg-light">
            <button type="button" className="btn btn-secondary fw-bold px-4 rounded-3" onClick={alCerrar}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalLeerNovedad;

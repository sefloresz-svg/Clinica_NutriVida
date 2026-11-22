import { formatearFecha } from "../../utils/api";
import type { Novedad } from "../../utils/tipos";

interface CardNovedadProps {
  novedad: Novedad;
  esAdmin: boolean;
  alEditar: (novedad: Novedad) => void;
  alEliminar: (id: number) => void;
  alLeer: (novedad: Novedad) => void;
}

// Imagen por defecto si el artículo no tiene una (se exporta porque también la usa el modal de lectura)
export const IMAGEN_POR_DEFECTO =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80";

// Tarjeta de un artículo de Novedades
function CardNovedad({ novedad, esAdmin, alEditar, alEliminar, alLeer }: CardNovedadProps) {
  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between">
      <div>
        <img
          src={novedad.imagenUrl || IMAGEN_POR_DEFECTO}
          alt={novedad.titulo}
          className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded-2 small">
              {novedad.categoria}
            </span>
            <small className="text-muted">{formatearFecha(novedad.fechaPublicacion)}</small>
          </div>
          <h5 className="fw-bold text-dark mb-2 fs-6">{novedad.titulo}</h5>
          <p className="text-muted small mb-0">{novedad.resumen}</p>
        </div>
      </div>

      {/* Botones según Rol */}
      <div className="p-3 pt-0">
        {esAdmin ? (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-3"
              onClick={() => alEditar(novedad)}
            >
              Editar Artículo
            </button>
            <button
              className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-3"
              onClick={() => alEliminar(novedad.id)}
            >
              Eliminar
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline-success btn-sm w-100 fw-bold rounded-3"
            onClick={() => alLeer(novedad)}
          >
            Leer Artículo Completo
          </button>
        )}
      </div>
    </div>
  );
}

export default CardNovedad;

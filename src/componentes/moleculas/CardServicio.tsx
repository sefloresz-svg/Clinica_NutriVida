import { formatearPrecio } from "../../utils/api";
import type { Servicio } from "../../utils/tipos";

interface CardServicioProps {
  servicio: Servicio;
  esAdmin: boolean;
  esNutri: boolean;
  alEditar: (servicio: Servicio) => void;
  alEliminar: (id: number) => void;
  alReservar: (id: number) => void;
}

// Tarjeta de un servicio. Los botones cambian según el rol de quien mira
function CardServicio({ servicio, esAdmin, esNutri, alEditar, alEliminar, alReservar }: CardServicioProps) {
  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-column justify-content-between">
      <div>
        <span className="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill mb-2 small">
          {servicio.tipo}
        </span>
        <h5 className="fw-bold text-dark mb-1">{servicio.titulo}</h5>
        <p className="text-muted small mb-2">
          Código: {servicio.codigo} <br />
          Duración: {servicio.duracion} | {servicio.modalidad}
        </p>
        <h4 className="fw-bold text-success mb-3">{formatearPrecio(servicio.precio)}</h4>
      </div>

      <div>
        {/* 1. ADMINISTRADOR */}
        {esAdmin ? (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-3"
              onClick={() => alEditar(servicio)}
            >
              Editar Arancel
            </button>
            <button
              className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-3"
              onClick={() => alEliminar(servicio.id)}
            >
              Eliminar
            </button>
          </div>
        ) : esNutri ? (
          /* 2. NUTRICIONISTA */
          <span className="badge bg-secondary-subtle text-secondary w-100 py-2 rounded-3 border fw-semibold d-block text-center">
            Catálogo Informativo
          </span>
        ) : (
          /* 3. PACIENTE O PÚBLICO */
          <button
            className="btn btn-success w-100 fw-bold py-2 rounded-3"
            onClick={() => alReservar(servicio.id)}
          >
            Reservar este servicio
          </button>
        )}
      </div>
    </div>
  );
}

export default CardServicio;

import type { Sucursal } from "../../utils/tipos";

interface CardSucursalProps {
  sucursal: Sucursal;
  esAdmin: boolean;
  alEditar: (sucursal: Sucursal) => void;
  alEliminar: (id: number) => void;
}

// Tarjeta con los datos de la sucursal seleccionada (y acciones del Admin)
function CardSucursal({ sucursal, esAdmin, alEditar, alEliminar }: CardSucursalProps) {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="row g-3 align-items-center">
        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill small">
              {sucursal.sector}
            </span>
            <h4 className="fw-bold text-dark mb-0">{sucursal.nombre}</h4>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-start">
                <span className="fs-5 me-2">📍</span>
                <div>
                  <strong className="d-block text-dark small">Dirección</strong>
                  <span className="text-muted small">{sucursal.direccion}</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="d-flex align-items-start">
                <span className="fs-5 me-2">📞</span>
                <div>
                  <strong className="d-block text-dark small">Teléfono / Recepción</strong>
                  <span className="text-muted small">{sucursal.telefono}</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="d-flex align-items-start">
                <span className="fs-5 me-2">⏰</span>
                <div>
                  <strong className="d-block text-dark small">Horario de Atención</strong>
                  <span className="text-muted small">{sucursal.horario}</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="d-flex align-items-start">
                <span className="fs-5 me-2">✉️</span>
                <div>
                  <strong className="d-block text-dark small">Correo Electrónico</strong>
                  <span className="text-muted small">{sucursal.correo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones según Rol */}
        <div className="col-12 col-lg-4 text-lg-end">
          {esAdmin ? (
            <div className="bg-light p-3 rounded-4 border d-flex flex-column gap-2">
              <span className="small text-muted fw-bold text-center text-lg-start">
                Acciones de Administrador:
              </span>
              <button
                className="btn btn-outline-primary btn-sm fw-bold rounded-3"
                onClick={() => alEditar(sucursal)}
              >
                Editar Datos / Mapa
              </button>
              <button
                className="btn btn-outline-danger btn-sm fw-bold rounded-3"
                onClick={() => alEliminar(sucursal.id)}
              >
                Eliminar esta Sucursal
              </button>
            </div>
          ) : (
            <div className="bg-light p-3 rounded-4 text-center text-lg-start border">
              <small className="text-muted d-block mb-2 fw-medium">
                ¿Quieres agendar en este centro?
              </small>
              <a href="/agendar" className="btn btn-success w-100 fw-bold rounded-3 py-2">
                Agendar Cita en {sucursal.nombre.replace("Sucursal ", "")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardSucursal;

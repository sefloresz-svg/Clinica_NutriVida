import BadgeEstado from "../atomos/BadgeEstado";
import { formatearPrecio, formatearHora, citaYaPaso } from "../../utils/api";
import type { Cita } from "../../utils/tipos";

interface TablaCitasProps {
  citas: Cita[];
  alCancelar: (cita: Cita) => void;
}

// Panel "Mis Citas Registradas" del paciente (en la página Agendar)
function TablaCitas({ citas, alCancelar }: TablaCitasProps) {
  return (
    <div className="card card-nutri p-4 shadow-sm">
      <h5 className="fw-bold mb-3">Mis Citas Registradas</h5>
      {citas.length === 0 ? (
        <p className="text-muted small">
          No tienes citas agendadas actualmente.
        </p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {citas.map((cita) => (
            <div key={cita.id} className="border rounded p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-success small">
                  {cita.nombreServicio}
                </span>
                <span
                  className="badge text-white"
                  style={{ backgroundColor: "#521d91" }}
                >
                  {formatearHora(cita.hora)}
                </span>
              </div>
              <div className="small text-muted">
                <div>
                  <strong>Fecha:</strong> {cita.fecha}
                </div>
                <div>
                  <strong>Especialista:</strong> Nut. {cita.nombreNutricionista}
                </div>
                <div>
                  <strong>Valor:</strong> {formatearPrecio(cita.precio)}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <BadgeEstado estado={cita.estado} />
                  {/* Igual que el back: solo se cancela una cita activa que todavía no pasa */}
                  {(cita.estado === "Pendiente" || cita.estado === "Confirmada") &&
                    !citaYaPaso(cita.fecha, cita.hora) && (
                      <button
                        className="btn btn-outline-danger btn-sm py-0"
                        onClick={() => alCancelar(cita)}
                      >
                        Cancelar
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TablaCitas;

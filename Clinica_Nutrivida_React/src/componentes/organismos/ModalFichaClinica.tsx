import type { Cita } from "../../utils/tipos";

interface ModalFichaClinicaProps {
  atencion: Cita;
  peso: string;
  estatura: string;
  diagnostico: string;
  // Solo el Nutricionista puede editar y guardar
  esNutri: boolean;
  enviando: boolean;
  alCambiarPeso: (valor: string) => void;
  alCambiarEstatura: (valor: string) => void;
  alCambiarDiagnostico: (valor: string) => void;
  alGuardar: () => void;
  alCerrar: () => void;
}

// Modal con la ficha clínica del paciente de una atención
function ModalFichaClinica({
  atencion, peso, estatura, diagnostico, esNutri, enviando,
  alCambiarPeso, alCambiarEstatura, alCambiarDiagnostico, alGuardar, alCerrar,
}: ModalFichaClinicaProps) {
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
              <h5 className="modal-title fw-bold text-dark">
                Ficha Clínica: {atencion.nombrePaciente}
              </h5>
              <small className="text-muted">RUT: {atencion.rutPaciente}</small>
            </div>
            <button type="button" className="btn-close" onClick={alCerrar}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold small text-dark">Atención / Servicio</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={atencion.nombreServicio}
                  disabled
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold small text-dark">Profesional a Cargo</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={`Nut. ${atencion.nombreNutricionista}`}
                  disabled
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold small text-dark">Estatura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${esNutri ? "bg-white" : "bg-light"}`}
                  value={estatura}
                  onChange={(e) => alCambiarEstatura(e.target.value)}
                  disabled={!esNutri}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold small text-dark">Peso Registrado (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className={`form-control ${esNutri ? "bg-white" : "bg-light"}`}
                  value={peso}
                  onChange={(e) => alCambiarPeso(e.target.value)}
                  disabled={!esNutri}
                />
              </div>
              {atencion.motivo && (
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold small text-dark">Motivo de la cita</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={atencion.motivo}
                    disabled
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-dark">
                Evolución y Diagnóstico Nutricional
              </label>
              <textarea
                rows={4}
                className={`form-control ${esNutri ? "bg-white" : "bg-light"}`}
                value={diagnostico}
                onChange={(e) => alCambiarDiagnostico(e.target.value)}
                disabled={!esNutri}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer border-0 bg-light">
            <button
              type="button"
              className="btn btn-secondary fw-bold px-4 rounded-3"
              onClick={alCerrar}
            >
              Cerrar
            </button>

            {/* Solo el Nutricionista ve y activa el botón de guardar */}
            {esNutri && (
              <button
                type="button"
                className="btn btn-success fw-bold px-4 rounded-3"
                onClick={alGuardar}
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Guardar Cambios"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalFichaClinica;

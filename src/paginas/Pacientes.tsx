import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Cita {
  id: number;
  paciente: string;
  rut: string;
  servicio: string;
  nutricionista: string;
  fecha: string;
  hora: string;
  motivo?: string;
  peso?: string;
  estatura?: string;
  diagnostico?: string;
  plan?: string;
}

// Pacientes iniciales requeridos de prueba
const PACIENTES_PRUEBA_INICIALES: Cita[] = [
  {
    id: 1,
    paciente: "Halam Dupre",
    rut: "12345678-5",
    fecha: "2026-10-28",
    hora: "09:00 hrs",
    servicio: "Primera consulta nutricional ($35.000)",
    nutricionista: "Nut. Carolina Fuentes M.",
    motivo: "Evaluación nutricional completa",
    peso: "78",
    estatura: "1.75",
    diagnostico: "Sobrepeso leve, porcentaje de grasa elevado.",
    plan: "Pauta hipocalórica de 1800 kcal, control de hidratación a 2L diarios."
  },
  {
    id: 2,
    paciente: "Joaquin Hidalgo",
    rut: "31245387-1",
    fecha: "2026-10-29",
    hora: "10:30 hrs",
    servicio: "Control nutricional ($25.000)",
    nutricionista: "Nut. Carolina Fuentes M.",
    motivo: "Control de masa muscular",
    peso: "62",
    estatura: "1.63",
    diagnostico: "Normopeso con buena distribución muscular.",
    plan: "Mantener plan de alimentación actual y ajustar colación post-entrenamiento."
  }
];

function Pacientes() {
  const navigate = useNavigate();
  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const [busqueda, setBusqueda] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Cita | null>(null);

  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [plan, setPlan] = useState("");

  // Usar sessionStorage para persistencia de sesión únicamente
  const [citas, setCitas] = useState<Cita[]>(() => {
    const guardadas = sessionStorage.getItem("citasNutriVida");
    if (guardadas) {
      return JSON.parse(guardadas);
    }
    sessionStorage.setItem("citasNutriVida", JSON.stringify(PACIENTES_PRUEBA_INICIALES));
    return PACIENTES_PRUEBA_INICIALES;
  });

  useEffect(() => {
    if (!sesion || (sesion.rol !== "Nutricionista" && sesion.rol !== "Admin")) {
      alert("Acceso denegado. Esta área es exclusiva para profesionales de la salud.");
      navigate("/login");
    }
  }, [sesion, navigate]);

  if (!sesion || (sesion.rol !== "Nutricionista" && sesion.rol !== "Admin")) return null;

  const abrirFicha = (cita: Cita) => {
    setPacienteSeleccionado(cita);
    setPeso(cita.peso || "");
    setEstatura(cita.estatura || "");
    setDiagnostico(cita.diagnostico || "");
    setPlan(cita.plan || "");
  };

  const guardarFichaClinica = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSeleccionado) return;

    const citasActualizadas = citas.map((c) => {
      if (c.id === pacienteSeleccionado.id) {
        return {
          ...c,
          peso: peso.trim(),
          estatura: estatura.trim(),
          diagnostico: diagnostico.trim(),
          plan: plan.trim()
        };
      }
      return c;
    });

    setCitas(citasActualizadas);
    sessionStorage.setItem("citasNutriVida", JSON.stringify(citasActualizadas));

    alert("¡Ficha clínica actualizada con éxito!");
    setPacienteSeleccionado(null);
  };

  const citasFiltradas = citas.filter(
    (c) =>
      c.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.rut.includes(busqueda)
  );

  return (
    <div className="container my-4">
      <h1 className="fw-bold fs-2 text-dark mb-1">Agenda de Pacientes</h1>
      <p className="text-muted mb-4">Listado de citas asignadas a tu perfil profesional.</p>

      <div className="card border-0 shadow-sm p-4 rounded-3 mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h4 className="fw-bold text-dark m-0">Mis Atenciones</h4>
          <div style={{ maxWidth: "320px", width: "100%" }}>
            <input
              type="text"
              className="form-control form-control-sm bg-light"
              placeholder="Buscar paciente o RUT..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle text-start mb-0">
            <thead>
              <tr className="text-uppercase text-secondary fs-7 border-bottom">
                <th className="py-2 fw-bold">PACIENTE</th>
                <th className="py-2 fw-bold">RUT</th>
                <th className="py-2 fw-bold">FECHA / HORA</th>
                <th className="py-2 fw-bold">SERVICIO</th>
                <th className="py-2 fw-bold">NUTRICIONISTA</th>
                <th className="py-2 fw-bold text-center">FICHA CLÍNICA</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No tienes citas ni pacientes asignados en tu agenda actualmente.
                  </td>
                </tr>
              ) : (
                citasFiltradas.map((cita) => (
                  <tr key={cita.id} className="border-bottom">
                    <td className="fw-bold text-dark py-3">{cita.paciente}</td>
                    <td className="text-muted">{cita.rut}</td>
                    <td className="text-dark">
                      {cita.fecha} <br />
                      <span className="badge bg-light text-dark border mt-1">{cita.hora}</span>
                    </td>
                    <td className="text-muted">{cita.servicio}</td>
                    <td className="text-muted">{cita.nutricionista}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-purple btn-sm fw-bold px-3"
                        style={{ color: "#521d91", borderColor: "#521d91" }}
                        onClick={() => abrirFicha(cita)}
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha Clínica */}
      {pacienteSeleccionado && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-3 border-0 overflow-hidden shadow-lg">
              <div
                className="modal-header border-0 text-white px-4 py-3"
                style={{ backgroundColor: "#521d91" }}
              >
                <h5 className="modal-title fw-bold">Ficha Clínica del Paciente</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPacienteSeleccionado(null)}
                ></button>
              </div>

              <form onSubmit={guardarFichaClinica}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Paciente:</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={pacienteSeleccionado.paciente}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">RUT:</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={pacienteSeleccionado.rut}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Peso (kg):</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: 70"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Estatura (m):</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: 1.70"
                        value={estatura}
                        onChange={(e) => setEstatura(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark small">
                      Diagnóstico Nutricional:
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Escriba el diagnóstico actual del paciente..."
                      value={diagnostico}
                      onChange={(e) => setDiagnostico(e.target.value)}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold text-dark small">
                      Plan / Indicaciones:
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Pautas de alimentación, restricciones, controles..."
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 px-4 pb-4 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2 font-semibold rounded-3"
                    onClick={() => setPacienteSeleccionado(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn text-white px-4 py-2 font-semibold rounded-3"
                    style={{ backgroundColor: "#7c3aed" }}
                  >
                    Guardar Ficha
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Pacientes;
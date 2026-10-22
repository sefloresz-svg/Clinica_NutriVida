import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PacienteAtencion {
  id: number;
  paciente: string;
  rut: string;
  fecha: string;
  hora: string;
  servicio: string;
  nutricionista: string;
  peso: string;
  estatura: string;
  diagnostico: string;
}

function Pacientes() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteAtencion | null>(null);

  // Estados para la edición médica por parte del Nutricionista
  const [diagnosticoEdit, setDiagnosticoEdit] = useState<string>("");
  const [pesoEdit, setPesoEdit] = useState<string>("");

  useEffect(() => {
    const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
    if (sesionGuardada) {
      try {
        const sesion = JSON.parse(sesionGuardada);
        const rolUsuario = (sesion.rol || "").toString().toLowerCase().trim();
        setRol(rolUsuario);

        // Si ingresa un Paciente, se le deniega el acceso a esta vista
        if (rolUsuario === "paciente") {
          navigate("/agendar");
        }
      } catch (e) {
        console.error("Error al leer la sesión:", e);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const esAdmin = rol === "admin" || rol === "administrador";
  const esNutri = rol === "nutricionista" || rol === "nutri";

  // Arreglo inicial de la agenda
  const [atenciones, setAtenciones] = useState<PacienteAtencion[]>([
    {
      id: 1,
      paciente: "Halam Dupre",
      rut: "12345678-5",
      fecha: "2026-10-28",
      hora: "09:00 hrs",
      servicio: "Primera consulta nutricional ($35.000)",
      nutricionista: "Nut. Carolina Fuentes M.",
      peso: "78.5 kg",
      estatura: "1.72 m",
      diagnostico: "Paciente en plan de déficit calórico moderado. Presenta antecedentes de hipertensión leve.",
    },
    {
      id: 2,
      paciente: "Joaquin Hidalgo",
      rut: "31245387-1",
      fecha: "2026-10-29",
      hora: "10:30 hrs",
      servicio: "Control nutricional ($25.000)",
      nutricionista: "Nut. Carolina Fuentes M.",
      peso: "82.0 kg",
      estatura: "1.80 m",
      diagnostico: "Control mensual. Buena adherencia al plan vegetariano y reducción de porcentaje graso.",
    },
  ]);

  // Filtro de búsqueda por nombre o RUT
  const atencionesFiltradas = atenciones.filter(
    (a) =>
      a.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.rut.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFicha = (p: PacienteAtencion) => {
    setPacienteSeleccionado(p);
    setDiagnosticoEdit(p.diagnostico);
    setPesoEdit(p.peso);
  };

  const guardarFicha = () => {
    if (!pacienteSeleccionado) return;
    setAtenciones((prev) =>
      prev.map((item) =>
        item.id === pacienteSeleccionado.id
          ? { ...item, diagnostico: diagnosticoEdit, peso: pesoEdit }
          : item
      )
    );
    alert("Ficha clínica actualizada exitosamente.");
    setPacienteSeleccionado(null);
  };

  return (
    <div className="container my-4">
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Agenda de Pacientes</h2>
        <p className="text-muted small mb-0">
          Listado de citas y registro de fichas clínicas asignadas al sistema.
        </p>
      </div>

      {/* Contenedor Principal */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <h5 className="fw-bold text-dark mb-0">Mis Atenciones</h5>
          
          {/* Buscador */}
          <div style={{ maxWidth: "320px", width: "100%" }}>
            <input
              type="text"
              className="form-control bg-light fs-6"
              placeholder="Buscar paciente o RUT..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de Atenciones */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th>Paciente</th>
                <th>RUT</th>
                <th>Fecha / Hora</th>
                <th>Servicio</th>
                <th>Nutricionista</th>
                <th className="text-center">Ficha Clínica</th>
              </tr>
            </thead>
            <tbody>
              {atencionesFiltradas.length > 0 ? (
                atencionesFiltradas.map((a) => (
                  <tr key={a.id}>
                    <td className="fw-bold text-dark">{a.paciente}</td>
                    <td className="text-muted">{a.rut}</td>
                    <td>
                      <div className="fw-medium text-dark">{a.fecha}</div>
                      <span className="badge bg-light text-dark border small">{a.hora}</span>
                    </td>
                    <td className="small text-muted">{a.servicio}</td>
                    <td className="small fw-medium text-dark">{a.nutricionista}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm px-3 fw-semibold rounded-3"
                        onClick={() => abrirFicha(a)}
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No se encontraron pacientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FICHA CLÍNICA */}
      {pacienteSeleccionado && (
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
                    Ficha Clínica: {pacienteSeleccionado.paciente}
                  </h5>
                  <small className="text-muted">RUT: {pacienteSeleccionado.rut}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPacienteSeleccionado(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold small text-dark">Atención / Servicio</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={pacienteSeleccionado.servicio}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold small text-dark">Profesional a Cargo</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={pacienteSeleccionado.nutricionista}
                      disabled
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold small text-dark">Estatura</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={pacienteSeleccionado.estatura}
                      disabled
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold small text-dark">Peso Registrado</label>
                    <input
                      type="text"
                      className={`form-control ${esNutri ? "bg-white" : "bg-light"}`}
                      value={pesoEdit}
                      onChange={(e) => setPesoEdit(e.target.value)}
                      disabled={esAdmin}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-dark">
                    Evolución y Diagnóstico Nutricional
                  </label>
                  <textarea
                    rows={4}
                    className={`form-control ${esNutri ? "bg-white" : "bg-light"}`}
                    value={diagnosticoEdit}
                    onChange={(e) => setDiagnosticoEdit(e.target.value)}
                    disabled={esAdmin}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer border-0 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary fw-bold px-4 rounded-3"
                  onClick={() => setPacienteSeleccionado(null)}
                >
                  Cerrar
                </button>
                
                {/* Solo el Nutricionista ve y activa el botón de guardar */}
                {esNutri && (
                  <button
                    type="button"
                    className="btn btn-success fw-bold px-4 rounded-3"
                    onClick={guardarFicha}
                  >
                    Guardar Cambios
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pacientes;
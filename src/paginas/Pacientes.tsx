import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API, obtenerSesion, leerError, formatearHora, citaYaPaso } from "../utils/api";
import type { Cita } from "../utils/tipos";
import BadgeEstado from "../componentes/atomos/BadgeEstado";
import ModalFichaClinica from "../componentes/organismos/ModalFichaClinica";

// Lo que responde GET /api/fichas/paciente/{idPaciente}
interface Ficha {
  id: number | null;
  idPaciente: number;
  nombrePaciente: string;
  rutPaciente: string;
  pesoKg: number | null;
  estaturaM: number | null;
  diagnostico: string | null;
}

// Página contenedora: aquí están los fetch y los estados; el badge y el modal solo muestran
function Pacientes() {
  const navigate = useNavigate();
  const location = useLocation();
  const sesion = obtenerSesion();
  const idSesion = sesion?.id;
  const rol = (sesion?.rol || "").toLowerCase();

  const esAdmin = rol === "admin";
  const esNutri = rol === "nutricionista";

  // Aviso que manda otra página al redirigir aquí (ej: Agendar)
  const mensaje = location.state?.mensaje;

  const [busqueda, setBusqueda] = useState<string>("");
  const [atenciones, setAtenciones] = useState<Cita[]>([]);

  // Modal de ficha clínica
  const [atencionSeleccionada, setAtencionSeleccionada] = useState<Cita | null>(null);
  const [pesoEdit, setPesoEdit] = useState<string>("");
  const [estaturaEdit, setEstaturaEdit] = useState<string>("");
  const [diagnosticoEdit, setDiagnosticoEdit] = useState<string>("");
  const [enviando, setEnviando] = useState(false);

  const cargarAtenciones = () => {
    fetch(`${API}/api/citas?idUsuario=${idSesion}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar atenciones");
        return respuesta.json();
      })
      .then((datos) => setAtenciones(datos))
      .catch(() => alert("No se pudieron cargar las atenciones."));
  };

  // Los avisos van en el state (no con alert) para que no salgan dos veces con StrictMode
  useEffect(() => {
    if (!idSesion) {
      navigate("/login", {
        state: { from: location.pathname, mensaje: "Debes iniciar sesión para ver la agenda de pacientes." },
      });
      return;
    }
    // Si ingresa un Paciente, se le deniega el acceso a esta vista
    if (sesion?.rol === "Paciente") {
      navigate("/agendar", {
        state: { mensaje: "La agenda de pacientes es solo para nutricionistas y administradores." },
      });
      return;
    }
    cargarAtenciones();
  }, [idSesion]);

  // Filtro de búsqueda por nombre o RUT
  const atencionesFiltradas = atenciones.filter(
    (a) =>
      (a.nombrePaciente || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (a.rutPaciente || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  // GET de la ficha del paciente (si aún no tiene, los datos vienen vacíos)
  const abrirFicha = (a: Cita) => {
    fetch(`${API}/api/fichas/paciente/${a.idPaciente}?idUsuario=${idSesion}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar ficha");
        return respuesta.json();
      })
      .then((ficha: Ficha) => {
        setPesoEdit(ficha.pesoKg !== null ? String(ficha.pesoKg) : "");
        setEstaturaEdit(ficha.estaturaM !== null ? String(ficha.estaturaM) : "");
        setDiagnosticoEdit(ficha.diagnostico || "");
        setAtencionSeleccionada(a);
      })
      .catch(() => alert("No se pudo cargar la ficha clínica."));
  };

  // PUT de la ficha (solo Nutricionista; el back también lo valida)
  const guardarFicha = async () => {
    if (!atencionSeleccionada) return;

    const peso = Number(pesoEdit);
    const estatura = Number(estaturaEdit);
    if (!pesoEdit.trim() || isNaN(peso) || peso <= 0) {
      alert("Ingrese un peso válido en kg (ejemplo: 78.5).");
      return;
    }
    if (!estaturaEdit.trim() || isNaN(estatura) || estatura < 0.5 || estatura > 2.5) {
      alert("Ingrese una estatura válida en metros (ejemplo: 1.72).");
      return;
    }
    if (!diagnosticoEdit.trim()) {
      alert("El diagnóstico es obligatorio.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(
        `${API}/api/fichas/paciente/${atencionSeleccionada.idPaciente}?idUsuario=${idSesion}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pesoKg: peso,
            estaturaM: estatura,
            diagnostico: diagnosticoEdit.trim(),
          }),
        }
      );

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo guardar la ficha."));
        return;
      }

      alert("Ficha clínica actualizada exitosamente.");
      setAtencionSeleccionada(null);
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  // PUT /api/citas/{id}/estado (Confirmada, Atendida o Cancelada)
  const cambiarEstado = async (a: Cita, nuevoEstado: string) => {
    if (!nuevoEstado) return;
    if (!confirm(`¿Cambiar la cita de ${a.nombrePaciente} a "${nuevoEstado}"?`)) return;

    try {
      const respuesta = await fetch(`${API}/api/citas/${a.id}/estado?idUsuario=${idSesion}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo cambiar el estado."));
        return;
      }
      cargarAtenciones();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="container my-4">
      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

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
          <h5 className="fw-bold text-dark mb-0">{esAdmin ? "Todas las Atenciones" : "Mis Atenciones"}</h5>

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
                <th>Estado</th>
                <th className="text-center">Ficha Clínica</th>
              </tr>
            </thead>
            <tbody>
              {atencionesFiltradas.length > 0 ? (
                atencionesFiltradas.map((a) => {
                  // Mismas reglas que valida el back en CitaService.validarCambioDeEstado
                  const yaPaso = citaYaPaso(a.fecha, a.hora);
                  return (
                    <tr key={a.id}>
                      <td className="fw-bold text-dark">{a.nombrePaciente}</td>
                      <td className="text-muted">{a.rutPaciente}</td>
                      <td>
                        <div className="fw-medium text-dark">{a.fecha}</div>
                        <span className="badge bg-light text-dark border small">{formatearHora(a.hora)}</span>
                      </td>
                      <td className="small text-muted">{a.nombreServicio}</td>
                      <td className="small fw-medium text-dark">Nut. {a.nombreNutricionista}</td>
                      <td style={{ minWidth: "140px" }}>
                        <BadgeEstado estado={a.estado} clase="mb-1" />
                        {/* Solo se puede cambiar lo que está Pendiente o Confirmado */}
                        {(a.estado === "Pendiente" || a.estado === "Confirmada") && (
                          <select
                            className="form-select form-select-sm"
                            value=""
                            onChange={(e) => cambiarEstado(a, e.target.value)}
                          >
                            <option value="">Cambiar...</option>
                            {/* Confirmar: solo si está Pendiente y todavía no pasa */}
                            {a.estado === "Pendiente" && !yaPaso && <option value="Confirmada">Confirmada</option>}
                            {/* Atendida: solo si la cita ya ocurrió */}
                            {yaPaso && <option value="Atendida">Atendida</option>}
                            {/* Cancelar: solo si todavía no pasa */}
                            {!yaPaso && <option value="Cancelada">Cancelada</option>}
                          </select>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm px-3 fw-semibold rounded-3"
                          onClick={() => abrirFicha(a)}
                        >
                          Ver Ficha
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No se encontraron pacientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FICHA CLÍNICA */}
      {atencionSeleccionada && (
        <ModalFichaClinica
          atencion={atencionSeleccionada}
          peso={pesoEdit}
          estatura={estaturaEdit}
          diagnostico={diagnosticoEdit}
          esNutri={esNutri}
          enviando={enviando}
          alCambiarPeso={setPesoEdit}
          alCambiarEstatura={setEstaturaEdit}
          alCambiarDiagnostico={setDiagnosticoEdit}
          alGuardar={guardarFicha}
          alCerrar={() => setAtencionSeleccionada(null)}
        />
      )}
    </div>
  );
}

export default Pacientes;

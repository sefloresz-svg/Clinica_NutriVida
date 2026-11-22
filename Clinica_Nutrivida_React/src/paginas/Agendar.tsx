import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API, obtenerSesion, leerError, formatearPrecio, formatearHora } from "../utils/api";
import type { Cita } from "../utils/tipos";
import TablaCitas from "../componentes/organismos/TablaCitas";

// Lo que responde GET /api/servicios (solo lo que se usa en el select)
interface ServicioOpcion {
  id: number;
  titulo: string;
  precio: number;
}

// Lo que responde GET /api/nutricionistas (solo lo que se usa en el select)
interface NutricionistaOpcion {
  id: number;
  nombre: string;
}

// Lo que responde GET /api/horarios/nutricionista/{id}
interface Horario {
  id: number;
  idNutricionista: number;
  hora: string; // "08:00:00"
}

// Obtener fecha actual en formato YYYY-MM-DD
const obtenerFechaHoy = (): string => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Agendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const sesion = obtenerSesion();
  const idSesion = sesion?.id;

  // Aviso que manda otra página al redirigir aquí (ej: Pacientes)
  const mensaje = location.state?.mensaje;

  // Datos preseleccionados si vienen desde Servicios o Nutricionistas (ahora son ids)
  const servicioInicial = location.state?.servicioPreseleccionado ? String(location.state.servicioPreseleccionado) : "";
  const nutriInicial = location.state?.nutricionistaPreseleccionado ? String(location.state.nutricionistaPreseleccionado) : "";

  // Formulario
  const [servicio, setServicio] = useState(servicioInicial);
  const [nutricionista, setNutricionista] = useState(nutriInicial);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Datos que vienen del back
  const [servicios, setServicios] = useState<ServicioOpcion[]>([]);
  const [nutricionistas, setNutricionistas] = useState<NutricionistaOpcion[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);

  // Mis citas (GET /api/citas?idUsuario=...)
  const cargarCitas = () => {
    fetch(`${API}/api/citas?idUsuario=${idSesion}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar citas");
        return respuesta.json();
      })
      .then((datos) => setCitas(datos))
      .catch(() => alert("No se pudieron cargar tus citas."));
  };

  // Horas libres del nutricionista ese día (GET /api/citas/disponibles)
  const cargarDisponibles = () => {
    fetch(`${API}/api/citas/disponibles?idNutricionista=${nutricionista}&fecha=${fecha}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar horas");
        return respuesta.json();
      })
      .then((datos) => setHorariosDisponibles(datos))
      .catch(() => alert("No se pudieron cargar las horas disponibles."));
  };

  // Redirección hacia /login recordando volver a /agendar tras ingresar.
  // Solo los pacientes agendan (el back también lo valida).
  // El aviso NO se muestra con alert aquí: con StrictMode el efecto corre 2 veces y saldría doble.
  // Se manda en el state y lo muestra la página de destino.
  useEffect(() => {
    if (!idSesion) {
      navigate("/login", {
        state: { from: location.pathname, mensaje: "Debes iniciar sesión para agendar una hora de atención." },
      });
      return;
    }
    if (sesion?.rol !== "Paciente") {
      navigate("/pacientes", { state: { mensaje: "Solo los pacientes pueden agendar citas." } });
      return;
    }

    fetch(`${API}/api/servicios`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar servicios");
        return respuesta.json();
      })
      .then((datos) => setServicios(datos))
      .catch(() => alert("No se pudieron cargar los servicios."));

    fetch(`${API}/api/nutricionistas`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar nutricionistas");
        return respuesta.json();
      })
      .then((datos) => setNutricionistas(datos))
      .catch(() => alert("No se pudieron cargar los nutricionistas."));

    cargarCitas();
  }, [idSesion]);

  // Al elegir nutricionista se cargan sus bloques (para mostrar su horario)
  useEffect(() => {
    if (!nutricionista) return;
    fetch(`${API}/api/horarios/nutricionista/${nutricionista}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar horario");
        return respuesta.json();
      })
      .then((datos) => setHorarios(datos))
      .catch(() => alert("No se pudo cargar el horario del nutricionista."));
  }, [nutricionista]);

  // Con nutricionista y fecha se piden las horas libres
  useEffect(() => {
    if (!nutricionista || !fecha) return;
    cargarDisponibles();
  }, [nutricionista, fecha]);

  if (!sesion || sesion.rol !== "Paciente") return null;

  // Cambiar nutricionista y reiniciar la hora seleccionada
  const manejarCambioNutricionista = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNutricionista(e.target.value);
    setHora("");
    setHorarios([]);
    setHorariosDisponibles([]);
  };

  // Manejar selección de fecha (mismas reglas que el back)
  const manejarCambioFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fechaSeleccionada = e.target.value;
    setHorariosDisponibles([]);
    if (!fechaSeleccionada) {
      setFecha("");
      return;
    }

    const hoy = obtenerFechaHoy();
    if (fechaSeleccionada < hoy) {
      alert("No puedes seleccionar una fecha pasada.");
      setFecha("");
      return;
    }

    // Validar atención de Lunes a Sábado (Domingo = 0)
    const dateObj = new Date(`${fechaSeleccionada}T00:00:00`);
    if (dateObj.getDay() === 0) {
      alert("La clínica atiende únicamente de Lunes a Sábado. Por favor, selecciona otro día.");
      setFecha("");
      return;
    }

    setFecha(fechaSeleccionada);
    setHora("");
  };

  // POST /api/citas (el precio NO se envía: el back lo copia desde contenido)
  const manejarAgendamiento = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!servicio) {
      alert("Por favor, seleccione un servicio nutricional.");
      return;
    }

    if (!nutricionista) {
      alert("Por favor, seleccione un nutricionista.");
      return;
    }

    if (!fecha) {
      alert("Por favor, seleccione una fecha de atención.");
      return;
    }

    if (!hora) {
      alert("Por favor, seleccione una hora disponible.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API}/api/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPaciente: sesion.id,
          idServicio: Number(servicio),
          idNutricionista: Number(nutricionista),
          fecha: fecha,
          hora: hora,
          motivo: motivo.trim(),
        }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo agendar la cita."));
        cargarDisponibles();
        return;
      }

      alert("¡Cita agendada exitosamente!");
      setServicio("");
      setNutricionista("");
      setFecha("");
      setHora("");
      setMotivo("");
      setHorarios([]);
      setHorariosDisponibles([]);
      cargarCitas();
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  // DELETE /api/citas/{id} = cancelar (soft delete, la hora queda libre)
  const cancelarCita = async (cita: Cita) => {
    if (!confirm(`¿Deseas cancelar tu cita del ${cita.fecha} a las ${formatearHora(cita.hora)}?`)) return;

    try {
      const respuesta = await fetch(`${API}/api/citas/${cita.id}?idUsuario=${sesion.id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo cancelar la cita."));
        return;
      }
      alert("Cita cancelada.");
      cargarCitas();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  // Texto del horario del nutricionista elegido, ej: "08:00 - 12:30 hrs"
  const textoHorario =
    horarios.length > 0
      ? `${horarios[0].hora.slice(0, 5)} - ${horarios[horarios.length - 1].hora.slice(0, 5)} hrs`
      : "";

  return (
    <div className="container my-4">
      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

      <h2 className="fw-bold mb-4" style={{ color: "#3f1473" }}>
        Reserva de Cita Nutricional
      </h2>

      <div className="row g-4 mb-5">
        {/* Formulario de Agendamiento */}
        <div className="col-md-7">
          <div className="card card-nutri p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Datos de la Cita</h5>

            <form onSubmit={manejarAgendamiento}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Nombre del Paciente:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={sesion.nombre}
                  disabled
                />
              </div>

              {/* El RUT viene de la cuenta del paciente (no se guarda en la cita: 3FN) */}
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  RUT:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={sesion.rut || ""}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Servicio:
                </label>
                <select
                  className="form-select"
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titulo} ({formatearPrecio(s.precio)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Nutricionista:
                </label>
                <select
                  className="form-select"
                  value={nutricionista}
                  onChange={manejarCambioNutricionista}
                >
                  <option value="">Seleccione especialista</option>
                  {nutricionistas.map((n) => (
                    <option key={n.id} value={n.id}>
                      Nut. {n.nombre}
                    </option>
                  ))}
                </select>
                {textoHorario && (
                  <small className="text-muted">Horario de atención: {textoHorario}</small>
                )}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">
                    Fecha (Lun a Sáb):
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    min={obtenerFechaHoy()}
                    value={fecha}
                    onChange={manejarCambioFecha}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">
                    Hora disponible:
                  </label>
                  <select
                    className="form-select"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    disabled={!nutricionista || !fecha}
                  >
                    <option value="">
                      {!nutricionista
                        ? "Seleccione un especialista primero"
                        : !fecha
                        ? "Seleccione una fecha primero"
                        : horariosDisponibles.length === 0
                        ? "Sin horas disponibles para este día"
                        : "Seleccione hora"}
                    </option>
                    {horariosDisponibles.map((h) => (
                      <option key={h} value={h}>
                        {formatearHora(h)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Motivo de consulta (opcional):
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  maxLength={500}
                  placeholder="Describa brevemente..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-nutri-purple w-100 mt-2" disabled={enviando}>
                {enviando ? "Enviando..." : "Confirmar y Agendar Cita"}
              </button>
            </form>
          </div>
        </div>

        {/* Panel Lateral "Mis Citas Registradas" */}
        <div className="col-md-5">
          <TablaCitas citas={citas} alCancelar={cancelarCita} />
        </div>
      </div>
    </div>
  );
}

export default Agendar;

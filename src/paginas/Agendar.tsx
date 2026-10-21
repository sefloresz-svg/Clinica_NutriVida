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
}

// Bloques de atención específicos asignados a cada profesional
const HORARIOS_POR_NUTRICIONISTA: Record<string, string[]> = {
  "Nut. Carolina Fuentes M.": [
    "08:00 hrs", "08:30 hrs", "09:00 hrs", "09:30 hrs", "10:00 hrs",
    "10:30 hrs", "11:00 hrs", "11:30 hrs", "12:00 hrs", "12:30 hrs"
  ],
  "Nut. Rodrigo Sepúlveda A.": [
    "13:30 hrs", "14:00 hrs", "14:30 hrs", "15:00 hrs", "15:30 hrs",
    "16:00 hrs", "16:30 hrs", "17:00 hrs", "17:30 hrs", "18:00 hrs"
  ],
  "Nut. Daniela Morales C.": [
    "09:00 hrs", "09:30 hrs", "10:00 hrs", "10:30 hrs", "11:00 hrs",
    "11:30 hrs", "12:00 hrs", "12:30 hrs", "13:00 hrs", "13:30 hrs"
  ],
  "Nut. Felipe Araya R.": [
    "14:00 hrs", "14:30 hrs", "15:00 hrs", "15:30 hrs", "16:00 hrs",
    "16:30 hrs", "17:00 hrs", "17:30 hrs", "18:00 hrs"
  ]
};

// Obtener fecha actual en formato YYYY-MM-DD
const obtenerFechaHoy = (): string => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Validación de RUT Chileno estricto (sin puntos, con guion y algoritmo Módulo 11)
export const validarRutChileno = (rut: string): boolean => {
  const rutLimpio = rut.trim().toUpperCase();

  const regexEstricto = /^\d{7,8}-[0-9K]$/;
  if (!regexEstricto.test(rutLimpio)) {
    return false;
  }

  const [cuerpo, dvIngresado] = rutLimpio.split("-");

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvEsperado = 11 - resto === 11 ? "0" : 11 - resto === 10 ? "K" : (11 - resto).toString();

  return dvIngresado === dvEsperado;
};

function Agendar() {
  const navigate = useNavigate();
  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const [rut, setRut] = useState("");
  const [servicio, setServicio] = useState("");
  const [nutricionista, setNutricionista] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  // Usar sessionStorage para mantener las citas únicamente en la sesión actual
  const [citas, setCitas] = useState<Cita[]>(() => {
    const guardadas = sessionStorage.getItem("citasNutriVida");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  useEffect(() => {
    if (!sesion) {
      alert("Debes iniciar sesión para agendar una hora de atención.");
      navigate("/login");
    }
  }, [sesion, navigate]);

  if (!sesion) return null;

  // Cambiar nutricionista y reiniciar la hora seleccionada
  const manejarCambioNutricionista = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNutricionista(e.target.value);
    setHora("");
  };

  // Manejar selección de fecha
  const manejarCambioFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fechaSeleccionada = e.target.value;
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

  // Calcular horas disponibles filtrando reservas existentes en sessionStorage
  const obtenerHorariosDisponibles = (): string[] => {
    if (!nutricionista) return [];

    const horariosBase = HORARIOS_POR_NUTRICIONISTA[nutricionista] || [];
    if (!fecha) return horariosBase;

    const horasOcupadas = citas
      .filter((c) => c.nutricionista === nutricionista && c.fecha === fecha)
      .map((c) => c.hora);

    return horariosBase.filter((h) => !horasOcupadas.includes(h));
  };

  const horariosDisponibles = obtenerHorariosDisponibles();

  const manejarAgendamiento = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rut.trim()) {
      alert("Por favor, ingrese el RUT del paciente.");
      return;
    }

    if (!validarRutChileno(rut)) {
      alert(
        "El RUT debe ingresarse sin puntos y con guion (ejemplo: 12345678-5). Revisa también que el dígito verificador sea el correcto."
      );
      return;
    }

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

    const nuevaCita: Cita = {
      id: Date.now(),
      paciente: sesion.nombre,
      rut: rut.trim(),
      servicio,
      nutricionista,
      fecha,
      hora,
      motivo: motivo.trim()
    };

    const listaActualizada = [...citas, nuevaCita];
    setCitas(listaActualizada);
    sessionStorage.setItem("citasNutriVida", JSON.stringify(listaActualizada));

    alert("¡Cita agendada exitosamente!");

    setRut("");
    setServicio("");
    setNutricionista("");
    setFecha("");
    setHora("");
    setMotivo("");
  };

  const misCitas = citas.filter(
    (c) => c.paciente === sesion.nombre || sesion.rol === "Admin"
  );

  return (
    <div className="container my-4">
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

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  RUT (sin puntos y con guion):
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="12345678-5"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
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
                  <option value="Primera consulta nutricional ($35.000)">
                    Primera consulta nutricional ($35.000)
                  </option>
                  <option value="Control nutricional ($25.000)">
                    Control nutricional ($25.000)
                  </option>
                  <option value="Plan pérdida de peso ($65.000)">
                    Plan pérdida de peso ($65.000)
                  </option>
                  <option value="Plan nutrición deportiva ($70.000)">
                    Plan nutrición deportiva ($70.000)
                  </option>
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
                  <option value="Nut. Carolina Fuentes M.">
                    Nut. Carolina Fuentes M. (Mañana: 08:00 - 12:30)
                  </option>
                  <option value="Nut. Rodrigo Sepúlveda A.">
                    Nut. Rodrigo Sepúlveda A. (Tarde: 13:30 - 18:00)
                  </option>
                  <option value="Nut. Daniela Morales C.">
                    Nut. Daniela Morales C. (Mañana: 09:00 - 13:30)
                  </option>
                  <option value="Nut. Felipe Araya R.">
                    Nut. Felipe Araya R. (Tarde: 14:00 - 18:00)
                  </option>
                </select>
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
                    disabled={!nutricionista}
                  >
                    <option value="">
                      {!nutricionista
                        ? "Seleccione un especialista primero"
                        : horariosDisponibles.length === 0
                        ? "Sin horas disponibles para este día"
                        : "Seleccione hora"}
                    </option>
                    {horariosDisponibles.map((h) => (
                      <option key={h} value={h}>
                        {h}
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
                  placeholder="Describa brevemente..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-nutri-purple w-100 mt-2">
                Confirmar y Agendar Cita
              </button>
            </form>
          </div>
        </div>

        {/* Panel Lateral "Mis Citas Registradas" */}
        <div className="col-md-5">
          <div className="card card-nutri p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Mis Citas Registradas</h5>
            {misCitas.length === 0 ? (
              <p className="text-muted small">
                No tienes citas agendadas actualmente.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {misCitas.map((cita) => (
                  <div key={cita.id} className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-success small">
                        {cita.servicio}
                      </span>
                      <span
                        className="badge bg-purple text-white"
                        style={{ backgroundColor: "#521d91" }}
                      >
                        {cita.hora}
                      </span>
                    </div>
                    <div className="small text-muted">
                      <div>
                        <strong>Fecha:</strong> {cita.fecha}
                      </div>
                      <div>
                        <strong>Especialista:</strong> {cita.nutricionista}
                      </div>
                      <div>
                        <strong>RUT:</strong> {cita.rut}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agendar;
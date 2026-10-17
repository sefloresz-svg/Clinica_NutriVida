import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Agendar() {
  const navigate = useNavigate();
  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");

  const [servicio, setServicio] = useState("");
  const [nutricionista, setNutricionista] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    if (!sesionGuardada) {
      alert("Debes iniciar sesión para agendar una hora de atención.");
      navigate("/login");
    }
  }, [sesionGuardada, navigate]);

  if (!sesionGuardada) return null;

  const sesion = JSON.parse(sesionGuardada);

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4" style={{ color: '#3f1473' }}>
        Reserva de Cita Nutricional
      </h2>
      <div className="row g-4">
        {/* Formulario de Agendamiento */}
        <div className="col-md-7">
          <div className="card card-nutri p-4">
            <h5 className="fw-bold mb-3">Datos de la Cita</h5>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Nombre del Paciente:</label>
              <input type="text" className="form-control" value={sesion.nombre} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">RUT:</label>
              <input type="text" className="form-control" placeholder="12.345.678-9" />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Servicio:</label>
              <select className="form-select" value={servicio} onChange={(e) => setServicio(e.target.value)}>
                <option value="">Seleccione un servicio</option>
                <option value="Primera consulta nutricional">Primera consulta nutricional ($35.000)</option>
                <option value="Control nutricional">Control nutricional ($25.000)</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Nutricionista:</label>
              <select className="form-select" value={nutricionista} onChange={(e) => setNutricionista(e.target.value)}>
                <option value="">Seleccione especialista</option>
                <option value="Nut. Carolina Fuentes M.">Nut. Carolina Fuentes M.</option>
                <option value="Nut. Rodrigo Sepúlveda A.">Nut. Rodrigo Sepúlveda A.</option>
              </select>
            </div>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Fecha:</label>
                <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Hora disponible:</label>
                <select className="form-select" value={hora} onChange={(e) => setHora(e.target.value)}>
                  <option value="">Seleccione hora</option>
                  <option value="09:00">09:00 hrs</option>
                  <option value="10:00">10:00 hrs</option>
                  <option value="11:30">11:30 hrs</option>
                </select>
              </div>
            </div>
            <button className="btn btn-nutri-purple w-100 mt-2">
              Confirmar y Agendar Cita
            </button>
          </div>
        </div>

        {/* Panel Lateral "Mis Citas Registradas" */}
        <div className="col-md-5">
          <div className="card card-nutri p-4">
            <h5 className="fw-bold mb-3">Mis Citas Registradas</h5>
            <p className="text-muted small">No tienes citas agendadas actualmente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agendar;
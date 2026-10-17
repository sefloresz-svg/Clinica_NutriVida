import { useNavigate } from "react-router-dom";

function Nutricionistas() {
  const navigate = useNavigate();

  const equipo = [
    { nombre: "Nut. Carolina Fuentes M.", esp: "Nutrición Clínica y Pérdida de Peso" },
    { nombre: "Nut. Rodrigo Sepúlveda A.", esp: "Rendimiento Deportivo y Antropometría ISAK II" },
    { nombre: "Nut. Daniela Morales C.", esp: "Alimentación Vegetariana y Vegana" },
    { nombre: "Nut. Felipe Araya R.", esp: "Diabetes, Hipertensión y Salud Infantil" }
  ];

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 text-dark text-center">Nuestro Equipo Médico</h2>
      <div className="row g-4 justify-content-center">
        {equipo.map((m, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card card-nutri p-4 text-center h-100">
              <div className="fs-1 mb-2">🧑‍⚕️</div>
              <h5 className="fw-bold">{m.nombre}</h5>
              <span className="badge-nutri d-inline-block my-2">{m.esp}</span>
              <button onClick={() => navigate("/agendar")} className="btn btn-nutri-teal w-100 mt-3">
                Agendar Cita
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Nutricionistas;
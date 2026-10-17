import { useNavigate } from "react-router-dom";

function Servicios() {
  const navigate = useNavigate();

  const servicios = [
    { tipo: "Consulta", titulo: "Primera consulta nutricional", codigo: "CN001", duracion: "50 min | Presencial", precio: "$35.000" },
    { tipo: "Consulta", titulo: "Control nutricional (seguimiento)", codigo: "CN002", duracion: "30 min | Presencial", precio: "$25.000" },
    { tipo: "Plan especializado", titulo: "Plan pérdida de peso (1 mes)", codigo: "PL001", duracion: "1 mes | Presencial", precio: "$65.000" },
    { tipo: "Plan especializado", titulo: "Plan nutrición deportiva (1 mes)", codigo: "PL003", duracion: "1 mes | Presencial", precio: "$70.000" },
    { tipo: "Plan especializado", titulo: "Plan alimentación vegetariana/vegana", codigo: "PL005", duracion: "1 mes | Presencial", precio: "$68.000" }
  ];

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 text-dark">Nuestros Planes y Consultas</h2>
      <div className="row g-4">
        {servicios.map((s, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card card-nutri p-4 h-100 d-flex flex-column justify-between">
              <div>
                <span className="badge-nutri d-inline-block mb-2">{s.tipo}</span>
                <h5 className="fw-bold">{s.titulo}</h5>
                <p className="text-muted small mb-1">Código: {s.codigo}</p>
                <p className="text-muted small mb-3">Duración: {s.duracion}</p>
                <h4 className="fw-bold text-teal mb-3" style={{ color: "#10b981" }}>{s.precio}</h4>
              </div>
              <button onClick={() => navigate("/agendar")} className="btn btn-nutri-teal w-100 mt-auto">
                Reservar este servicio
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicios;
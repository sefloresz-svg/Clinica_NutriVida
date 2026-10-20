import { useNavigate } from "react-router-dom";
import rodrigo from "../assets/Rodrigo.jpg";
import felipe from "../assets/Felipe.jpg";

function Nutricionistas() {
  const navigate = useNavigate();

  const equipo = [
    { nombre: "Nut. Carolina Fuentes M.", esp: "Nutrición Clínica y Pérdida de Peso", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { nombre: "Nut. Rodrigo Sepúlveda A.", esp: "Rendimiento Deportivo y Antropometría ISAK II", img: rodrigo },
    { nombre: "Nut. Daniela Morales C.", esp: "Alimentación Vegetariana y Vegana", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { nombre: "Nut. Felipe Araya R.", esp: "Diabetes, Hipertensión y Salud Infantil", img: felipe }
  ];

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 text-dark text-center">Nuestro Equipo Médico</h2>
      <div className="row g-4 justify-content-center">
        {equipo.map((m, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card card-nutri p-4 text-center h-100">
              <img src={m.img} alt={m.nombre} className="rounded-circle mx-auto mb-3" style={{ width: "110px", height: "110px", objectFit: "cover" }} />
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
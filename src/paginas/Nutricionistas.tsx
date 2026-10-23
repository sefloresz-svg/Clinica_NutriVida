import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fotoRodrigo from "../assets/Rodrigo.jpg";
import fotoFelipe from "../assets/Felipe.jpg";

interface Nutricionista {
  nombre: string;
  esp: string;
  img: string;
}

function Nutricionistas() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<string>("");

  useEffect(() => {
    const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
    if (sesionGuardada) {
      try {
        const sesion = JSON.parse(sesionGuardada);
        setRol((sesion.rol || "").toString().toLowerCase().trim());
      } catch (e) {
        console.error("Error al leer la sesión:", e);
      }
    }
  });

  const esAdmin = rol === "admin" || rol === "administrador";
  const esNutri = rol === "nutricionista" || rol === "nutri";

  // USO DE LAS VARIABLES DE LAS IMÁGENES IMPORTADAS
  const [equipo, setEquipo] = useState<Nutricionista[]>([
    {
      nombre: "Nut. Carolina Fuentes M.",
      esp: "Nutrición Clínica y Pérdida de Peso",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      nombre: "Nut. Rodrigo Sepúlveda A.",
      esp: "Rendimiento Deportivo y Antropometría ISAK II",
      img: fotoRodrigo,
    },
    {
      nombre: "Nut. Daniela Morales C.",
      esp: "Alimentación Vegetariana y Vegana",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      nombre: "Nut. Felipe Araya R.",
      esp: "Diabetes, Hipertensión y Salud Infantil",
      img: fotoFelipe,
    },
  ]);

  const manejarAgregar = () => {
    alert("Modal para registrar un nuevo especialista.");
  };

  const manejarEditar = (nombre: string) => {
    alert(`Editar información de ${nombre}`);
  };

  const manejarEliminar = (nombre: string) => {
    if (confirm(`¿Deseas eliminar a ${nombre} del sistema?`)) {
      setEquipo(equipo.filter((m) => m.nombre !== nombre));
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h2 className="fw-bold text-dark text-center text-md-start mb-0">
          Nuestro Equipo Médico
        </h2>

        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm"
            onClick={manejarAgregar}
          >
            + Agregar Nutricionista
          </button>
        )}
      </div>

      <div className="row g-4 justify-content-center">
        {equipo.map((m, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card card-nutri p-4 text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <img
                  src={m.img}
                  alt={m.nombre}
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: "110px", height: "110px", objectFit: "cover" }}
                />
                <h5 className="fw-bold">{m.nombre}</h5>
                <span className="badge-nutri d-inline-block my-2">{m.esp}</span>
              </div>

              <div className="mt-3">
                {esAdmin ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-3"
                      onClick={() => manejarEditar(m.nombre)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-3"
                      onClick={() => manejarEliminar(m.nombre)}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : esNutri ? (
                  <span className="badge bg-secondary-subtle text-secondary w-100 py-2 rounded-3 border fw-semibold">
                    Perfil Médico
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      navigate("/agendar", {
                        state: { nutricionistaPreseleccionado: m.nombre },
                      })
                    }
                    className="btn btn-nutri-teal w-100"
                  >
                    Agendar Cita
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Nutricionistas;
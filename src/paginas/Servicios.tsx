import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Servicio {
  id: number;
  titulo: string;
  codigo: string;
  duracion: string;
  modalidad: string;
  precio: string;
  tipo: string;
}

function Servicios() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<string>("");

  // Lectura reactiva de la sesión
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
  }, []);

  const esAdmin = rol === "admin" || rol === "administrador";
  const esNutri = rol === "nutricionista" || rol === "nutri";

  // Arreglo de servicios y prestaciones
  const [servicios, setServicios] = useState<Servicio[]>([
    {
      id: 1,
      titulo: "Primera consulta nutricional",
      codigo: "CN001",
      duracion: "50 min",
      modalidad: "Presencial",
      precio: "$35.000",
      tipo: "Consulta",
    },
    {
      id: 2,
      titulo: "Control nutricional (seguimiento)",
      codigo: "CN002",
      duracion: "30 min",
      modalidad: "Presencial",
      precio: "$25.000",
      tipo: "Consulta",
    },
    {
      id: 3,
      titulo: "Plan pérdida de peso (1 mes)",
      codigo: "PL001",
      duracion: "1 mes",
      modalidad: "Presencial",
      precio: "$65.000",
      tipo: "Plan especializado",
    },
    {
      id: 4,
      titulo: "Plan nutrición deportiva (1 mes)",
      codigo: "PL003",
      duracion: "1 mes",
      modalidad: "Presencial",
      precio: "$70.000",
      tipo: "Plan especializado",
    },
    {
      id: 5,
      titulo: "Plan alimentación vegetariana/vegana",
      codigo: "PL005",
      duracion: "1 mes",
      modalidad: "Presencial",
      precio: "$68.000",
      tipo: "Plan especializado",
    },
  ]);

  // Redirección pasando el servicio preseleccionado
  const reservarServicio = (nombreServicio: string) => {
    navigate("/agendar", { state: { servicioPreseleccionado: nombreServicio } });
  };

  // Funciones de gestión para el Administrador
  const manejarAgregar = () => {
    alert("Modal para registrar una nueva prestación o arancel.");
  };

  const manejarEditar = (id: number, titulo: string) => {
    alert(`Editar arancel o datos del servicio #${id}: "${titulo}"`);
  };

  const manejarEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este servicio del catálogo?")) {
      setServicios(servicios.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="container my-4">
      {/* Cabecera Adaptativa */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Nuestros Planes y Consultas</h2>
          <p className="text-muted small mb-0">
            Catálogo oficial de prestaciones clínicas y programas nutricionales.
          </p>
        </div>

        {/* Botón exclusivo de administración */}
        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm text-nowrap"
            onClick={manejarAgregar}
          >
            + Agregar Servicio
          </button>
        )}
      </div>

      {/* Grilla de Servicios */}
      <div className="row g-4">
        {servicios.map((s) => (
          <div key={s.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-column justify-content-between">
              <div>
                <span className="badge bg-success-subtle text-success fw-semibold px-3 py-1 rounded-pill mb-2 small">
                  {s.tipo}
                </span>
                <h5 className="fw-bold text-dark mb-1">{s.titulo}</h5>
                <p className="text-muted small mb-2">
                  Código: {s.codigo} <br />
                  Duración: {s.duracion} | {s.modalidad}
                </p>
                <h4 className="fw-bold text-success mb-3">{s.precio}</h4>
              </div>

              <div>
                {/* 1. ADMINISTRADOR */}
                {esAdmin ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-3"
                      onClick={() => manejarEditar(s.id, s.titulo)}
                    >
                      Editar Arancel
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-3"
                      onClick={() => manejarEliminar(s.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : esNutri ? (
                  /* 2. NUTRICIONISTA */
                  <span className="badge bg-secondary-subtle text-secondary w-100 py-2 rounded-3 border fw-semibold d-block text-center">
                    Catálogo Informativo
                  </span>
                ) : (
                  /* 3. PACIENTE O PÚBLICO */
                  <button
                    className="btn btn-success w-100 fw-bold py-2 rounded-3"
                    onClick={() => reservarServicio(s.titulo)}
                  >
                    Reservar este servicio
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

export default Servicios;
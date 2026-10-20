import { useEffect, useState } from "react";

// Misma interfaz 'Cita' utilizada en Agendar.tsx
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

function Administrador() {
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    // Obtiene las citas guardadas globalmente en el sessionStorage bajo la clave 'citasNutriVida'
    const guardadas = sessionStorage.getItem("citasNutriVida");
    if (guardadas) {
      try {
        setCitas(JSON.parse(guardadas));
      } catch (error) {
        console.error("Error al parsear el historial de citas:", error);
      }
    }
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Panel Administrativo</h2>
          <p className="text-muted small mb-0">
            Registro general de pacientes y sus reservas asignadas por especialista.
          </p>
        </div>
        <span
          className="badge text-white px-3 py-2 rounded-3 fs-6"
          style={{ backgroundColor: "#3f1473" }}
        >
          Total Reservas: {citas.length}
        </span>
      </div>

      {/* Tabla de Reservas en modo solo lectura */}
      <div className="card card-nutri shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-3" style={{ color: "#3f1473" }}>
          Listado Oficial de Citas
        </h5>

        {citas.length === 0 ? (
          <div className="alert alert-light text-center py-4 my-2 border">
            <p className="text-muted mb-0">
              No hay citas o reservas registradas en el sistema actualmente.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Paciente</th>
                  <th scope="col">RUT</th>
                  <th scope="col">Especialista (Doctor)</th>
                  <th scope="col">Servicio</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.id}>
                    <td>
                      <strong className="text-dark">{cita.paciente}</strong>
                    </td>
                    <td className="text-muted small">{cita.rut}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle px-2 py-1">
                        {cita.nutricionista}
                      </span>
                    </td>
                    <td>{cita.servicio}</td>
                    <td>{cita.fecha}</td>
                    <td>
                      <span
                        className="badge text-white px-2 py-1"
                        style={{ backgroundColor: "#521d91" }}
                      >
                        {cita.hora}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {cita.motivo && cita.motivo.trim() !== "" ? cita.motivo : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Administrador;
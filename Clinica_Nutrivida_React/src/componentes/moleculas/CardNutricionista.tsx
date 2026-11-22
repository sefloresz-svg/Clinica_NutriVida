import type { Nutricionista } from "../../utils/tipos";

interface CardNutricionistaProps {
  nutricionista: Nutricionista;
  esAdmin: boolean;
  esNutri: boolean;
  alEditar: (nutricionista: Nutricionista) => void;
  alEliminar: (nutricionista: Nutricionista) => void;
  alAgendar: (id: number) => void;
}

// Foto por defecto si el nutricionista no tiene una
const FOTO_POR_DEFECTO = "https://randomuser.me/api/portraits/lego/1.jpg";

// Tarjeta de un nutricionista del equipo
function CardNutricionista({ nutricionista, esAdmin, esNutri, alEditar, alEliminar, alAgendar }: CardNutricionistaProps) {
  return (
    <div className="card card-nutri p-4 text-center h-100 d-flex flex-column justify-content-between">
      <div>
        <img
          src={nutricionista.fotoUrl || FOTO_POR_DEFECTO}
          alt={nutricionista.nombre}
          className="rounded-circle mx-auto mb-3"
          style={{ width: "110px", height: "110px", objectFit: "cover" }}
        />
        <h5 className="fw-bold">Nut. {nutricionista.nombre}</h5>
        <span className="badge-nutri d-inline-block my-2">{nutricionista.especialidad}</span>
      </div>

      <div className="mt-3">
        {esAdmin ? (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-3"
              onClick={() => alEditar(nutricionista)}
            >
              Editar
            </button>
            <button
              className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-3"
              onClick={() => alEliminar(nutricionista)}
            >
              Eliminar
            </button>
          </div>
        ) : esNutri ? (
          <span className="badge bg-secondary-subtle text-secondary w-100 py-2 rounded-3 border fw-semibold">
            Perfil Médico
          </span>
        ) : (
          <button onClick={() => alAgendar(nutricionista.id)} className="btn btn-nutri-teal w-100">
            Agendar Cita
          </button>
        )}
      </div>
    </div>
  );
}

export default CardNutricionista;

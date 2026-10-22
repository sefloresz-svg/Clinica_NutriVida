import { useState, useEffect } from "react";

interface Novedad {
  id: number;
  titulo: string;
  categoria: string;
  resumen: string;
  contenidoCompleto: string;
  fecha: string;
  imagen: string;
}

function Novedades() {
  const [rol, setRol] = useState<string>("");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Novedad | null>(null);

  // Carga reactiva del rol
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

  // Lista inicial de novedades y consejos
  const [novedades, setNovedades] = useState<Novedad[]>([
    {
      id: 1,
      titulo: "5 Claves para Mantener una Hidratación Óptima",
      categoria: "Consejo Nutricional",
      resumen: "El agua es fundamental para el metabolismo. Descubre cómo calcular tus requerimientos diarios según tu estilo de vida.",
      contenidoCompleto:
        "La hidratación adecuada no solo previene la fatiga, sino que optimiza el rendimiento físico y cognitivo. Para calcular tus necesidades básicas, multiplica tu peso en kilos por 35 ml. No olvides priorizar el agua pura por encima de bebidas azucaradas o procesadas.",
      fecha: "18 de Octubre, 2026",
      imagen: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      titulo: "Mitos y Realidades del Ayuno Intermitente",
      categoria: "Artículo Clínico",
      resumen: "Analizamos qué dice la evidencia científica actual sobre los protocolos 16/8 y su impacto en la sensibilidad a la insulina.",
      contenidoCompleto:
        "El ayuno intermitente ha ganado popularidad, pero no es una solución mágica ni adecuada para todos los pacientes. Aunque muestra beneficios en el control glucémico y la flexibilidad metabólica, es imprescindible contar con supervisión profesional para evitar déficits nutricionales o atracones compensatorios.",
      fecha: "12 de Octubre, 2026",
      imagen: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      titulo: "Superalimentos Locales: El Valor Nutricional de la Quinua",
      categoria: "Alimentación Saludable",
      resumen: "Conoce las propiedades de este pseudocereal rico en aminoácidos esenciales, fibra y minerales esenciales.",
      contenidoCompleto:
        "La quinua es uno de los pocos alimentos vegetales que contiene los nueve aminoácidos esenciales. Además, su alto contenido en fibra de digestión lenta ayuda a mantener la saciedad durante más tiempo, convirtiéndola en una excelente opción para dietas orientadas al control de peso o diabetes.",
      fecha: "05 de Octubre, 2026",
      imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    },
  ]);

  // Funciones de gestión para el Administrador
  const manejarPublicar = () => {
    alert("Modal para redactar y publicar una nueva novedad.");
  };

  const manejarEditar = (id: number, titulo: string) => {
    alert(`Editar artículo #${id}: "${titulo}"`);
  };

  const manejarEliminar = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      setNovedades(novedades.filter((art) => art.id !== id));
    }
  };

  return (
    <div className="container my-4">
      {/* Cabecera Adaptativa */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Novedades y Consejos</h2>
          <p className="text-muted small mb-0">
            Artículos, recomendaciones clínicas y noticias de interés sobre salud y nutrición.
          </p>
        </div>

        {/* Solo visible para el Administrador */}
        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm text-nowrap"
            onClick={manejarPublicar}
          >
            + Publicar Novedad
          </button>
        )}
      </div>

      {/* Grilla de Artículos */}
      <div className="row g-4">
        {novedades.map((art) => (
          <div key={art.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between">
              <div>
                <img
                  src={art.imagen}
                  alt={art.titulo}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded-2 small">
                      {art.categoria}
                    </span>
                    <small className="text-muted">{art.fecha}</small>
                  </div>
                  <h5 className="fw-bold text-dark mb-2 fs-6">{art.titulo}</h5>
                  <p className="text-muted small mb-0">{art.resumen}</p>
                </div>
              </div>

              {/* Botones según Rol */}
              <div className="p-3 pt-0">
                {esAdmin ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-3"
                      onClick={() => manejarEditar(art.id, art.titulo)}
                    >
                      Editar Artículo
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-100 fw-bold rounded-3"
                      onClick={() => manejarEliminar(art.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-success btn-sm w-100 fw-bold rounded-3"
                    onClick={() => setArticuloSeleccionado(art)}
                  >
                    Leer Artículo Completo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EMERGENTE PARA PACIENTES / NUTRICIONISTAS */}
      {articuloSeleccionado && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-light">
                <div>
                  <span className="badge bg-success-subtle text-success fw-semibold mb-1">
                    {articuloSeleccionado.categoria}
                  </span>
                  <h5 className="modal-title fw-bold text-dark">{articuloSeleccionado.titulo}</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setArticuloSeleccionado(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <img
                  src={articuloSeleccionado.imagen}
                  alt={articuloSeleccionado.titulo}
                  className="w-100 rounded-3 mb-3 shadow-sm"
                  style={{ maxHeight: "280px", objectFit: "cover" }}
                />
                <p className="text-muted small mb-3">
                  <strong>Publicado el:</strong> {articuloSeleccionado.fecha}
                </p>
                <div className="text-dark leading-relaxed">
                  {articuloSeleccionado.contenidoCompleto}
                </div>
              </div>

              <div className="modal-footer border-0 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary fw-bold px-4 rounded-3"
                  onClick={() => setArticuloSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Novedades;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Inicio() {
  const navigate = useNavigate();
  const [rol, setRol] = useState<string>("");

  // Contenido editable de la portada
  const [contenidoHero, setContenidoHero] = useState({
    titulo: "Asesoría Nutricional Personalizada en Temuco",
    subtitulo:
      "Te acompañamos en tu camino hacia una vida saludable con planes 100% adaptados a tus objetivos médicos y deportivos.",
  });

  // Estado para el modal de edición del Admin
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tituloTemp, setTituloTemp] = useState("");
  const [subtituloTemp, setSubtituloTemp] = useState("");

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

  const abrirModalEditar = () => {
    setTituloTemp(contenidoHero.titulo);
    setSubtituloTemp(contenidoHero.subtitulo);
    setMostrarModal(true);
  };

  const guardarCambios = (e: React.FormEvent) => {
    e.preventDefault();
    setContenidoHero({
      titulo: tituloTemp,
      subtitulo: subtituloTemp,
    });
    setMostrarModal(false);
    alert("¡Contenido del Inicio actualizado correctamente!");
  };

  return (
    <div className="container my-5">
      {/* SECCIÓN HERO */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-12 col-lg-6">
          {/* Botón de gestión exclusivo para el Admin */}
          {esAdmin && (
            <div className="mb-3">
              <button
                className="btn btn-outline-primary btn-sm fw-bold px-3 py-2 rounded-3 shadow-sm"
                onClick={abrirModalEditar}
              >
                ✏️ Editar Banner Principal
              </button>
            </div>
          )}

          <h1 className="display-5 fw-bold text-dark mb-3">
            {contenidoHero.titulo}
          </h1>
          <p className="lead text-muted mb-4 fs-6">
            {contenidoHero.subtitulo}
          </p>

          {/* El botón de agendar sólo aparece si NO es administrador */}
          {!esAdmin && (
            <button
              className="btn btn-success btn-lg px-4 fw-bold rounded-3 shadow-sm"
              onClick={() => navigate("/agendar")}
            >
              Agendar Mi Cita
            </button>
          )}
        </div>

        <div className="col-12 col-lg-6 text-center">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80"
            alt="Alimentación Saludable NutriVida"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: "380px", objectFit: "cover", width: "100%" }}
          />
        </div>
      </div>

      {/* SECCIÓN DE CARACTERÍSTICAS */}
      <div className="text-center my-5 pt-3">
        <h3 className="fw-bold text-dark mb-4">¿Por qué elegir NutriVida?</h3>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">🎓</div>
              <h5 className="fw-bold text-dark">Atención Certificada</h5>
              <p className="text-muted small mb-0">
                Consulta presencial y online liderada por nutricionistas universitarios con amplia experiencia clínica.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">📊</div>
              <h5 className="fw-bold text-dark">Seguimiento Continuo</h5>
              <p className="text-muted small mb-0">
                Medición constante de tus indicadores antropométricos para evaluar avances reales en cada control.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">🥗</div>
              <h5 className="fw-bold text-dark">Planes a tu Medida</h5>
              <p className="text-muted small mb-0">
                Pérdida de peso, nutrición deportiva, salud metabólica, dietas vegetarianas y veganas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA EDITAR INICIO (SOLO ADMIN) */}
      {mostrarModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 bg-light">
                <h5 className="modal-title fw-bold text-dark">
                  Editar Banner de Inicio
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>

              <form onSubmit={guardarCambios}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-dark">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={tituloTemp}
                      onChange={(e) => setTituloTemp(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-dark">
                      Bajada / Descripción
                    </label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={subtituloTemp}
                      onChange={(e) => setSubtituloTemp(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary fw-bold rounded-3"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold rounded-3"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inicio;
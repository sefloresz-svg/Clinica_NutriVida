import { useNavigate, useLocation } from "react-router-dom";
import { obtenerSesion } from "../utils/api";

function Inicio() {
  const navigate = useNavigate();
  const location = useLocation();
  // El rol se lee del usuario guardado al hacer login
  const rol = (obtenerSesion()?.rol || "").toLowerCase();

  // Aviso que manda otra página al redirigir aquí (ej: Administrador)
  const mensaje = location.state?.mensaje;

  // El botón de agendar no se muestra al Admin
  const esAdmin = rol === "admin" || rol === "administrador";

  return (
    <div className="container my-5">
      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

      {/* SECCIÓN HERO */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-12 col-lg-6">
          <h1 className="display-5 fw-bold text-dark mb-3">
            Asesoría Nutricional Personalizada en Temuco
          </h1>
          <p className="lead text-muted mb-4 fs-6">
            Te acompañamos en tu camino hacia una vida saludable con planes 100% adaptados a tus objetivos médicos y deportivos.
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
    </div>
  );
}

export default Inicio;
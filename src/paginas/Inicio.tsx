import { Link } from "react-router-dom";

function Inicio() {
  return (
    <div className="container my-4">
      {/* Banner Principal */}
      <div className="row align-items-center my-5">
        <div className="col-md-6">
          <h1 className="display-5 fw-bold text-dark mb-3">
            Asesoría Nutricional Personalizada en Temuco
          </h1>
          <p className="lead text-muted mb-4">
            Te acompañamos en tu camino hacia una vida saludable con
            planes 100% adaptados a tus objetivos médicos y deportivos.
          </p>
          <Link to="/agendar" className="btn btn-nutri-teal btn-lg">
            Agendar Mi Cita
          </Link>
        </div>
        <div className="col-md-6 text-center mt-4 mt-md-0">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80"
            alt="Alimentación saludable"
            className="img-fluid rounded-4 shadow"
          />
        </div>
      </div>

      {/* Sección ¿Por qué elegir NutriVida? */}
      <div className="text-center my-5">
        <h2 className="fw-bold mb-4" style={{ color: '#3f1473' }}>
          ¿Por qué elegir NutriVida?
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card card-nutri p-4 h-100 text-center">
              <div className="fs-1 mb-2">🎓</div>
              <h5 className="fw-bold">Atención Certificada</h5>
              <p className="text-muted small">
                Consulta presencial y online liderada por nutricionistas universitarios con amplia experiencia clínica.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-nutri p-4 h-100 text-center">
              <div className="fs-1 mb-2">📊</div>
              <h5 className="fw-bold">Seguimiento Continuo</h5>
              <p className="text-muted small">
                Medición constante de tus indicadores antropométricos para evaluar avances reales en cada control.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-nutri p-4 h-100 text-center">
              <div className="fs-1 mb-2">🥗</div>
              <h5 className="fw-bold">Planes a tu Medida</h5>
              <p className="text-muted small">
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
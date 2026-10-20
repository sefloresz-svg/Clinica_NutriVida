import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-auto py-4 text-white" style={{ backgroundColor: "#3f1473" }}>
      <div className="container">
        <div className="row g-4">
          
          {/* Columna 1: Información de la clínica */}
          <div className="col-md-4">
            <h5 className="fw-bold text-white mb-3">Clínica NutriVida</h5>
            <p className="small opacity-75">
              Te acompañamos en tu camino hacia una vida saludable con planes 100% adaptados a tus objetivos médicos y deportivos.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-md-4">
            <h5 className="fw-bold text-white mb-3">Navegación</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-white text-decoration-none opacity-75 opacity-100-hover">Inicio</Link></li>
              <li><Link to="/novedades" className="text-white text-decoration-none opacity-75 opacity-100-hover">Novedades</Link></li>
              <li><Link to="/servicios" className="text-white text-decoration-none opacity-75 opacity-100-hover">Servicios</Link></li>
              <li><Link to="/agendar" className="text-white text-decoration-none opacity-75 opacity-100-hover">Agendar Cita</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-md-4">
            <h5 className="fw-bold text-white mb-3">Contacto</h5>
            <ul className="list-unstyled small opacity-75 d-flex flex-column gap-2">
              <li>📍 Temuco, Región de la Araucanía</li>
              <li>📞 +56 9 1234 5678</li>
              <li>✉️ contacto@nutrivida.cl</li>
              <li>🕒 Lunes a Viernes: 09:00 - 18:30 hrs</li>
            </ul>
          </div>

        </div>

        <hr className="my-4 border-light opacity-25" />

        <div className="text-center small opacity-75">
          © {new Date().getFullYear()} Clínica NutriVida. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
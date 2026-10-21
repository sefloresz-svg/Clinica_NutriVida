import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Captura_de_pantalla_2026-09-06_231024.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  // Detectar si estamos dentro del panel de administración
  const esVistaAdmin = location.pathname === "/administrador";

  const cerrarSesion = () => {
    sessionStorage.removeItem("sesionNutriVida");
    navigate("/");
  };

  const obtenerClaseLink = (path: string) => {
    const esActivo = location.pathname === path;
    return `nav-link nav-link-nutri text-white ${
      esActivo ? "fw-bold border-bottom border-2 border-white pb-1" : "fw-semibold"
    }`;
  };

  return (
    <header className="mb-0">
      {/* Cabecera superior */}
      <div className={`header-top py-2 border-bottom ${esVistaAdmin ? "bg-slate-900 text-white" : "bg-white"}`}
           style={{ backgroundColor: esVistaAdmin ? "#0f172a" : "#ffffff" }}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img 
              src={logo} 
              alt="Logo Clínica NutriVida" 
              className="me-2" 
              style={{ 
                width: "42px", 
                height: "42px", 
                borderRadius: "50%", 
                objectFit: "cover" 
              }} 
            />
            <span className={`fs-4 fw-bold ${esVistaAdmin ? "text-white" : "text-dark"}`}>
              Clínica <span style={{ color: esVistaAdmin ? "#38bdf8" : "#521d91" }}>NutriVida</span>
            </span>
            {esVistaAdmin && (
              <span className="badge bg-primary ms-3 text-uppercase px-2 py-1 fs-7">
                Console Admin
              </span>
            )}
          </Link>

          <div>
            {sesion ? (
              <div className="d-flex align-items-center gap-3">
                <span className={`small fw-bold ${esVistaAdmin ? "text-light" : "text-secondary"}`}>
                  {sesion.nombre} ({sesion.rol})
                </span>
                <button
                  className="btn btn-danger btn-sm fw-bold px-3 py-2 rounded-3 text-white"
                  onClick={cerrarSesion}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-danger btn-sm fw-bold px-3 py-2 rounded-3 text-white text-decoration-none"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menú de navegación: cambia de Morado a Azul Ejecutivo Slate cuando es Admin */}
      <nav 
        className="navbar navbar-expand-lg shadow-sm py-2"
        style={{ backgroundColor: esVistaAdmin ? "#1e293b" : "#521d91" }}
      >
        <div className="container justify-content-center">
          <div className="navbar-nav d-flex flex-row gap-3 align-items-center">
            
            <Link className={obtenerClaseLink("/")} to="/">
              Inicio
            </Link>

            <Link className={obtenerClaseLink("/novedades")} to="/novedades">
              Novedades
            </Link>

            <Link className={obtenerClaseLink("/servicios")} to="/servicios">
              Servicios
            </Link>

            <Link className={obtenerClaseLink("/nutricionistas")} to="/nutricionistas">
              Nuestros Nutricionistas
            </Link>

            {/* Si es paciente o público muestra Agendar Cita */}
            {(!sesion || sesion.rol === "Paciente") && (
              <Link className={obtenerClaseLink("/agendar")} to="/agendar">
                Agendar Cita
              </Link>
            )}

            {/* Si es Nutricionista o Admin muestra Ver Pacientes */}
            {sesion && (sesion.rol === "Admin" || sesion.rol === "Nutricionista") && (
              <Link className={obtenerClaseLink("/pacientes")} to="/pacientes">
                Ver Pacientes
              </Link>
            )}

            {/* Panel de administración exclusivo de Admin */}
            {sesion?.rol === "Admin" && (
              <Link className={obtenerClaseLink("/administrador")} to="/administrador">
                Panel Administración
              </Link>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
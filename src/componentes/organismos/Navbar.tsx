import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  // 🔹 La clave: Si el rol es Admin, activa el estilo ejecutivo en TODO el sitio
  const esAdmin = sesion?.rol === "Admin";

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
      {/* Cabecera superior: Oscura si es Admin, Blanca si es Paciente/Nutri */}
      <div 
        className="header-top py-2 border-bottom"
        style={{ backgroundColor: esAdmin ? "#0f172a" : "#ffffff" }}
      >
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
            <span className={`fs-4 fw-bold ${esAdmin ? "text-white" : "text-dark"}`}>
              Clínica <span style={{ color: esAdmin ? "#38bdf8" : "#521d91" }}>NutriVida</span>
            </span>
            {esAdmin && (
              <span className="badge bg-primary ms-3 text-uppercase px-2 py-1 fs-7">
                Console Admin
              </span>
            )}
          </Link>

          <div>
            {sesion ? (
              <div className="d-flex align-items-center gap-3">
                <span className={`small fw-bold ${esAdmin ? "text-light" : "text-secondary"}`}>
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

      {/* Menú de navegación: Azul Ejecutivo si es Admin, Morado si es Paciente/Nutri */}
      <nav 
        className="navbar navbar-expand-lg shadow-sm py-2"
        style={{ backgroundColor: esAdmin ? "#1e293b" : "#521d91" }}
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

            {/* Solo Pacientes o visatantes ven Agendar Cita */}
            {(!sesion || sesion.rol === "Paciente") && (
              <Link className={obtenerClaseLink("/agendar")} to="/agendar">
                Agendar Cita
              </Link>
            )}

            {/* Nutricionistas y Admin ven Ver Pacientes */}
            {sesion && (sesion.rol === "Admin" || sesion.rol === "Nutricionista") && (
              <Link className={obtenerClaseLink("/pacientes")} to="/pacientes">
                Ver Pacientes
              </Link>
            )}

            {/* Panel de administración exclusivo de Admin */}
            {esAdmin && (
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
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const sesionGuardada = sessionStorage.getItem("sesionNutriVida");
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const cerrarSesion = () => {
    sessionStorage.removeItem("sesionNutriVida");
    navigate("/");
  };

  return (
    <header className="mb-4">
      {/* Cabecera superior blanca */}
      <div className="header-top py-2 border-bottom bg-white">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <span className="fs-3 me-2">🌱</span>
            <span className="fs-4 fw-bold text-dark">
              Clínica <span style={{ color: "#521d91" }}>NutriVida</span>
            </span>
          </Link>

          <div>
            {sesion ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-secondary small fw-bold">
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

      {/* Menú de navegación inferior */}
      <nav className="navbar navbar-expand-lg bg-nutri-purple shadow-sm py-2">
        <div className="container justify-content-center">
          <div className="navbar-nav d-flex flex-row gap-3">
            <Link className="nav-link nav-link-nutri text-white fw-semibold" to="/">
              Inicio
            </Link>
            <Link className="nav-link nav-link-nutri text-white fw-semibold" to="/novedades">
              Novedades
            </Link>
            <Link className="nav-link nav-link-nutri text-white fw-semibold" to="/servicios">
              Servicios
            </Link>
            <Link className="nav-link nav-link-nutri text-white fw-semibold" to="/nutricionistas">
              Nuestros Nutricionistas
            </Link>

            {/* Si es paciente o público muestra Agendar Cita */}
            {(!sesion || sesion.rol === "Paciente") && (
              <Link className="nav-link nav-link-nutri text-white fw-semibold" to="/agendar">
                Agendar Cita
              </Link>
            )}

            {/* Si es Nutricionista o Admin muestra Ver Pacientes igual al HTML */}
            {sesion && (sesion.rol === "Admin" || sesion.rol === "Nutricionista") && (
              <Link className="nav-link nav-link-nutri text-white fw-semibold" to="/pacientes">
                Ver Pacientes
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
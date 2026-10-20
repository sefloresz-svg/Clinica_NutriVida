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
 {/* 1. Cabecera superior blanca con Logo y Usuario */}
 <div className="header-top">
 <div className="container d-flex justify-content-between
align-items-center">
 <Link to="/" className="d-flex align-items-center
text-decoration-none">
 <span className="fs-3 me-2">🌱</span>
 <span className="fs-4 fw-bold text-dark">Clínica <span
style={{ color: '#521d91' }}>NutriVida</span></span>
 </Link>
 <div>
 {sesion ? (
 <div className="d-flex align-items-center gap-3">
 <span className="text-secondary small fw-bold">
 {sesion.nombre} ({sesion.rol})
 </span>
 <button className="btn btn-danger btn-sm fw-bold px-3"
onClick={cerrarSesion}>
 Cerrar Sesión
 </button>
 </div>
 ) : (
 <Link to="/login" className="btn btn-outline-primary
btn-sm fw-bold">
 
 </Link>
 )}
 </div>
 </div>
 </div>
 {/* 2. Barra de navegación morada */}
 <nav className="navbar navbar-expand-lg bg-nutri-purple
shadow-sm">
 <div className="container justify-content-center">
 <div className="navbar-nav d-flex flex-row gap-2">
 <Link className="nav-link nav-link-nutri"
to="/">Inicio</Link>
 <Link className="nav-link nav-link-nutri"
to="/novedades">Novedades</Link>
 <Link className="nav-link nav-link-nutri"
to="/servicios">Servicios</Link>
 <Link className="nav-link nav-link-nutri"
to="/nutricionistas">Nuestros Nutricionistas</Link>
 <Link className="nav-link nav-link-nutri"
to="/agendar">Agendar Cita</Link>

 {sesion && (sesion.rol === "Admin" || sesion.rol ===
"Nutricionista") && (
 <Link className="nav-link nav-link-nutri"
to="/pacientes">Pacientes</Link>
 )}
 </div>
 </div>
 </nav>
 </header>
 );
}
export default Navbar;
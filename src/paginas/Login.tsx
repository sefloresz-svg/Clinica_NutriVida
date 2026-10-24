import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

// Usuarios base predeterminados
const USUARIOS_BASE = [
  { correo: "admin@nutrivida.cl", clave: "1234", nombre: "Administrador", rol: "Admin" },
  { correo: "nutri@nutrivida.cl", clave: "1234", nombre: "Dra. Carolina Fuentes", rol: "Nutricionista" },
  { correo: "paciente@gmail.com", clave: "1234", nombre: "Juan Pérez", rol: "Paciente" }
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta si viene redirigido desde /agendar; si no, por defecto va al Inicio ("/")
  const rutaDestino = location.state?.from || "/";

  // Estado para alternar entre "Iniciar Sesión" y "Registrarse"
  const [esRegistro, setEsRegistro] = useState(false);

  // Estados Formulario Login
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  // Estados Formulario Registro
  const [nombreReg, setNombreReg] = useState("");
  const [rutReg, setRutReg] = useState("");
  const [correoReg, setCorreoReg] = useState("");
  const [claveReg, setClaveReg] = useState("");
  const [confirmarClaveReg, setConfirmarClaveReg] = useState("");

  // Obtener lista completa de usuarios (Base + Registrados en localStorage)
  const obtenerTodosLosUsuarios = () => {
    const registrados = localStorage.getItem("usuariosRegistradosNutriVida");
    if (registrados) {
      try {
        return [...USUARIOS_BASE, ...JSON.parse(registrados)];
      } catch (e) {
        return USUARIOS_BASE;
      }
    }
    return USUARIOS_BASE;
  };

  // MANEJO DE INICIO DE SESIÓN
  const manejarEnvioLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo.trim() || !clave.trim()) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
    }

    const todosLosUsuarios = obtenerTodosLosUsuarios();
    const usuarioEncontrado = todosLosUsuarios.find(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.clave === clave.trim()
    );

    if (usuarioEncontrado) {
      sessionStorage.setItem("sesionNutriVida", JSON.stringify(usuarioEncontrado));
      alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);
      navigate(rutaDestino);
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  };

  // MANEJO DE REGISTRO DE PACIENTE
  const manejarEnvioRegistro = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreReg.trim() || !rutReg.trim() || !correoReg.trim() || !claveReg.trim()) {
      alert("Por favor, completa todos los campos del registro.");
      return;
    }

    if (claveReg !== confirmarClaveReg) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const todosLosUsuarios = obtenerTodosLosUsuarios();
    const existe = todosLosUsuarios.some(
      (u) => u.correo.toLowerCase() === correoReg.trim().toLowerCase()
    );

    if (existe) {
      alert("El correo electrónico ya se encuentra registrado.");
      return;
    }

    const nuevoUsuario = {
      correo: correoReg.trim(),
      clave: claveReg.trim(),
      nombre: nombreReg.trim(),
      rut: rutReg.trim(),
      rol: "Paciente"
    };

    // Guardar en localStorage
    const registradosPrevios = JSON.parse(
      localStorage.getItem("usuariosRegistradosNutriVida") || "[]"
    );
    localStorage.setItem(
      "usuariosRegistradosNutriVida",
      JSON.stringify([...registradosPrevios, nuevoUsuario])
    );

    // Iniciar sesión automáticamente
    sessionStorage.setItem("sesionNutriVida", JSON.stringify(nuevoUsuario));
    alert(`¡Registro exitoso! Bienvenido/a a Clínica NutriVida, ${nuevoUsuario.nombre}.`);
    navigate(rutaDestino);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ backgroundColor: "#f0edfd" }}>
      <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 text-center" style={{ maxWidth: "440px", width: "100%" }}>
        
        {/* LOGO Y ENCABEZADO */}
        <h2 className="fw-bold mb-1">
          Clínica <span style={{ color: "#6b21a8" }}>NutriVida</span>
        </h2>
        <p className="text-muted small mb-4">
          {esRegistro
            ? "Crea tu cuenta de paciente para gestionar tus citas"
            : "Ingresa a tu cuenta para gestionar tus citas"}
        </p>

        {/* FORMULARIO DE INICIO DE SESIÓN */}
        {!esRegistro ? (
          <form onSubmit={manejarEnvioLogin} className="text-start">
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">Correo Electrónico</label>
              <input
                type="email"
                className="form-control form-control-lg bg-light fs-6"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-dark small">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg bg-light fs-6"
                placeholder="••••••••"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 fw-bold text-white rounded-3 mb-3"
              style={{ backgroundColor: "#10b981" }}
            >
              Ingresar
            </button>

            <div className="text-center">
              <span className="text-muted small">¿Aún no tienes cuenta? </span>
              <button
                type="button"
                className="btn btn-link p-0 small fw-bold text-decoration-none"
                style={{ color: "#6b21a8" }}
                onClick={() => setEsRegistro(true)}
              >
                Regístrate aquí
              </button>
            </div>
          </form>
        ) : (
          /* FORMULARIO DE REGISTRO DE PACIENTE */
          <form onSubmit={manejarEnvioRegistro} className="text-start">
            <div className="mb-2">
              <label className="form-label fw-bold text-dark small">Nombre Completo</label>
              <input
                type="text"
                className="form-control bg-light fs-6"
                placeholder="Ej. Juan Pérez"
                value={nombreReg}
                onChange={(e) => setNombreReg(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold text-dark small">RUT</label>
              <input
                type="text"
                className="form-control bg-light fs-6"
                placeholder="12.345.678-9"
                value={rutReg}
                onChange={(e) => setRutReg(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold text-dark small">Correo Electrónico</label>
              <input
                type="email"
                className="form-control bg-light fs-6"
                placeholder="ejemplo@correo.com"
                value={correoReg}
                onChange={(e) => setCorreoReg(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold text-dark small">Contraseña</label>
              <input
                type="password"
                className="form-control bg-light fs-6"
                placeholder="••••••••"
                value={claveReg}
                onChange={(e) => setClaveReg(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-dark small">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-control bg-light fs-6"
                placeholder="••••••••"
                value={confirmarClaveReg}
                onChange={(e) => setConfirmarClaveReg(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 fw-bold text-white rounded-3 mb-3"
              style={{ backgroundColor: "#10b981" }}
            >
              Crear Mi Cuenta
            </button>

            <div className="text-center">
              <span className="text-muted small">¿Ya tienes una cuenta? </span>
              <button
                type="button"
                className="btn btn-link p-0 small fw-bold text-decoration-none"
                style={{ color: "#6b21a8" }}
                onClick={() => setEsRegistro(false)}
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        )}

        {/* ENLACE VOLVER AL SITIO */}
        <div className="mt-4 pt-3 border-top">
          <Link to="/" className="text-decoration-none text-muted small">
            ← Volver al sitio principal
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
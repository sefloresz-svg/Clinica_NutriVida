import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si venía desde la vista /agendar u otra, guarda esa ruta; si no, por defecto va a Inicio ("/")
  const rutaDestino = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let sesion = null;

    // Validación de credenciales de prueba
    if (email === "admin@nutrivida.cl" && password === "1234") {
      sesion = { nombre: "Administrador", rol: "Admin" };
    } else if (email === "nutri@nutrivida.cl" && password === "1234") {
      sesion = { nombre: "Dra. Carolina Fuentes", rol: "Nutricionista" };
    } else if (email === "paciente@nutrivida.cl" && password === "1234") {
      sesion = { nombre: "Halam Dupre", rol: "Paciente" };
    } else if (email.trim() !== "" && password.trim() !== "") {
      // Permite ingresar con cualquier otro correo como Paciente
      sesion = { nombre: email.split("@")[0], rol: "Paciente" };
    } else {
      setError("Por favor ingresa un correo y contraseña válidos.");
      return;
    }

    // Guarda la sesión en sessionStorage
    sessionStorage.setItem("sesionNutriVida", JSON.stringify(sesion));

    // Redirección inteligente al destino (Inicio o Agendar)
    navigate(rutaDestino);
  };

  return (
    <div className="container my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-4">
          <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mb-2">
            ACCESO A NUTRICIÓN
          </span>
          <h3 className="fw-bold text-dark">Iniciar Sesión</h3>
          <p className="text-muted small">Ingresa tus credenciales para acceder a la plataforma.</p>
        </div>

        {error && <div className="alert alert-danger small py-2 fw-medium text-center">{error}</div>}

        <form onSubmit={manejarLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-dark">Correo Electrónico</label>
            <input
              type="email"
              className="form-control rounded-3 py-2"
              placeholder="ejemplo@nutrivida.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-dark">Contraseña</label>
            <input
              type="password"
              className="form-control rounded-3 py-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm mb-3">
            Ingresar a la Plataforma
          </button>
        </form>

        <div className="bg-light p-3 rounded-3 text-muted small border">
          <strong className="d-block text-dark mb-1">Cuentas de Prueba:</strong>
          <div>• Admin: <code>admin@nutrivida.cl</code> / <code>1234</code></div>
          <div>• Nutri: <code>nutri@nutrivida.cl</code> / <code>1234</code></div>
          <div>• Paciente: <code>paciente@nutrivida.cl</code> / <code>1234</code></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
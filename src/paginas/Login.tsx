import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const USUARIOS = [
  { correo: "admin@nutrivida.cl", clave: "1234", nombre: "Administrador", rol: "Admin" },
  { correo: "nutri@nutrivida.cl", clave: "1234", nombre: "Dra. Carolina Fuentes", rol: "Nutricionista" },
  { correo: "paciente@gmail.com", clave: "1234", nombre: "Juan Pérez", rol: "Paciente" }
];

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo.trim() || !clave.trim()) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
    }

    const usuarioEncontrado = USUARIOS.find(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.clave === clave.trim()
    );

    if (usuarioEncontrado) {
      sessionStorage.setItem("sesionNutriVida", JSON.stringify(usuarioEncontrado));
      alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);

      // Redirección inteligente: los profesionales van a Pacientes, el paciente a Agendar
      if (usuarioEncontrado.rol === "Nutricionista" || usuarioEncontrado.rol === "Admin") {
        navigate("/pacientes");
      } else {
        navigate("/agendar");
      }
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: "#f0edfd" }}>
      <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 text-center" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="fw-bold mb-1">
          Clínica <span style={{ color: "#6b21a8" }}>NutriVida</span>
        </h2>
        <p className="text-muted small mb-4">Ingresa a tu cuenta para gestionar tus citas</p>

        <form onSubmit={manejarEnvio} className="text-start">
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

          <button type="submit" className="btn w-100 py-2 fw-bold text-white rounded-3" style={{ backgroundColor: "#10b981" }}>
            Ingresar
          </button>
        </form>

        <div className="mt-4">
          <Link to="/" className="text-decoration-none text-muted small">
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
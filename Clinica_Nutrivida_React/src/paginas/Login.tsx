import { useLocation } from "react-router-dom";
import FormularioLogin from "../componentes/organismos/FormularioLogin";

// Página de Login: solo arma el fondo y usa el organismo FormularioLogin,
// que es el que se conecta con el back (login y registro)
function Login() {
  const location = useLocation();

  // Aviso que manda otra página al redirigir aquí (ej: "Debes iniciar sesión...")
  const mensaje = location.state?.mensaje;

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{ backgroundColor: "#f0edfd" }}
    >
      {/* Mismo ancho que la tarjeta del formulario, para que el aviso quede justo encima */}
      <div style={{ maxWidth: "420px", width: "100%" }}>
        {mensaje && <div className="alert alert-warning">{mensaje}</div>}
        <FormularioLogin />
      </div>
    </div>
  );
}

export default Login;

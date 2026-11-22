import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import { API, guardarSesion, leerError, type UsuarioSesion } from "../../utils/api";
import { validarRutChileno } from "../../utils/validarRut";

function FormularioLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirección inteligente: Si viene derivado de /agendar vuelve ahí; de lo contrario va a Inicio ("/")
  const rutaDestino = (location.state as { from?: string })?.from || "/";

  // Control para alternar entre "Iniciar Sesión" (false) y "Registrarse" (true)
  const [esRegistro, setEsRegistro] = useState(false);

  // Bloquea el botón mientras se espera la respuesta del back
  const [enviando, setEnviando] = useState(false);

  // Estados Formulario Login
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  // Estados Formulario Registro
  const [nombreReg, setNombreReg] = useState("");
  const [rutReg, setRutReg] = useState("");
  const [correoReg, setCorreoReg] = useState("");
  const [claveReg, setClaveReg] = useState("");
  const [confirmarClaveReg, setConfirmarClaveReg] = useState("");

  // Redirección según rol
  const redirigir = (usuario: UsuarioSesion) => {
    if (usuario.rol === "Nutricionista" || usuario.rol === "Admin") {
      navigate("/pacientes");
    } else {
      navigate(rutaDestino);
    }
  };

  // MANEJO DE INICIO DE SESIÓN (POST /api/usuarios/login)
  const manejarLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!correo.trim() || !clave.trim()) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim(), contrasena: clave.trim() }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "Correo o contraseña incorrectos."));
        return;
      }

      const usuario: UsuarioSesion = await respuesta.json();
      guardarSesion(usuario);
      alert(`¡Bienvenido/a ${usuario.nombre}!`);
      redirigir(usuario);
    } catch {
      alert("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setEnviando(false);
    }
  };

  // MANEJO DE REGISTRO DE PACIENTE (POST /api/usuarios/registro)
  const manejarRegistro = async (e: FormEvent) => {
    e.preventDefault();

    if (!nombreReg.trim() || !rutReg.trim() || !correoReg.trim() || !claveReg.trim()) {
      alert("Por favor, completa todos los campos del registro.");
      return;
    }

    if (!validarRutChileno(rutReg)) {
      alert(
        "El RUT debe ingresarse sin puntos y con guion (ejemplo: 12345678-5). Revisa también que el dígito verificador sea el correcto."
      );
      return;
    }

    if (claveReg.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (claveReg !== confirmarClaveReg) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API}/api/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreReg.trim(),
          rut: rutReg.trim(),
          correo: correoReg.trim(),
          contrasena: claveReg.trim(),
        }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo completar el registro."));
        return;
      }

      // Iniciar sesión automáticamente con el usuario que devuelve el back
      const usuario: UsuarioSesion = await respuesta.json();
      guardarSesion(usuario);
      alert(`¡Registro exitoso! Bienvenido/a a Clínica NutriVida, ${usuario.nombre}.`);
      navigate(rutaDestino);
    } catch {
      alert("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="card p-4 p-md-5 shadow-sm mx-auto border-0 rounded-4"
      style={{ maxWidth: "420px", width: "100%" }}
    >
      <h3 className="text-center mb-1 fw-bold">
        Clínica <span style={{ color: "#6b21a8" }}>NutriVida</span>
      </h3>
      <p className="text-center text-muted small mb-4">
        {esRegistro
          ? "Crea tu cuenta de paciente para gestionar tus citas"
          : "Ingresa a tu cuenta para gestionar tus citas"}
      </p>

      {/* FORMULARIO DE INICIO DE SESIÓN */}
      {!esRegistro ? (
        <form onSubmit={manejarLogin}>
          <CampoFormulario
            etiqueta="Correo Electrónico"
            tipo="email"
            nombre="correo"
            valor={correo}
            placeholder="ejemplo@correo.com"
            alCambiar={setCorreo}
          />

          <CampoFormulario
            etiqueta="Contraseña"
            tipo="password"
            nombre="clave"
            valor={clave}
            placeholder="••••••••"
            alCambiar={setClave}
          />

          <Boton
            texto={enviando ? "Enviando..." : "Ingresar"}
            tipo="submit"
            clase="btn btn-success w-100 mt-2 py-2 fw-bold"
            deshabilitado={enviando}
          />

          <div className="text-center mt-3">
            <span className="text-muted small">¿Aún no tienes cuenta? </span>
            <button
              type="button"
              className="btn btn-link p-0 small fw-bold text-success text-decoration-none"
              onClick={() => setEsRegistro(true)}
            >
              Regístrate aquí
            </button>
          </div>
        </form>
      ) : (
        /* FORMULARIO DE REGISTRO */
        <form onSubmit={manejarRegistro}>
          <CampoFormulario
            etiqueta="Nombre Completo"
            tipo="text"
            nombre="nombreReg"
            valor={nombreReg}
            placeholder="Ej. Juan Pérez"
            alCambiar={setNombreReg}
          />

          <CampoFormulario
            etiqueta="RUT (sin puntos y con guion)"
            tipo="text"
            nombre="rutReg"
            valor={rutReg}
            placeholder="12345678-5"
            alCambiar={setRutReg}
          />

          <CampoFormulario
            etiqueta="Correo Electrónico"
            tipo="email"
            nombre="correoReg"
            valor={correoReg}
            placeholder="ejemplo@correo.com"
            alCambiar={setCorreoReg}
          />

          <CampoFormulario
            etiqueta="Contraseña (mínimo 8 caracteres)"
            tipo="password"
            nombre="claveReg"
            valor={claveReg}
            placeholder="••••••••"
            alCambiar={setClaveReg}
          />

          <CampoFormulario
            etiqueta="Confirmar Contraseña"
            tipo="password"
            nombre="confirmarClaveReg"
            valor={confirmarClaveReg}
            placeholder="••••••••"
            alCambiar={setConfirmarClaveReg}
          />

          <Boton
            texto={enviando ? "Enviando..." : "Crear Mi Cuenta"}
            tipo="submit"
            clase="btn btn-success w-100 mt-2 py-2 fw-bold"
            deshabilitado={enviando}
          />

          <div className="text-center mt-3">
            <span className="text-muted small">¿Ya tienes una cuenta? </span>
            <button
              type="button"
              className="btn btn-link p-0 small fw-bold text-success text-decoration-none"
              onClick={() => setEsRegistro(false)}
            >
              Inicia sesión aquí
            </button>
          </div>
        </form>
      )}

      {/* ENLACE VOLVER */}
      <div className="text-center mt-4 pt-3 border-top">
        <Link to="/" className="text-decoration-none text-muted small">
          ← Volver al sitio principal
        </Link>
      </div>
    </div>
  );
}

export default FormularioLogin;

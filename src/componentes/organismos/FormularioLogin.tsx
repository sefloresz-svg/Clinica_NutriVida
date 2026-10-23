import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";

interface Usuario {
  correo: string;
  clave: string;
  nombre: string;
  rut?: string;
  rol: "Admin" | "Nutricionista" | "Paciente";
}

// Lista base de prueba
const USUARIOS_BASE: Usuario[] = [
  {
    correo: "admin@nutrivida.cl",
    clave: "1234",
    nombre: "Administrador",
    rol: "Admin",
  },
  {
    correo: "nutri@nutrivida.cl",
    clave: "1234",
    nombre: "Dra. Carolina Fuentes",
    rol: "Nutricionista",
  },
  {
    correo: "paciente@gmail.com",
    clave: "1234",
    nombre: "Juan Pérez",
    rol: "Paciente",
  },
];

function FormularioLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirección inteligente: Si viene derivado de /agendar vuelve ahí; de lo contrario va a Inicio ("/")
  const rutaDestino = (location.state as { from?: string })?.from || "/";

  // Control para alternar entre "Iniciar Sesión" (false) y "Registrarse" (true)
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

  // Obtiene usuarios estáticos + usuarios guardados en la sesión activa
  const obtenerUsuarios = (): Usuario[] => {
    const almacenados = sessionStorage.getItem("usuariosRegistradosNutriVida");
    if (almacenados) {
      try {
        return [...USUARIOS_BASE, ...JSON.parse(almacenados)];
      } catch (e) {
        return USUARIOS_BASE;
      }
    }
    return USUARIOS_BASE;
  };

  // MANEJO DE INICIO DE SESIÓN
  const manejarLogin = (e: FormEvent) => {
    e.preventDefault();

    if (!correo.trim() || !clave.trim()) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
    }

    const todos = obtenerUsuarios();
    const usuarioEncontrado = todos.find(
      (u) =>
        u.correo.toLowerCase() === correo.trim().toLowerCase() &&
        u.clave === clave.trim()
    );

    if (usuarioEncontrado) {
      sessionStorage.setItem("sesionNutriVida", JSON.stringify(usuarioEncontrado));
      alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);

      // Redirección según rol
      if (usuarioEncontrado.rol === "Nutricionista" || usuarioEncontrado.rol === "Admin") {
        navigate("/pacientes");
      } else {
        navigate(rutaDestino);
      }
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  };

  // MANEJO DE REGISTRO DE PACIENTE
  const manejarRegistro = (e: FormEvent) => {
    e.preventDefault();

    if (!nombreReg.trim() || !rutReg.trim() || !correoReg.trim() || !claveReg.trim()) {
      alert("Por favor, completa todos los campos del registro.");
      return;
    }

    if (claveReg !== confirmarClaveReg) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const todos = obtenerUsuarios();
    const existe = todos.some(
      (u) => u.correo.toLowerCase() === correoReg.trim().toLowerCase()
    );

    if (existe) {
      alert("El correo electrónico ya se encuentra registrado.");
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre: nombreReg.trim(),
      rut: rutReg.trim(),
      correo: correoReg.trim(),
      clave: claveReg.trim(),
      rol: "Paciente",
    };

    // Guardar en sessionStorage para mantener la persistencia dentro de la sesión
    const previos = JSON.parse(
      sessionStorage.getItem("usuariosRegistradosNutriVida") || "[]"
    );
    sessionStorage.setItem(
      "usuariosRegistradosNutriVida",
      JSON.stringify([...previos, nuevoUsuario])
    );

    // Iniciar sesión automáticamente
    sessionStorage.setItem("sesionNutriVida", JSON.stringify(nuevoUsuario));
    alert(`¡Registro exitoso! Bienvenido/a a Clínica NutriVida, ${nuevoUsuario.nombre}.`);
    navigate(rutaDestino);
  };

  return (
    <div
      className="card p-4 p-md-5 shadow-sm mx-auto border-0 rounded-4"
      style={{ maxWidth: "420px", width: "100%" }}
    >
      <h3 className="text-center mb-1 fw-bold text-success">
        Clínica NutriVida
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
            texto="Ingresar"
            tipo="submit"
            clase="btn btn-success w-100 mt-2 py-2 fw-bold"
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
            etiqueta="RUT"
            tipo="text"
            nombre="rutReg"
            valor={rutReg}
            placeholder="12.345.678-9"
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
            etiqueta="Contraseña"
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
            texto="Crear Mi Cuenta"
            tipo="submit"
            clase="btn btn-success w-100 mt-2 py-2 fw-bold"
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
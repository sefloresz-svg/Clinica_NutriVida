import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";

// Tipo para tipar los usuarios de prueba
interface Usuario {
   correo: string;
   clave: string;
   nombre: string;
   rol: "Admin" | "Nutricionista" | "Paciente";
}

// Lista estática de prueba
const USUARIOS: Usuario[] = [
   {
      correo: "admin@nutrivida.cl",
      clave: "1234",
      nombre: "Administrador",
      rol: "Admin",
   },
   {
      correo: "nutri@nutrivida.cl",
      clave: "1234",
      nombre: "Dra.Carolina",
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
   const [correo, setCorreo] = useState("");
   const [clave, setClave] = useState("");
   const navigate = useNavigate();

   const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const correoLimpio = correo.trim().toLowerCase();
      const claveLimpia = clave.trim();

      if (!correoLimpio || !claveLimpia) {
      alert("Por favor, ingrese su correo y contraseña.");
      return;
      }

      const usuarioEncontrado = USUARIOS.find(
      (u) => u.correo.toLowerCase() === correoLimpio && u.clave === claveLimpia
      );

      if (usuarioEncontrado) {
      sessionStorage.setItem("sesionNutriVida", JSON.stringify(usuarioEncontrado));
      alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);
      navigate("/agendar");
      } else {
      alert("Correo o contraseña incorrectos.");
      }
   };

   return (
      <form
         onSubmit={manejarEnvio}
         className="card p-4 shadow-sm mx-auto"
         style={{ maxWidth: "400px" }}
      >
         <h3 className="text-center mb-4 text-success">Iniciar Sesión</h3>

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
            clase="btn btn-success w-100 mt-2"
         />
      </form>
   );
}

export default FormularioLogin;
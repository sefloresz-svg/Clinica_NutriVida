// Todas las peticiones van al API Gateway (nunca directo a un microservicio)
export const API = "http://localhost:8080";

// Clave donde se guarda el usuario que devuelve el login
const CLAVE_SESION = "sesionNutriVida";

// Lo que responde el back en el login (GET/POST /api/usuarios/...). Nunca trae la contraseña
export interface UsuarioSesion {
  id: number;
  nombre: string;
  rut: string | null;
  correo: string;
  rol: "Admin" | "Nutricionista" | "Paciente";
  activo: boolean;
}

// Lee el usuario guardado al hacer login (o null si no hay sesión)
export const obtenerSesion = (): UsuarioSesion | null => {
  const guardada = localStorage.getItem(CLAVE_SESION);
  if (!guardada) return null;
  try {
    return JSON.parse(guardada);
  } catch {
    return null;
  }
};

export const guardarSesion = (usuario: UsuarioSesion) => {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
};

export const borrarSesion = () => {
  localStorage.removeItem(CLAVE_SESION);
};

// Lee el mensaje de error que manda el back ({"message": "..."}); si no viene, usa uno por defecto
export const leerError = async (respuesta: Response, porDefecto: string): Promise<string> => {
  try {
    const datos = await respuesta.json();
    return datos.message || porDefecto;
  } catch {
    return porDefecto;
  }
};

// 35000 -> "$35.000"
export const formatearPrecio = (precio: number): string => {
  return "$" + precio.toLocaleString("es-CL");
};

// "08:00:00" -> "08:00 hrs"
export const formatearHora = (hora: string): string => {
  return hora.slice(0, 5) + " hrs";
};

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// "2026-10-18" -> "18 de Octubre, 2026"
export const formatearFecha = (fecha: string): string => {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia} de ${MESES[Number(mes) - 1]}, ${anio}`;
};

// true si la fecha y hora de la cita ya pasaron (misma regla que valida el back)
export const citaYaPaso = (fecha: string, hora: string): boolean => {
  return new Date(`${fecha}T${hora.slice(0, 5)}:00`) < new Date();
};

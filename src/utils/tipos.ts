// Interfaces de lo que responde el back. Están aquí porque las usan
// varias páginas y componentes a la vez (así no se repiten).

// GET /api/servicios
export interface Servicio {
  id: number;
  codigo: string;
  titulo: string;
  tipo: string;
  duracion: string;
  modalidad: string;
  precio: number;
  activo: boolean;
}

// GET /api/nutricionistas (el nombre viene resuelto desde el usuario)
export interface Nutricionista {
  id: number;
  idUsuario: number;
  nombre: string;
  correo: string;
  especialidad: string;
  fotoUrl: string | null;
  activo: boolean;
}

// GET /api/novedades
export interface Novedad {
  id: number;
  titulo: string;
  categoria: string;
  resumen: string;
  contenido: string;
  fechaPublicacion: string; // "2026-10-18"
  imagenUrl: string | null;
}

// GET /api/sucursales
export interface Sucursal {
  id: number;
  nombre: string;
  sector: string;
  direccion: string;
  telefono: string;
  horario: string;
  correo: string;
  mapaUrl: string | null;
}

// GET /api/citas (con los nombres ya resueltos por el back)
export interface Cita {
  id: number;
  idPaciente: number;
  nombrePaciente: string;
  rutPaciente: string;
  idNutricionista: number;
  nombreNutricionista: string;
  idServicio: number;
  nombreServicio: string;
  fecha: string;
  hora: string;
  motivo: string | null;
  precio: number;
  estado: string;
}

// Formularios de los modales del Admin (todo es texto mientras se escribe)
export interface FormularioServicio {
  codigo: string;
  titulo: string;
  tipo: string;
  duracion: string;
  modalidad: string;
  precio: string;
}

export interface FormularioNutricionista {
  jornada: string;
  nombre: string;
  correo: string;
  contrasena: string;
  especialidad: string;
  fotoUrl: string;
}

export interface FormularioNovedad {
  titulo: string;
  categoria: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
}

export interface FormularioSucursal {
  nombre: string;
  sector: string;
  direccion: string;
  telefono: string;
  correo: string;
  horario: string;
  mapaUrl: string;
}

export interface FormularioUsuario {
  nombre: string;
  rut: string;
  correo: string;
  contrasena: string;
  rol: string;
}

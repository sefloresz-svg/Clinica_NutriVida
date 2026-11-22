import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API, obtenerSesion, leerError, formatearPrecio, type UsuarioSesion } from "../utils/api";
import type { FormularioUsuario } from "../utils/tipos";
import CardKpi from "../componentes/moleculas/CardKpi";
import TablaUsuarios from "../componentes/organismos/TablaUsuarios";
import ModalUsuario from "../componentes/organismos/ModalUsuario";

// 1. Importar la hoja de estilos de la carpeta creada
import "../estilos/admin.css";

// Lo que responde GET /api/citas/resumen
interface ResumenCitas {
  citasHoy: number;
  citasPendientes: number;
  ingresosMes: number;
}

// Lo que responde GET /api/usuarios/resumen
interface ResumenUsuarios {
  pacientesActivos: number;
  nutricionistasActivos: number;
}

const FORMULARIO_VACIO: FormularioUsuario = {
  nombre: "",
  rut: "",
  correo: "",
  contrasena: "",
  rol: "Paciente",
};

// Página contenedora: aquí están los fetch y los estados; KPIs, tabla y modal solo muestran
function Administrador() {
  const navigate = useNavigate();
  const location = useLocation();
  const sesion = obtenerSesion();
  const idSesion = sesion?.id;

  // La lista de usuarios viene del back (UsuarioSesion = id, nombre, rut, correo, rol, activo)
  const [usuarios, setUsuarios] = useState<UsuarioSesion[]>([]);
  const [resumenCitas, setResumenCitas] = useState<ResumenCitas | null>(null);
  const [resumenUsuarios, setResumenUsuarios] = useState<ResumenUsuarios | null>(null);

  // Modal "+ Crear Usuario"
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);

  const cargarUsuarios = () => {
    fetch(`${API}/api/usuarios?idAdmin=${idSesion}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar usuarios");
        return respuesta.json();
      })
      .then((datos) => setUsuarios(datos))
      .catch(() => alert("No se pudieron cargar los usuarios."));
  };

  // KPIs calculados en el back (se manda idAdmin porque el back valida que sea Admin)
  const cargarResumen = () => {
    fetch(`${API}/api/citas/resumen?idAdmin=${idSesion}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar resumen de citas");
        return respuesta.json();
      })
      .then((datos) => setResumenCitas(datos))
      .catch(() => alert("No se pudo cargar el resumen de citas."));

    fetch(`${API}/api/usuarios/resumen?idAdmin=${idSesion}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar resumen de usuarios");
        return respuesta.json();
      })
      .then((datos) => setResumenUsuarios(datos))
      .catch(() => alert("No se pudo cargar el resumen de usuarios."));
  };

  // Los avisos van en el state (no con alert) para que no salgan dos veces con StrictMode
  useEffect(() => {
    if (!idSesion) {
      navigate("/login", {
        state: { from: location.pathname, mensaje: "Debes iniciar sesión para acceder al panel administrativo." },
      });
      return;
    }
    if (sesion?.rol !== "Admin") {
      navigate("/", {
        state: { mensaje: "Acceso denegado. Este apartado es exclusivo para Administradores." },
      });
      return;
    }
    cargarUsuarios();
    cargarResumen();
  }, [idSesion]);

  if (!sesion || sesion.rol !== "Admin") return null;

  // PUT /api/usuarios/{id}/rol
  const manejarCambioRol = async (id: number, nuevoRol: string) => {
    try {
      const respuesta = await fetch(`${API}/api/usuarios/${id}/rol?idAdmin=${sesion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo cambiar el rol."));
        return;
      }
      cargarUsuarios();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  // PUT /api/usuarios/{id}/estado (activar / desactivar = soft delete)
  const alternarEstado = async (u: UsuarioSesion) => {
    const accion = u.activo ? "desactivar" : "activar";
    if (!confirm(`¿Deseas ${accion} la cuenta de ${u.nombre}?`)) return;

    try {
      const respuesta = await fetch(`${API}/api/usuarios/${u.id}/estado?idAdmin=${sesion.id}`, {
        method: "PUT",
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo cambiar el estado."));
        return;
      }
      cargarUsuarios();
      cargarResumen();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  const cambiarCampo = (campo: string, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  // POST /api/usuarios (el Admin elige entre Paciente y Admin)
  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.nombre.trim() || !formulario.correo.trim() || !formulario.contrasena.trim()) {
      alert("Por favor, completa el nombre, el correo y la contraseña.");
      return;
    }
    if (formulario.contrasena.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API}/api/usuarios?idAdmin=${sesion.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formulario.nombre.trim(),
          rut: formulario.rut.trim(),
          correo: formulario.correo.trim(),
          contrasena: formulario.contrasena.trim(),
          rol: formulario.rol,
        }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo crear el usuario."));
        return;
      }

      alert("Usuario creado correctamente.");
      setMostrarModal(false);
      setFormulario(FORMULARIO_VACIO);
      cargarUsuarios();
      cargarResumen();
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="container my-2">

        {/* Banner Principal Claro/Elegante */}
        <div className="admin-header-banner mb-4">
          <h1 className="fw-bold mb-2 display-6">Panel de Administración</h1>
          <p className="mb-0 fs-6 opacity-90">
            Resumen operativo de la clínica, reportes y gestión integral de usuarios.
          </p>
        </div>

        {/* Tarjetas de Métricas (KPIs), calculadas en el back */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <CardKpi
              titulo="Citas hoy"
              valor={resumenCitas ? resumenCitas.citasHoy : "-"}
              detalle="Agendadas para hoy (sin canceladas)"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <CardKpi
              titulo="Pacientes activos"
              valor={resumenUsuarios ? resumenUsuarios.pacientesActivos : "-"}
              detalle={`${resumenUsuarios ? resumenUsuarios.nutricionistasActivos : "-"} nutricionistas activos`}
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <CardKpi
              titulo="Ingresos mes"
              valor={resumenCitas ? formatearPrecio(resumenCitas.ingresosMes) : "-"}
              detalle="Citas del mes no canceladas"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <CardKpi
              titulo="Citas pendientes"
              valor={resumenCitas ? resumenCitas.citasPendientes : "-"}
              detalle="Pendientes por confirmar"
              claseDetalle="text-warning fw-bold small"
            />
          </div>
        </div>

        {/* Gestión de Usuarios y Roles */}
        <div className="admin-table-card">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">Gestión de Usuarios y Roles</h4>
              <p className="text-muted small mb-0">
                Crear, editar roles y activar/desactivar acceso a usuarios.
              </p>
            </div>
            <button
              className="btn btn-admin-primary px-3 py-2 text-nowrap"
              onClick={() => setMostrarModal(true)}
            >
              + Crear Usuario
            </button>
          </div>

          {/* Tabla de Usuarios */}
          <TablaUsuarios
            usuarios={usuarios}
            idSesion={sesion.id}
            alCambiarRol={manejarCambioRol}
            alAlternarEstado={alternarEstado}
          />
        </div>

      </div>

      {/* MODAL CREAR USUARIO */}
      {mostrarModal && (
        <ModalUsuario
          formulario={formulario}
          enviando={enviando}
          alCambiar={cambiarCampo}
          alGuardar={crearUsuario}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default Administrador;

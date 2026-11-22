import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, obtenerSesion, leerError } from "../utils/api";
import type { Servicio, FormularioServicio } from "../utils/tipos";
import CardServicio from "../componentes/moleculas/CardServicio";
import ModalServicio from "../componentes/organismos/ModalServicio";

// Datos del formulario del Admin (el precio se escribe como texto y se convierte a número)
const FORMULARIO_VACIO: FormularioServicio = {
  codigo: "",
  titulo: "",
  tipo: "Consulta",
  duracion: "",
  modalidad: "Presencial",
  precio: "",
};

// Página contenedora: aquí están los fetch y los estados; las tarjetas y el modal solo muestran
function Servicios() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const rol = (sesion?.rol || "").toLowerCase();

  const esAdmin = rol === "admin";
  const esNutri = rol === "nutricionista";

  const [servicios, setServicios] = useState<Servicio[]>([]);

  // Modal de crear / editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);

  // GET al abrir la página
  const cargarServicios = () => {
    fetch(`${API}/api/servicios`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar servicios");
        return respuesta.json();
      })
      .then((datos) => setServicios(datos))
      .catch(() => alert("No se pudieron cargar los servicios."));
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // Redirección pasando el servicio preseleccionado (por id)
  const reservarServicio = (idServicio: number) => {
    navigate("/agendar", { state: { servicioPreseleccionado: idServicio } });
  };

  // Funciones de gestión para el Administrador
  const manejarAgregar = () => {
    setIdEditando(null);
    setFormulario(FORMULARIO_VACIO);
    setMostrarModal(true);
  };

  const manejarEditar = (s: Servicio) => {
    setIdEditando(s.id);
    setFormulario({
      codigo: s.codigo,
      titulo: s.titulo,
      tipo: s.tipo,
      duracion: s.duracion,
      modalidad: s.modalidad,
      precio: String(s.precio),
    });
    setMostrarModal(true);
  };

  const cambiarCampo = (campo: string, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  // POST (crear) o PUT (editar)
  const guardarServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.codigo.trim() || !formulario.titulo.trim() || !formulario.duracion.trim()) {
      alert("Por favor, completa todos los campos del servicio.");
      return;
    }
    const precio = Number(formulario.precio);
    if (!Number.isInteger(precio) || precio < 1) {
      alert("El precio debe ser un número entero mayor a 0 (sin puntos).");
      return;
    }

    setEnviando(true);
    try {
      const url = idEditando
        ? `${API}/api/servicios/${idEditando}?idAdmin=${sesion?.id}`
        : `${API}/api/servicios?idAdmin=${sesion?.id}`;

      const respuesta = await fetch(url, {
        method: idEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: formulario.codigo.trim(),
          titulo: formulario.titulo.trim(),
          tipo: formulario.tipo.trim(),
          duracion: formulario.duracion.trim(),
          modalidad: formulario.modalidad.trim(),
          precio: precio,
        }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo guardar el servicio."));
        return;
      }

      alert(idEditando ? "Servicio actualizado correctamente." : "Servicio agregado correctamente.");
      setMostrarModal(false);
      cargarServicios();
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  // DELETE (soft delete en el back)
  const manejarEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este servicio del catálogo?")) return;

    try {
      const respuesta = await fetch(`${API}/api/servicios/${id}?idAdmin=${sesion?.id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo eliminar el servicio."));
        return;
      }
      cargarServicios();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="container my-4">
      {/* Cabecera Adaptativa */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Nuestros Planes y Consultas</h2>
          <p className="text-muted small mb-0">
            Catálogo oficial de prestaciones clínicas y programas nutricionales.
          </p>
        </div>

        {/* Botón exclusivo de administración */}
        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm text-nowrap"
            onClick={manejarAgregar}
          >
            + Agregar Servicio
          </button>
        )}
      </div>

      {/* Grilla de Servicios */}
      <div className="row g-4">
        {servicios.map((s) => (
          <div key={s.id} className="col-12 col-md-6 col-lg-4">
            <CardServicio
              servicio={s}
              esAdmin={esAdmin}
              esNutri={esNutri}
              alEditar={manejarEditar}
              alEliminar={manejarEliminar}
              alReservar={reservarServicio}
            />
          </div>
        ))}
      </div>

      {/* MODAL CREAR / EDITAR SERVICIO (solo Admin) */}
      {mostrarModal && (
        <ModalServicio
          formulario={formulario}
          editando={idEditando !== null}
          enviando={enviando}
          alCambiar={cambiarCampo}
          alGuardar={guardarServicio}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default Servicios;

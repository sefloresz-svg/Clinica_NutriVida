import { useState, useEffect } from "react";
import { API, obtenerSesion, leerError } from "../utils/api";
import type { Novedad, FormularioNovedad } from "../utils/tipos";
import CardNovedad from "../componentes/moleculas/CardNovedad";
import ModalNovedad from "../componentes/organismos/ModalNovedad";
import ModalLeerNovedad from "../componentes/organismos/ModalLeerNovedad";

const FORMULARIO_VACIO: FormularioNovedad = {
  titulo: "",
  categoria: "Consejo Nutricional",
  resumen: "",
  contenido: "",
  imagenUrl: "",
};

// Página contenedora: aquí están los fetch y los estados; las tarjetas y los modales solo muestran
function Novedades() {
  const sesion = obtenerSesion();
  const esAdmin = sesion?.rol === "Admin";

  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Novedad | null>(null);

  // Modal de crear / editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);

  const cargarNovedades = () => {
    fetch(`${API}/api/novedades`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar novedades");
        return respuesta.json();
      })
      .then((datos) => setNovedades(datos))
      .catch(() => alert("No se pudieron cargar las novedades."));
  };

  useEffect(() => {
    cargarNovedades();
  }, []);

  // Funciones de gestión para el Administrador
  const manejarPublicar = () => {
    setIdEditando(null);
    setFormulario(FORMULARIO_VACIO);
    setMostrarModal(true);
  };

  const manejarEditar = (art: Novedad) => {
    setIdEditando(art.id);
    setFormulario({
      titulo: art.titulo,
      categoria: art.categoria,
      resumen: art.resumen,
      contenido: art.contenido,
      imagenUrl: art.imagenUrl || "",
    });
    setMostrarModal(true);
  };

  const cambiarCampo = (campo: string, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const guardarNovedad = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.titulo.trim() || !formulario.categoria.trim() ||
        !formulario.resumen.trim() || !formulario.contenido.trim()) {
      alert("Por favor, completa el título, la categoría, el resumen y el contenido.");
      return;
    }

    setEnviando(true);
    try {
      const url = idEditando
        ? `${API}/api/novedades/${idEditando}?idAdmin=${sesion?.id}`
        : `${API}/api/novedades?idAdmin=${sesion?.id}`;

      const respuesta = await fetch(url, {
        method: idEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formulario.titulo.trim(),
          categoria: formulario.categoria.trim(),
          resumen: formulario.resumen.trim(),
          contenido: formulario.contenido.trim(),
          imagenUrl: formulario.imagenUrl.trim(),
        }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo guardar la novedad."));
        return;
      }

      alert(idEditando ? "Artículo actualizado correctamente." : "Novedad publicada correctamente.");
      setMostrarModal(false);
      cargarNovedades();
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  const manejarEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este artículo?")) return;

    try {
      const respuesta = await fetch(`${API}/api/novedades/${id}?idAdmin=${sesion?.id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo eliminar el artículo."));
        return;
      }
      cargarNovedades();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="container my-4">
      {/* Cabecera Adaptativa */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Novedades y Consejos</h2>
          <p className="text-muted small mb-0">
            Artículos, recomendaciones clínicas y noticias de interés sobre salud y nutrición.
          </p>
        </div>

        {/* Solo visible para el Administrador */}
        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm text-nowrap"
            onClick={manejarPublicar}
          >
            + Publicar Novedad
          </button>
        )}
      </div>

      {/* Grilla de Artículos */}
      <div className="row g-4">
        {novedades.map((art) => (
          <div key={art.id} className="col-12 col-md-6 col-lg-4">
            <CardNovedad
              novedad={art}
              esAdmin={esAdmin}
              alEditar={manejarEditar}
              alEliminar={manejarEliminar}
              alLeer={setArticuloSeleccionado}
            />
          </div>
        ))}
      </div>

      {/* MODAL EMERGENTE PARA PACIENTES / NUTRICIONISTAS */}
      {articuloSeleccionado && (
        <ModalLeerNovedad
          novedad={articuloSeleccionado}
          alCerrar={() => setArticuloSeleccionado(null)}
        />
      )}

      {/* MODAL PUBLICAR / EDITAR (solo Admin) */}
      {mostrarModal && (
        <ModalNovedad
          formulario={formulario}
          editando={idEditando !== null}
          enviando={enviando}
          alCambiar={cambiarCampo}
          alGuardar={guardarNovedad}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default Novedades;

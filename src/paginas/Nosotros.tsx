import { useState, useEffect } from "react";
import { API, obtenerSesion, leerError } from "../utils/api";
import type { Sucursal, FormularioSucursal } from "../utils/tipos";
import CardSucursal from "../componentes/moleculas/CardSucursal";
import ModalSucursal from "../componentes/organismos/ModalSucursal";

const FORMULARIO_VACIO: FormularioSucursal = {
  nombre: "",
  sector: "",
  direccion: "",
  telefono: "",
  correo: "",
  horario: "",
  mapaUrl: "",
};

// Página contenedora: aquí están los fetch y los estados; la tarjeta y el modal solo muestran
function Nosotros() {
  const sesion = obtenerSesion();
  const esAdmin = sesion?.rol === "Admin";

  // Lista de sucursales en Temuco (viene del microservicio contenido)
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);

  // Modal de crear / editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);

  const cargarSucursales = () => {
    fetch(`${API}/api/sucursales`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar sucursales");
        return respuesta.json();
      })
      .then((datos: Sucursal[]) => {
        setSucursales(datos);
        setSucursalActiva(datos.length > 0 ? datos[0] : null);
      })
      .catch(() => alert("No se pudieron cargar las sucursales."));
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  // Funciones de gestión para el Administrador
  const manejarAgregarSucursal = () => {
    setIdEditando(null);
    setFormulario(FORMULARIO_VACIO);
    setMostrarModal(true);
  };

  const manejarEditarSucursal = (suc: Sucursal) => {
    setIdEditando(suc.id);
    setFormulario({
      nombre: suc.nombre,
      sector: suc.sector,
      direccion: suc.direccion,
      telefono: suc.telefono,
      correo: suc.correo,
      horario: suc.horario,
      mapaUrl: suc.mapaUrl || "",
    });
    setMostrarModal(true);
  };

  const cambiarCampo = (campo: string, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const guardarSucursal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.nombre.trim() || !formulario.sector.trim() || !formulario.direccion.trim() ||
        !formulario.telefono.trim() || !formulario.correo.trim() || !formulario.horario.trim()) {
      alert("Por favor, completa todos los datos de la sucursal (el mapa es opcional).");
      return;
    }

    setEnviando(true);
    try {
      const url = idEditando
        ? `${API}/api/sucursales/${idEditando}?idAdmin=${sesion?.id}`
        : `${API}/api/sucursales?idAdmin=${sesion?.id}`;

      const respuesta = await fetch(url, {
        method: idEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formulario.nombre.trim(),
          sector: formulario.sector.trim(),
          direccion: formulario.direccion.trim(),
          telefono: formulario.telefono.trim(),
          correo: formulario.correo.trim(),
          horario: formulario.horario.trim(),
          mapaUrl: formulario.mapaUrl.trim(),
        }),
      });

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo guardar la sucursal."));
        return;
      }

      alert(idEditando ? "Sucursal actualizada correctamente." : "Sucursal agregada correctamente.");
      setMostrarModal(false);
      cargarSucursales();
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  const manejarEliminarSucursal = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta sucursal del registro?")) return;

    try {
      const respuesta = await fetch(`${API}/api/sucursales/${id}?idAdmin=${sesion?.id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo eliminar la sucursal."));
        return;
      }
      cargarSucursales();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="container my-5">
      {/* Encabezado Principal + Botón Admin */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div className="text-center text-md-start">
          <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mb-2">
            NUESTRA INSTITUCIÓN
          </span>
          <h1 className="display-5 fw-bold text-dark mb-1">Sobre Clínica NutriVida</h1>
          <p className="text-muted fs-6 mb-0">
            Centro de salud, nutrición clínica y rendimiento deportivo con múltiple presencia en Temuco.
          </p>
        </div>

        {/* Botón Exclusivo de Administración */}
        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm text-nowrap"
            onClick={manejarAgregarSucursal}
          >
            + Agregar Sucursal
          </button>
        )}
      </div>

      {/* FILA SUPERIOR: Historia (Izquierda) vs Selector + Mapa (Derecha) */}
      <div className="row align-items-start g-5 mb-4">
        {/* Lado Izquierdo: Descripción e Historia */}
        <div className="col-12 col-lg-6">
          <h3 className="fw-bold text-dark mb-3">Nuestra Historia en Temuco</h3>
          <p className="text-secondary leading-relaxed">
            Fundada en <strong>2018</strong> en la ciudad de Temuco, <strong>Clínica NutriVida</strong> nació con el objetivo de brindar atención nutricional integral, científica y humana a toda la comunidad de la Araucanía.
          </p>
          <p className="text-secondary leading-relaxed">
            Para facilitar el acceso de nuestros pacientes, contamos con centros de atención estratégicamente repartidos por los principales sectores de Temuco, equipados con la misma tecnología de medición antropométrica.
          </p>
          <div className="d-flex gap-4 mt-4">
            <div className="border-start border-4 border-success ps-3">
              <h4 className="fw-bold text-dark mb-0">{sucursales.length}</h4>
              <small className="text-muted">Centros en Temuco</small>
            </div>
            <div className="border-start border-4 border-primary ps-3">
              <h4 className="fw-bold text-dark mb-0">+10.000</h4>
              <small className="text-muted">Pacientes Locales</small>
            </div>
            <div className="border-start border-4 border-warning ps-3">
              <h4 className="fw-bold text-dark mb-0">100%</h4>
              <small className="text-muted">Certificados ISAK</small>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Puntos de Atención + Mapa */}
        <div className="col-12 col-lg-6">
          <div className="mb-3">
            <h5 className="fw-bold text-dark mb-2">📍 Puntos de Atención en Temuco</h5>
            <p className="text-muted small mb-2">
              Haz clic en cada sucursal para actualizar el mapa interactivo:
            </p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {sucursales.map((suc) => (
                <button
                  key={suc.id}
                  onClick={() => setSucursalActiva(suc)}
                  className={`btn btn-sm fw-semibold px-2 py-1.5 rounded-2 ${
                    sucursalActiva?.id === suc.id
                      ? "btn-success shadow-sm"
                      : "btn-outline-secondary bg-white"
                  }`}
                >
                  🏥 {suc.nombre.replace("Sucursal ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Visor de Google Maps */}
          {sucursalActiva && (
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden"
            style={{ height: "290px" }}
          >
            <iframe
              key={sucursalActiva.id}
              title={`Mapa ${sucursalActiva.nombre}`}
              src={sucursalActiva.mapaUrl || undefined}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          )}
        </div>
      </div>

      {/* TARJETA DE DETALLES + CONTROLES DE ADMINISTRACIÓN */}
      {sucursalActiva && (
      <div className="mb-5">
        <CardSucursal
          sucursal={sucursalActiva}
          esAdmin={esAdmin}
          alEditar={manejarEditarSucursal}
          alEliminar={manejarEliminarSucursal}
        />
      </div>
      )}

      {/* Reconocimientos y Calidad */}
      <div className="bg-light p-4 p-md-5 rounded-4 mb-5 border-0 shadow-sm">
        <h3 className="fw-bold text-dark text-center mb-4">
          🏆 Reconocimientos y Calidad Acreditada
        </h3>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">🥇</div>
              <h5 className="fw-bold text-dark">Premio Salud Regional 2023</h5>
              <p className="text-muted small mb-0">
                Reconocimiento a nuestro programa de prevención metabólica en la Región de La Araucanía.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">🛡️</div>
              <h5 className="fw-bold text-dark">Acreditación Sanitaria</h5>
              <p className="text-muted small mb-0">
                Todos nuestros locales en Temuco cuentan con registro en la Superintendencia de Salud.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">⭐</div>
              <h5 className="fw-bold text-dark">Certificación Cineantropométrica</h5>
              <p className="text-muted small mb-0">
                Equipamiento de nivel internacional para la evaluación de la composición corporal.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL CREAR / EDITAR SUCURSAL (solo Admin) */}
      {mostrarModal && (
        <ModalSucursal
          formulario={formulario}
          editando={idEditando !== null}
          enviando={enviando}
          alCambiar={cambiarCampo}
          alGuardar={guardarSucursal}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default Nosotros;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, obtenerSesion, leerError } from "../utils/api";
import type { Nutricionista, FormularioNutricionista } from "../utils/tipos";
import CardNutricionista from "../componentes/moleculas/CardNutricionista";
import ModalNutricionista from "../componentes/organismos/ModalNutricionista";

// Bloques de 30 minutos que se crean para un nutricionista nuevo, segun su jornada
const JORNADAS: Record<string, string[]> = {
  Manana: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
  Tarde: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"],
};

const FORMULARIO_VACIO: FormularioNutricionista = {
  jornada: "Manana",
  nombre: "",
  correo: "",
  contrasena: "",
  especialidad: "",
  fotoUrl: "",
};

// Página contenedora: aquí están los fetch y los estados; las tarjetas y el modal solo muestran
function Nutricionistas() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const rol = (sesion?.rol || "").toLowerCase();

  const esAdmin = rol === "admin";
  const esNutri = rol === "nutricionista";

  const [equipo, setEquipo] = useState<Nutricionista[]>([]);

  // Modal de crear / editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [enviando, setEnviando] = useState(false);

  const cargarEquipo = () => {
    fetch(`${API}/api/nutricionistas`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error("Error al cargar nutricionistas");
        return respuesta.json();
      })
      .then((datos) => setEquipo(datos))
      .catch(() => alert("No se pudo cargar el equipo de nutricionistas."));
  };

  useEffect(() => {
    cargarEquipo();
  }, []);

  const manejarAgregar = () => {
    setIdEditando(null);
    setFormulario(FORMULARIO_VACIO);
    setMostrarModal(true);
  };

  const manejarEditar = (m: Nutricionista) => {
    setIdEditando(m.id);
    setFormulario({
      jornada: "Manana",
      nombre: m.nombre,
      correo: m.correo,
      contrasena: "",
      especialidad: m.especialidad,
      fotoUrl: m.fotoUrl || "",
    });
    setMostrarModal(true);
  };

  const cambiarCampo = (campo: string, valor: string) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  // El paciente va a Agendar con el nutricionista ya elegido
  const agendarCon = (idNutricionista: number) => {
    navigate("/agendar", { state: { nutricionistaPreseleccionado: idNutricionista } });
  };

  // POST crea la cuenta + el perfil; PUT solo edita nombre, especialidad y foto
  const guardarNutricionista = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.nombre.trim() || !formulario.especialidad.trim()) {
      alert("Por favor, completa el nombre y la especialidad.");
      return;
    }
    if (!idEditando) {
      if (!formulario.correo.trim() || !formulario.contrasena.trim()) {
        alert("Por favor, ingresa el correo y la contraseña de la nueva cuenta.");
        return;
      }
      if (formulario.contrasena.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
    }

    setEnviando(true);
    try {
      let respuesta: Response;
      if (idEditando) {
        respuesta = await fetch(`${API}/api/nutricionistas/${idEditando}?idAdmin=${sesion?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formulario.nombre.trim(),
            especialidad: formulario.especialidad.trim(),
            fotoUrl: formulario.fotoUrl.trim(),
          }),
        });
      } else {
        respuesta = await fetch(`${API}/api/nutricionistas?idAdmin=${sesion?.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formulario.nombre.trim(),
            correo: formulario.correo.trim(),
            contrasena: formulario.contrasena.trim(),
            especialidad: formulario.especialidad.trim(),
            fotoUrl: formulario.fotoUrl.trim(),
          }),
        });
      }

      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo guardar el nutricionista."));
        return;
      }

      // Si es nuevo, se crean sus bloques horarios en el microservicio atenciones
      if (!idEditando) {
        const nuevo: Nutricionista = await respuesta.json();
        for (const hora of JORNADAS[formulario.jornada]) {
          const respuestaHorario = await fetch(`${API}/api/horarios?idAdmin=${sesion?.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idNutricionista: nuevo.id, hora: hora }),
          });
          if (!respuestaHorario.ok) {
            alert(await leerError(respuestaHorario, "El nutricionista se creó, pero falló un bloque horario."));
            break;
          }
        }
      }

      alert(idEditando ? "Datos actualizados correctamente." : "Nutricionista registrado correctamente.");
      setMostrarModal(false);
      cargarEquipo();
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  // Soft delete en el back (se desactiva su perfil y su cuenta)
  const manejarEliminar = async (m: Nutricionista) => {
    if (!confirm(`¿Deseas eliminar a ${m.nombre} del sistema?`)) return;

    try {
      const respuesta = await fetch(`${API}/api/nutricionistas/${m.id}?idAdmin=${sesion?.id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) {
        alert(await leerError(respuesta, "No se pudo eliminar el nutricionista."));
        return;
      }
      cargarEquipo();
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h2 className="fw-bold text-dark text-center text-md-start mb-0">
          Nuestro Equipo Médico
        </h2>

        {esAdmin && (
          <button
            className="btn btn-primary fw-bold px-3 py-2 rounded-3 shadow-sm"
            onClick={manejarAgregar}
          >
            + Agregar Nutricionista
          </button>
        )}
      </div>

      <div className="row g-4 justify-content-center">
        {equipo.map((m) => (
          <div key={m.id} className="col-12 col-md-4">
            <CardNutricionista
              nutricionista={m}
              esAdmin={esAdmin}
              esNutri={esNutri}
              alEditar={manejarEditar}
              alEliminar={manejarEliminar}
              alAgendar={agendarCon}
            />
          </div>
        ))}
      </div>

      {/* MODAL CREAR / EDITAR NUTRICIONISTA (solo Admin) */}
      {mostrarModal && (
        <ModalNutricionista
          formulario={formulario}
          editando={idEditando !== null}
          enviando={enviando}
          alCambiar={cambiarCampo}
          alGuardar={guardarNutricionista}
          alCerrar={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default Nutricionistas;

import { useState } from "react";

interface Articulo {
  titulo: string;
  desc: string;
  texto: string;
  img: string;
}

function Novedades() {
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);

  const articulos: Articulo[] = [
    {
      titulo: "5 consejos para una alimentación saludable en invierno",
      desc: "El frío nos hace buscar comidas más calóricas. Aprende a mantener una dieta equilibrada sin perder energía.",
      texto: "Prioriza frutas y verduras de temporada, toma sopas caseras, mantente hidratado, modera las porciones calóricas y no dejes de hacer actividad física. Además, asegúrate de consumir suficiente vitamina C a través de cítricos para fortalecer tu sistema inmune durante los meses más fríos.",
      img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80"
    },
    {
      titulo: "Mitos y verdades de las dietas vegetarianas y veganas",
      desc: "¿Es posible cubrir todos los nutrientes sin productos animales? Te contamos qué dice la evidencia.",
      texto: "Una dieta vegetariana o vegana bien planificada puede cubrir todos los requerimientos nutricionales de una persona adulta. Los puntos clave a vigilar son el aporte de proteínas completas (combinando legumbres y cereales), hierro no-hem (mejor absorbido junto a vitamina C), vitamina B12 (que requiere suplementación) y calcio. En NutriVida diseñamos planes personalizados de alimentación basada en plantas, asegurando que no falte ningún nutriente esencial en tu día a día.",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80"
    },
    {
      titulo: "¿Por qué controlar tu peso cada 15 días y no cada mes?",
      desc: "El seguimiento quincenal permite ajustar el plan a tiempo y mantener la motivación constante.",
      texto: "Un control más frecuente permite detectar a tiempo si el plan no funciona, corregirlo rápido y ver avances que te mantienen motivado. Además, el acompañamiento continuo de tu nutricionista ayuda a resolver dudas puntuales sobre tu pauta alimentaria.",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 text-dark">Novedades y Consejos NutriVida</h2>
      
      {/* Grilla de Tarjetas con altura uniforme */}
      <div className="row g-4">
        {articulos.map((art, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card card-nutri h-100 border-0 shadow-sm overflow-hidden d-flex flex-column justify-content-between">
              <div>
                <img
                  src={art.img}
                  alt={art.titulo}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="p-3">
                  <h5 className="fw-bold fs-6 text-dark mb-2">{art.titulo}</h5>
                  <p className="text-muted small mb-0">{art.desc}</p>
                </div>
              </div>
              <div className="p-3 pt-0 mt-auto">
                <button
                  className="btn btn-nutri-teal btn-sm w-100"
                  onClick={() => setArticuloSeleccionado(art)}
                >
                  Leer más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ventana Emergente / Modal estilo Pop-up */}
      {articuloSeleccionado && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          tabIndex={-1}
          onClick={() => setArticuloSeleccionado(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "550px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 overflow-hidden shadow-lg position-relative">
              {/* Botón flotante para cerrar (X) */}
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3 z-3 bg-white p-2 rounded-circle shadow-sm"
                aria-label="Cerrar"
                onClick={() => setArticuloSeleccionado(null)}
              ></button>

              {/* Imagen del artículo */}
              <img
                src={articuloSeleccionado.img}
                alt={articuloSeleccionado.titulo}
                className="w-100"
                style={{ height: "240px", objectFit: "cover" }}
              />

              {/* Contenido detallado */}
              <div className="modal-body p-4 text-start">
                <h4 className="fw-bold text-dark mb-3">
                  {articuloSeleccionado.titulo}
                </h4>
                <p className="text-muted small lh-lg mb-0" style={{ fontSize: "0.95rem" }}>
                  {articuloSeleccionado.texto}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Novedades;
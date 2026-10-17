function Novedades() {
  const articulos = [
    {
      titulo: "5 consejos para una alimentación saludable en invierno",
      desc: "El frío nos hace buscar comidas más calóricas. Aprende a mantener una dieta equilibrada sin perder energía.",
      img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80"
    },
    {
      titulo: "Mitos y verdades de las dietas vegetarianas y veganas",
      desc: "¿Es posible cubrir todos los nutrientes sin productos animales? Te contamos qué dice la evidencia.",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80"
    },
    {
      titulo: "¿Por qué controlar tu peso cada 15 días y no cada mes?",
      desc: "El seguimiento quincenal permite ajustar el plan a tiempo y mantener la motivación constante.",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4 text-dark">Novedades y Consejos NutriVida</h2>
      <div className="row g-4">
        {articulos.map((art, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="card card-nutri h-100 overflow-hidden">
              <img
                src={art.img}
                alt={art.titulo}
                className="card-img-top"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="fw-bold fs-6">{art.titulo}</h5>
                <p className="text-muted small">{art.desc}</p>
                <button className="btn btn-nutri-teal btn-sm w-100 mt-auto">
                  Leer más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Novedades;
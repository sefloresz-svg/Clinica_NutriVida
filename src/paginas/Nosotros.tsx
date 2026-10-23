function Nosotros() {
  return (
    <div className="container my-5">
      {/* Encabezado Principal */}
      <div className="text-center mb-5">
        <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mb-2">
          NUESTRA INSTITUCIÓN
        </span>
        <h1 className="display-5 fw-bold text-dark">Sobre Clínica NutriVida</h1>
        <p className="text-muted mx-auto fs-6" style={{ maxWidth: "700px" }}>
          Líderes en salud, nutrición clínica y rendimiento deportivo en la Región de La Araucanía desde 2018.
        </p>
      </div>

      {/* Historia y Fundación */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-12 col-lg-6">
          <h3 className="fw-bold text-dark mb-3">Nuestra Historia y Compromiso</h3>
          <p className="text-secondary leading-relaxed">
            Fundada en **2018** en la ciudad de Temuco, <strong>Clínica NutriVida</strong> nació con la visión de transformar la atención nutricional tradicional en un modelo integral, basado en evidencia científica y en el acompañamiento humano constante.
          </p>
          <p className="text-secondary leading-relaxed">
            A lo largo de los años, hemos atendido a más de 10.000 pacientes, ayudándolos a alcanzar sus metas de salud, superar patologías metabólicas y mejorar su calidad de vida mediante pautas personalizadas.
          </p>
          <div className="d-flex gap-4 mt-4">
            <div className="border-start border-4 border-success ps-3">
              <h4 className="fw-bold text-dark mb-0">+10.000</h4>
              <small className="text-muted">Pacientes Atendidos</small>
            </div>
            <div className="border-start border-4 border-primary ps-3">
              <h4 className="fw-bold text-dark mb-0">8+ Años</h4>
              <small className="text-muted">De Trayectoria</small>
            </div>
            <div className="border-start border-4 border-warning ps-3">
              <h4 className="fw-bold text-dark mb-0">100%</h4>
              <small className="text-muted">Profesionales Acreditados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
            alt="Instalaciones NutriVida"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: "380px", width: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Premios y Certificaciones de Calidad */}
      <div className="bg-light p-4 p-md-5 rounded-4 mb-5 border-0 shadow-sm">
        <h3 className="fw-bold text-dark text-center mb-4">
          🏆 Premios y Calidad Certificada
        </h3>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">🥇</div>
              <h5 className="fw-bold text-dark">Premio Excelencia en Salud 2023</h5>
              <p className="text-muted small mb-0">
                Otorgado por la Red Regional de Salud por nuestro impacto positivo en la comunidad de Temuco.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">🛡️</div>
              <h5 className="fw-bold text-dark">Acreditación Sanitaria</h5>
              <p className="text-muted small mb-0">
                Certificación vigente ante la Superintendencia de Salud con estándares de máxima seguridad clínica.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white text-center">
              <div className="fs-1 mb-2">⭐</div>
              <h5 className="fw-bold text-dark">Calidad Nutricional ISAK</h5>
              <p className="text-muted small mb-0">
                Equipo acreditado en cineantropometría nivel II para evaluación de la composición corporal exacta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ubicación y Mapa Interactivo */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark mb-1">📍 Encuéntranos en Temuco</h3>
          <p className="text-muted small">
            Visítanos en nuestra casa matriz para atención presencial o evaluaciones antropométricas.
          </p>
        </div>

        <div className="row g-4 align-items-center">
          {/* Información del Local */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Casa Matriz Temuco</h5>

              <div className="d-flex align-items-start mb-3">
                <span className="fs-5 me-3">🏢</span>
                <div>
                  <strong className="d-block text-dark small">Dirección</strong>
                  <span className="text-muted small">Av. Alemania 0820, Oficina 402, Temuco, La Araucanía</span>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <span className="fs-5 me-3">📞</span>
                <div>
                  <strong className="d-block text-dark small">Teléfono / WhatsApp</strong>
                  <span className="text-muted small">+56 9 1234 5678</span>
                </div>
              </div>

              <div className="d-flex align-items-start mb-3">
                <span className="fs-5 me-3">⏰</span>
                <div>
                  <strong className="d-block text-dark small">Horario de Atención</strong>
                  <span className="text-muted small">Lunes a Viernes: 09:00 - 18:30 hrs<br />Sábados: 09:00 - 14:00 hrs</span>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <span className="fs-5 me-3">✉️</span>
                <div>
                  <strong className="d-block text-dark small">Correo Electrónico</strong>
                  <span className="text-muted small">contacto@nutrivida.cl</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa Interactivo (Google Maps Embed) */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ height: "350px" }}>
              <iframe
                title="Ubicación Clínica NutriVida"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.532381283621!2d-72.6038472234938!3d-38.73941498770857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c3327f32a7%3A0x280e224e75d6810a!2sAv.%20Alemania%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;
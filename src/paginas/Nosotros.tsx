import { useState } from "react";

interface Sucursal {
  id: number;
  nombre: string;
  sector: string;
  direccion: string;
  telefono: string;
  horario: string;
  correo: string;
  mapaUrl: string;
}

function Nosotros() {
  // Lista de sucursales en Temuco
  const sucursales: Sucursal[] = [
    {
      id: 1,
      nombre: "Sucursal Av. Alemania (Casa Matriz)",
      sector: "Sector Av. Alemania",
      direccion: "Av. Alemania 0820, Of. 402, Temuco",
      telefono: "+56 45 233 1122",
      horario: "Lunes a Viernes: 09:00 - 18:30 hrs | Sábados: 09:00 - 14:00 hrs",
      correo: "alemania@nutrivida.cl",
      mapaUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.532381283621!2d-72.6038472234938!3d-38.73941498770857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c3327f32a7%3A0x280e224e75d6810a!2sAv.%20Alemania%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl",
    },
    {
      id: 2,
      nombre: "Sucursal Temuco Centro",
      sector: "Sector Centro / Plaza de Armas",
      direccion: "Calle Prat 540, Of. 302, Temuco",
      telefono: "+56 45 233 2233",
      horario: "Lunes a Viernes: 08:30 - 19:00 hrs | Sábados: 09:00 - 13:00 hrs",
      correo: "centro@nutrivida.cl",
      mapaUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3!2d-72.5901!3d-38.7391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c300000000%3A0x123456789abcdef!2sArturo%20Prat%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl",
    },
    {
      id: 3,
      nombre: "Sucursal Barrio Inglés",
      sector: "Sector Poniente",
      direccion: "Av. Inés de Suárez 1250, Temuco",
      telefono: "+56 45 233 4455",
      horario: "Lunes a Viernes: 09:00 - 18:00 hrs",
      correo: "barrioingles@nutrivida.cl",
      mapaUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.1!2d-72.6311!3d-38.7451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3e000000000%3A0xabcdef123456789!2sInes%20de%20Suarez%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl",
    },
    {
      id: 4,
      nombre: "Sucursal Javiera Carrera",
      sector: "Sector Portal",
      direccion: "Av. Javiera Carrera 890, Temuco",
      telefono: "+56 45 233 6677",
      horario: "Lunes a Viernes: 09:00 - 18:30 hrs",
      correo: "javieracarrera@nutrivida.cl",
      mapaUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.7!2d-72.6201!3d-38.7511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3f000000000%3A0x9876543210fedcba!2sJaviera%20Carrera%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl",
    },
  ];

  const [sucursalActiva, setSucursalActiva] = useState<Sucursal>(sucursales[0]);

  return (
    <div className="container my-5">
      {/* Encabezado Principal */}
      <div className="text-center mb-5">
        <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mb-2">
          NUESTRA INSTITUCIÓN
        </span>
        <h1 className="display-5 fw-bold text-dark">Sobre Clínica NutriVida</h1>
        <p className="text-muted mx-auto fs-6" style={{ maxWidth: "720px" }}>
          Centro de salud, nutrición clínica y rendimiento deportivo con múltiple presencia en la comuna de Temuco desde 2018.
        </p>
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
              <h4 className="fw-bold text-dark mb-0">4</h4>
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

        {/* Lado Derecho: Puntos de Atención ARRIBA + Mapa en reemplazo de la foto */}
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
                    sucursalActiva.id === suc.id
                      ? "btn-success shadow-sm"
                      : "btn-outline-secondary bg-white"
                  }`}
                >
                  🏥 {suc.nombre.replace("Sucursal ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Visor de Mapa en la posición que antes ocupaba la foto */}
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden"
            style={{ height: "290px" }}
          >
            <iframe
              key={sucursalActiva.id}
              title={`Mapa ${sucursalActiva.nombre}`}
              src={sucursalActiva.mapaUrl}
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

      {/* TARJETA DE DETALLES UBICADA ABAJO DE LA HISTORIA Y DEL MAPA */}
      <div className="mb-5">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-1 rounded-pill small">
                  {sucursalActiva.sector}
                </span>
                <h4 className="fw-bold text-dark mb-0">{sucursalActiva.nombre}</h4>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start">
                    <span className="fs-5 me-2">📍</span>
                    <div>
                      <strong className="d-block text-dark small">Dirección</strong>
                      <span className="text-muted small">{sucursalActiva.direccion}</span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start">
                    <span className="fs-5 me-2">📞</span>
                    <div>
                      <strong className="d-block text-dark small">Teléfono / Recepción</strong>
                      <span className="text-muted small">{sucursalActiva.telefono}</span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start">
                    <span className="fs-5 me-2">⏰</span>
                    <div>
                      <strong className="d-block text-dark small">Horario de Atención</strong>
                      <span className="text-muted small">{sucursalActiva.horario}</span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-start">
                    <span className="fs-5 me-2">✉️</span>
                    <div>
                      <strong className="d-block text-dark small">Correo Electrónico</strong>
                      <span className="text-muted small">{sucursalActiva.correo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <div className="bg-light p-3 rounded-4 text-center text-lg-start border">
                <small className="text-muted d-block mb-2 fw-medium">
                  ¿Quieres agendar en este centro?
                </small>
                <a href="/agendar" className="btn btn-success w-100 fw-bold rounded-3 py-2">
                  Agendar Cita en {sucursalActiva.nombre.replace("Sucursal ", "")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Reconocimientos y Calidad */}
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
    </div>
  );
}

export default Nosotros;
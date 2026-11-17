package cl.nutrivida.servicios.repository;

import cl.nutrivida.servicios.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
}

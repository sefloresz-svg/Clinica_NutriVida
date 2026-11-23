package cl.nutrivida.contenido.repository;

import cl.nutrivida.contenido.model.Novedad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NovedadRepository extends JpaRepository<Novedad, Long> {

    // Las mas nuevas primero
    List<Novedad> findAllByOrderByFechaPublicacionDescIdDesc();
}

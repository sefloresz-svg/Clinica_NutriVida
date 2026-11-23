package cl.nutrivida.contenido.repository;

import cl.nutrivida.contenido.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    // Solo los que se muestran en el catalogo
    List<Servicio> findByActivoTrueOrderByIdAsc();

    boolean existsByCodigo(String codigo);

    // Para editar: el codigo no puede repetirse en OTRO servicio
    boolean existsByCodigoAndIdNot(String codigo, Long id);
}

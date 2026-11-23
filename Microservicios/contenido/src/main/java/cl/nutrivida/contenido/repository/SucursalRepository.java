package cl.nutrivida.contenido.repository;

import cl.nutrivida.contenido.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    List<Sucursal> findAllByOrderByIdAsc();
}

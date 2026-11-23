package cl.nutrivida.atenciones.repository;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.nutrivida.atenciones.model.HorarioNutricionista;

public interface HorarioNutricionistaRepository extends JpaRepository<HorarioNutricionista, Long> {

    List<HorarioNutricionista> findByIdNutricionistaOrderByHoraAsc(Long idNutricionista);

    boolean existsByIdNutricionistaAndHora(Long idNutricionista, LocalTime hora);
}

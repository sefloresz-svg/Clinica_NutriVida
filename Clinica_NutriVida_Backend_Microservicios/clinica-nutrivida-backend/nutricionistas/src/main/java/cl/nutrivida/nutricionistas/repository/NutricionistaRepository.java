package cl.nutrivida.nutricionistas.repository;

import cl.nutrivida.nutricionistas.model.Nutricionista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NutricionistaRepository extends JpaRepository<Nutricionista, Long> {
}

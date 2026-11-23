package cl.nutrivida.atenciones.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.nutrivida.atenciones.model.Cita;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findAllByOrderByFechaAscHoraAsc();

    List<Cita> findByIdPacienteOrderByFechaAscHoraAsc(Long idPaciente);

    List<Cita> findByIdNutricionistaOrderByFechaAscHoraAsc(Long idNutricionista);

    boolean existsByIdNutricionistaAndFechaAndHoraAndEstadoNot(Long idNutricionista, LocalDate fecha,
                                                               LocalTime hora, String estado);

    boolean existsByIdPacienteAndFechaAndHoraAndEstadoNot(Long idPaciente, LocalDate fecha,
                                                          LocalTime hora, String estado);

    List<Cita> findByIdNutricionistaAndFechaAndEstadoNot(Long idNutricionista, LocalDate fecha, String estado);

    long countByFechaAndEstadoNot(LocalDate fecha, String estado);

    long countByEstado(String estado);

    List<Cita> findByFechaBetweenAndEstadoNot(LocalDate desde, LocalDate hasta, String estado);
}
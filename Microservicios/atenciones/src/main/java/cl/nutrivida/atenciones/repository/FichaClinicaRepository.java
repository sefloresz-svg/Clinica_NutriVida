package cl.nutrivida.atenciones.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.nutrivida.atenciones.model.FichaClinica;

public interface FichaClinicaRepository extends JpaRepository<FichaClinica, Long> {

    Optional<FichaClinica> findByIdPaciente(Long idPaciente);
}

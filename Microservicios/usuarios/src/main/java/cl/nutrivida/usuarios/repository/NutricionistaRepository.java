package cl.nutrivida.usuarios.repository;

import cl.nutrivida.usuarios.model.Nutricionista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NutricionistaRepository extends JpaRepository<Nutricionista, Long> {

    // Solo los que se muestran en la pagina del equipo
    List<Nutricionista> findByActivoTrueOrderByIdAsc();

    // Busca el perfil a partir del id del usuario (usuario.id)
    Optional<Nutricionista> findByUsuarioId(Long idUsuario);
}

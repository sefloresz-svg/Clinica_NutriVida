package cl.nutrivida.usuarios.repository;

import cl.nutrivida.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    boolean existsByRut(String rut);

    // Para el KPI "Pacientes activos" del panel de administracion
    long countByRolAndActivoTrue(String rol);
}

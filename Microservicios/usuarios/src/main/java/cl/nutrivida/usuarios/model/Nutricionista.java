package cl.nutrivida.usuarios.model;

import jakarta.persistence.*;
import lombok.Data;

// Perfil profesional que aparece en la pagina "Nuestro Equipo". Es 1:1 con su usuario
@Data
@Entity
@Table(name = "nutricionista")
public class Nutricionista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nutricionista")
    private Long id;

    // FK real: usuario y nutricionista viven en el mismo microservicio
    // El nombre NO se repite aqui, se saca de usuario.nombre (3FN)
    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "especialidad", nullable = false, length = 150)
    private String especialidad;

    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    // Soft delete: las citas antiguas siguen apuntando a este nutricionista
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
}

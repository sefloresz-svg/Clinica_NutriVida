package cl.nutrivida.contenido.dto;

import lombok.Data;

// Lo que responde el microservicio usuarios en GET /api/usuarios/{id}.
// Los nombres deben ser IGUALES a los de alla, o llegan en null.
@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String rol;
    private Boolean activo;
}
